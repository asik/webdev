# Nullable `Map`/`Bind`/`Iter` extensions vs pattern matching: .NET 10 vs .NET 11

The question: does .NET 11 inline the delegate in `value.Map(p => p.Length())` well enough
that it costs about the same as `if (value is { } p) ...`?

**Short answer: no.** .NET 11 made the pattern-matching version about 2× faster, but the
delegate versions ran at the same speed as on .NET 10 or slower. So the gap got *wider*.

## Setup

- 1024 `Vector2?` per benchmark call, ~75% non-null in a random pattern. Each call sums a
  result so the JIT can't remove the work. Divide `Mean` by 1024 to get the cost per element.
- BenchmarkDotNet 0.15.8 with the in-process toolchain. The one build (`net10.0`) was run on the
  .NET 10.0.15 runtime and on the .NET 11.0.0 runtime (`dotnet exec --fx-version`). The default
  out-of-process toolchain would need the .NET 11 SDK, which wasn't available here.
- Intel Xeon 2.3 GHz, 4 cores, a cloud VM running Linux x64. Absolute numbers are noisy on a VM;
  the ratios are what matter.
- Default runtime settings: Tiered PGO on. That is what lets the JIT use *guarded*
  devirtualization for delegates.
- `Console.WriteLine` in `Iter` was replaced with a write to a static field, so the benchmark
  measures the call and not console I/O.
- `*_StructFunctor` is an extra variant, not part of your code: the same API written with a
  `struct` implementing `IFunc<T,TResult>` instead of a delegate (see `NullableExtensions.cs`).

## Results

| Benchmark | .NET 10 | ratio | .NET 11 | ratio | alloc |
|---|---:|---:|---:|---:|---:|
| **Map_Pattern** | 1,324 ns | 1.00 | **616 ns** | 1.00 | – |
| Map_Extension (lambda) | 2,168 ns | 1.64 | 2,122 ns | **3.45** | – |
| Map_StructFunctor | 1,329 ns | 1.00 | 688 ns | 1.12 | – |
| **Bind_Pattern** | 998 ns | 1.00 | **701 ns** | 1.00 | – |
| Bind_Extension (method group) | 6,703 ns | 6.72 | 8,349 ns | **11.9** | – |
| Bind_Extension (lambda)\* | 8,427 ns | 7.84 | 9,759 ns | **14.3** | – |
| Bind_StructFunctor | 1,293 ns | 1.30 | 999 ns | 1.43 | – |
| **Iter_Pattern** | 1,622 ns | 1.00 | 1,646 ns | 1.00 | – |
| Iter_Extension (static lambda) | 1,600 ns | 0.99 | 1,607 ns | 0.98 | – |
| Iter_Extension (capturing lambda) | 1,883 ns | 1.16 | 1,936 ns | 1.18 | **88–96 B/call** |

\* From a second run of just the Bind benchmarks (`results/*-bind-with-lambda.log`), where the
other Bind rows were within about 5% of the numbers above.

Full logs and JIT disassembly are in `results/`.

## What the JIT actually does (`DOTNET_JitDisasm`, final Tier-1 code)

- **The extension method itself is always inlined.** `Map`/`Bind`/`Iter` are small generic methods
  over structs, so that part costs nothing.
- **The delegate call is devirtualized only behind a guard, on .NET 10 and .NET 11 alike.** With
  PGO the JIT emits `cmp qword ptr [rax+0x18], <expected method>`. If the delegate points to the
  expected method, the lambda body runs inlined. If not, it falls back to
  `call [rax+0x18] Func.Invoke`. On top of the guard, every element still pays to load the cached
  delegate from its static field, null-check it (lazy creation), and compare the target. I saw no
  .NET 11 change that removes the guard. The JIT can't prove which delegate is in that field, so
  it can't turn the call into a plain direct call.
- **Side effects of the fallback path:** because a real call may happen, the accumulator (`sum`)
  is kept in memory instead of a register, and the `Nullable<Vector2>` result is copied through
  the stack. The extra branches likely also hurt branch prediction on a random null pattern; I
  didn't measure that directly. My best explanation for `Bind` being 7–14× slower is these effects
  combined, since its loop has the most branches.
- **The method group and the lambda behave the same.** Both are cached, neither allocates, and
  both are slow. Switching to a lambda doesn't help.
- **Capturing lambdas still allocate on .NET 11.** `arr[i].Iter(p => sum += p.X)` allocates a
  closure and a delegate, about 90 B for each call to the benchmark method. The .NET 10/11 escape
  analysis does not stack-allocate them here. In a game loop that is garbage-collector pressure
  every frame.
- `Iter` shows no difference because the write to a static field on every element is the
  bottleneck, which hides the call overhead. Don't read it as "Iter is free".
- **Struct functors match pattern matching** on both runtimes (within 0–40%): the call is direct
  and inlined, with no guard. If you want the functional API in hot paths, this is the shape to
  use, but it's clunkier to write.

## Recommendation for engine code

Use `is { } p` (or `HasValue`/`GetValueOrDefault()`) in hot loops. `Map`/`Bind`/`Iter` with
delegates are fine in cold code (editor, tools, setup). On .NET 11 they cost 3–14× in tight loops,
and capturing lambdas allocate.

## Reproduce

```bash
dotnet build -c Release
# Run on whichever runtime you want (needs that shared runtime installed):
dotnet exec --fx-version 11.0.0 bin/Release/net10.0/NullableBench.dll --filter '*'
dotnet exec --fx-version 10.0.15 bin/Release/net10.0/NullableBench.dll --filter '*'
# Smoke test:            ... --filter '*' --quick
# JIT disassembly:       DOTNET_JitDisasm='Map_* Bind_* Iter_*' DOTNET_JitStdOutFile=out.txt \
#                        dotnet exec --fx-version 11.0.0 bin/Release/net10.0/NullableBench.dll --disasm
```

With a .NET 11 SDK, you can instead set `<TargetFrameworks>net10.0;net11.0</TargetFrameworks>`
and use BenchmarkDotNet's normal out-of-process jobs (`--runtimes net10.0 net11.0`). That needs a
BenchmarkDotNet version that recognizes .NET 11; 0.15.8 crashes on it.

## See also

F# comparison (`inline` + `[<InlineIfLambda>]`, `FSharpFunc` closures, `ValueOption`): `../NullableBenchFs/README.md`.
