# F# version: own `Nullable` module vs a manual `HasValue` check

The same test as `../NullableBench` (C#): 1024 `Vector2?` values per call, ~75% non-null, same
seed and the same in-process BenchmarkDotNet setup, run on .NET 10.0.15 and .NET 11.0.0. See that
README for how the runtimes were set up.

## Variants

| Name | What it is |
|---|---|
| `HasValue` | Manual `if v.HasValue then ... v.Value` (baseline) |
| `ActivePattern` | `match v with Value p -> ...` using a `[<return: Struct>]` active pattern |
| `Module_Inline` | Your own `Nullable.map/bind/iter`, declared `inline` with `[<InlineIfLambda>]` |
| `Module_NoInline` | The same functions without `inline`: they take an `FSharpFunc` closure (abstract class, virtual `Invoke`). This is the F# equivalent of the C# `Func` version |
| `ValueOption_*` | Idiomatic F#: data stored as `ValueOption<Vector2>`, using FSharp.Core `ValueOption.map/bind` (which are already `inline`) or `match ... with ValueSome` |

Confirmed in the compiled IL: only the `Module_NoInline` call sites produce closure classes. With
`inline` + `[<InlineIfLambda>]` (and in FSharp.Core's `ValueOption`) the F# compiler substitutes
the lambda body directly, so no function object reaches the JIT.

## Results

| Benchmark | .NET 10 | ratio | .NET 11 | ratio | alloc |
|---|---:|---:|---:|---:|---:|
| **Map_HasValue** | 1,310 ns | 1.00 | **602 ns** | 1.00 | – |
| Map_ActivePattern | 1,622 ns | 1.24 | 851 ns | 1.41 | – |
| Map_Module_Inline | 1,515 ns | 1.16 | 814 ns | 1.35 | – |
| Map_Module_NoInline | 1,454 ns | 1.11 | 684 ns | 1.14 | – |
| Map_ValueOption_Match | 1,310 ns | 1.00 | 630 ns | 1.05 | – |
| Map_ValueOption_Module | 1,451 ns | 1.11 | 677 ns | 1.12 | – |
| **Bind_HasValue** | 995 ns | 1.00 | 992 ns | 1.00 | – |
| Bind_Module_Inline | 1,491 ns | 1.50 | 1,519 ns | 1.53 | – |
| Bind_Module_NoInline | 11,295 ns | **11.4** | 11,208 ns | **11.3** | – |
| Bind_ValueOption_Module | 1,271 ns | 1.28 | 1,157 ns | 1.17 | – |
| **Iter_HasValue** | 1,604 ns | 1.00 | 1,619 ns | 1.00 | – |
| Iter_Module_Inline | 1,611 ns | 1.00 | 1,622 ns | 1.00 | – |
| Iter_Module_NoInline | 1,617 ns | 1.01 | 1,618 ns | 1.00 | – |
| Iter_Module_Inline_Capturing | 443 ns | 0.28 | 437 ns | 0.27 | – |
| Iter_Module_NoInline_Capturing | 7,478 ns | **4.7** | 6,855 ns | **4.2** | **24,600 B** |

As in C#, the `Iter` baseline is limited by the write to a static field on every element.
`Inline_Capturing` is "faster" only because its accumulator is a `ref` cell that ends up in a
register (the F# compiler removed the closure and the JIT then removed the allocation), not
because the call itself got cheaper.

## F# vs C# (.NET 11, ratio vs the language's own manual check)

| | C# delegate extension | F# non-inline (`FSharpFunc`) | F# `inline` + `InlineIfLambda` | F# `ValueOption` (FSharp.Core) |
|---|---:|---:|---:|---:|
| Map | 3.45× | 1.14× | 1.35× | 1.12× |
| Bind | 11.9–14.3× | 11.3× | 1.53× | 1.17× |
| Iter, capturing | 1.18× + 88 B per call | 4.2× + 24 B **per element** | 0.27× (no alloc) | – |

The baselines are the same machine code in both languages (C# `Map_Pattern` 616 ns, F# `Map_HasValue`
602 ns on .NET 11), so the ratios can be compared directly.

## Why (from `DOTNET_JitDisasm`, final Tier-1 code; logs in `results/`)

- **`inline` + `[<InlineIfLambda>]` is the reliable fix.** The F# compiler expands the function
  before the JIT sees it, so on both runtimes there is no delegate, no guard and no allocation,
  even for capturing lambdas. The remaining 15–50% over the manual check is how the JIT arranges
  the inlined `Nullable` code (an extra flag test and branch), not a call.
- **The F# non-inline `Map` was fully devirtualized with no guard.** That is better than C#.
  A non-capturing F# lambda compiles to a sealed class with a single shared instance stored in a
  `static readonly` field. At Tier-1 the JIT knows that field's exact type, so it removes the
  virtual `Invoke` and inlines the body, leaving no `call` and no type check. The C# compiler
  caches its delegate in a lazily-set, non-readonly field, so the JIT can only use the guarded
  path (`cmp [delegate+0x18], expected; jne fallback`).
- **That only works when the JIT inlines the outer function, which isn't guaranteed.**
  For `Bind_Module_NoInline` the JIT declined to inline `NullableNoInline.bind` (the code still has
  `call NullableNoInline:bind`). Inside `bind`, `f.Invoke` is then a real virtual call, giving 11×,
  the same as C#. Whether the JIT inlines a function is a heuristic you don't control; `inline` in
  F# is a guarantee.
- **Capturing closures without `inline` are the worst case:** a new closure object for every
  element (24 B × 1024), because the closure is created at the call site inside the loop. The C#
  version allocated once per call to the benchmark method instead.
- **.NET 11 vs .NET 10:** the code without calls got faster (`Map` ~2×, same as C#). The F#
  variants that still make a real call (`Bind_Module_NoInline`, capturing `NoInline`) didn't
  change, which matches the C# result.

## Takeaway for engine code

- In F#, write these helpers as `let inline f ([<InlineIfLambda>] g) ...`. That gives the
  functional style at (near) manual-check cost, with no allocations, on both .NET 10 and .NET 11.
- Or use `ValueOption` and FSharp.Core's `ValueOption.*` functions, which are already written that
  way and were the fastest functional option here.
- Avoid non-`inline` higher-order helpers in hot loops, and especially lambdas that capture a
  local.

## Reproduce

```bash
dotnet build -c Release
dotnet exec --fx-version 11.0.0 bin/Release/net10.0/NullableBenchFs.dll --filter '*'
# --quick for a smoke test, --disasm (+ DOTNET_JitDisasm / DOTNET_JitStdOutFile) for codegen
```
