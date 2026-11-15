using System.Runtime.CompilerServices;

namespace NullableBench;

// The approach under test, verbatim.
public static class NullableExtensions
{
    public static TResult? Map<T, TResult>(this T? value, Func<T, TResult> selector)
        where T : struct
        where TResult : struct
    {
        return value.HasValue ? selector(value.Value) : null;
    }

    public static TResult? Bind<T, TResult>(this T? value, Func<T, TResult?> selector)
        where T : struct
        where TResult : struct
    {
        return value.HasValue ? selector(value.Value) : null;
    }

    public static void Iter<T>(this T? value, Action<T> action)
        where T : struct
    {
        if (value.HasValue)
            action(value.Value);
    }
}

// Reference alternative: struct "function objects". Generic over a struct TFunc, so the JIT
// specializes per functor and the call is a direct, inlineable call — no delegate involved.
public interface IFunc<in T, out TResult> { TResult Invoke(T arg); }

public static class NullableStructExtensions
{
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static TResult? Map<T, TResult, TFunc>(this T? value, TFunc f)
        where T : struct where TResult : struct where TFunc : struct, IFunc<T, TResult>
        => value.HasValue ? f.Invoke(value.GetValueOrDefault()) : null;

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static TResult? Bind<T, TResult, TFunc>(this T? value, TFunc f)
        where T : struct where TResult : struct where TFunc : struct, IFunc<T, TResult?>
        => value.HasValue ? f.Invoke(value.GetValueOrDefault()) : null;
}
