using System.Numerics;
using System.Runtime.CompilerServices;
using BenchmarkDotNet.Attributes;

namespace NullableBench;

// Each benchmark walks 1024 Vector2? values (~75% non-null, random pattern so the branch is
// not trivially predictable) and accumulates a result so nothing is dead-code eliminated.
// Per-element cost = Mean / 1024.
[MemoryDiagnoser]
public class NullableBenchmarks
{
    public const int N = 1024;
    private Vector2?[] _positions = null!;
    private static float s_sink;

    [GlobalSetup]
    public void Setup()
    {
        var rng = new Random(42);
        _positions = new Vector2?[N];
        for (int i = 0; i < N; i++)
            _positions[i] = rng.NextDouble() < 0.75
                ? new Vector2((float)rng.NextDouble() * 100f, (float)rng.NextDouble() * 100f)
                : null;
    }

    // "Engine" function used by Bind. NoInlining is NOT applied: the JIT is free to inline it.
    private static Vector2? AdjustPosition(Vector2 p)
        => p.X > 50f ? new Vector2(p.X - 50f, p.Y) : null;

    // ---------------- Map ----------------

    [Benchmark(Baseline = true), BenchmarkCategory("Map")]
    public float Map_Pattern()
    {
        float sum = 0;
        var arr = _positions;
        for (int i = 0; i < arr.Length; i++)
            if (arr[i] is { } p)
                sum += p.Length();
        return sum;
    }

    [Benchmark, BenchmarkCategory("Map")]
    public float Map_Extension()
    {
        float sum = 0;
        var arr = _positions;
        for (int i = 0; i < arr.Length; i++)
            sum += arr[i].Map(p => p.Length()) ?? 0f;
        return sum;
    }

    [Benchmark, BenchmarkCategory("Map")]
    public float Map_StructFunctor()
    {
        float sum = 0;
        var arr = _positions;
        for (int i = 0; i < arr.Length; i++)
            sum += arr[i].Map<Vector2, float, LengthFunc>(default) ?? 0f;
        return sum;
    }

    // ---------------- Bind ----------------

    [Benchmark(Baseline = true), BenchmarkCategory("Bind")]
    public float Bind_Pattern()
    {
        float sum = 0;
        var arr = _positions;
        for (int i = 0; i < arr.Length; i++)
            if (arr[i] is { } p && AdjustPosition(p) is { } a)
                sum += a.X;
        return sum;
    }

    [Benchmark, BenchmarkCategory("Bind")]
    public float Bind_Extension_MethodGroup()
    {
        float sum = 0;
        var arr = _positions;
        for (int i = 0; i < arr.Length; i++)
        {
            Vector2? adjusted = arr[i].Bind(AdjustPosition); // C# 11+ caches static method-group delegates
            if (adjusted is { } a) sum += a.X;
        }
        return sum;
    }

    [Benchmark, BenchmarkCategory("Bind")]
    public float Bind_StructFunctor()
    {
        float sum = 0;
        var arr = _positions;
        for (int i = 0; i < arr.Length; i++)
        {
            Vector2? adjusted = arr[i].Bind<Vector2, Vector2, AdjustFunc>(default);
            if (adjusted is { } a) sum += a.X;
        }
        return sum;
    }

    // ---------------- Iter ----------------
    // Console.WriteLine would dominate (I/O), so the side effect is a write to a static field.

    [Benchmark(Baseline = true), BenchmarkCategory("Iter")]
    public float Iter_Pattern()
    {
        var arr = _positions;
        for (int i = 0; i < arr.Length; i++)
            if (arr[i] is { } p)
                s_sink += p.X;
        return s_sink;
    }

    [Benchmark, BenchmarkCategory("Iter")]
    public float Iter_Extension_Static()
    {
        var arr = _positions;
        for (int i = 0; i < arr.Length; i++)
            arr[i].Iter(static p => s_sink += p.X);
        return s_sink;
    }

    // Realistic gotcha: the lambda captures a local -> closure + delegate allocated per call.
    [Benchmark, BenchmarkCategory("Iter")]
    public float Iter_Extension_Capturing()
    {
        float sum = 0;
        var arr = _positions;
        for (int i = 0; i < arr.Length; i++)
            arr[i].Iter(p => sum += p.X);
        return sum;
    }

    private struct LengthFunc : IFunc<Vector2, float>
    {
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public float Invoke(Vector2 p) => p.Length();
    }

    private struct AdjustFunc : IFunc<Vector2, Vector2?>
    {
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Vector2? Invoke(Vector2 p) => AdjustPosition(p);
    }
}
