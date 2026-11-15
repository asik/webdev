using System.Reflection;
using System.Reflection.Emit;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

// Probe 1: which LINQ iterator type each pipeline builds (shows runtime fusion).
// Probe 2: bytes allocated by each pipeline (one array of N ints = 24 + 4N bytes).
// Probe 3: which methods the C# compiler actually calls for collection expressions.
Console.WriteLine($"Runtime: {RuntimeInformation.FrameworkDescription}\n");
const int N = 1000;
int[] arr = Enumerable.Range(0, N).ToArray();
List<int> list = [.. arr];

Show("Range.Select", () => Enumerable.Range(0, N).Select(x => x * 2));
Show("Range.Where", () => Enumerable.Range(0, N).Where(x => x % 2 == 0));
Show("array.Where.Select", () => arr.Where(x => x % 2 == 0).Select(x => x * 2));
Show("array.Select.Where", () => arr.Select(x => x * 2).Where(x => x % 2 == 0));
Show("array.Select.Select", () => arr.Select(x => x * 2).Select(x => x + 1));
Show("array.Where.Where", () => arr.Where(x => x > 1).Where(x => x % 2 == 0));
Show("list.Where.Select", () => list.Where(x => x % 2 == 0).Select(x => x * 2));
Console.WriteLine();

Alloc("Range.Select.ToArray()", () => Enumerable.Range(0, N).Select(x => x * 2).ToArray());
Alloc("[.. Range.Select]", () => P.SpreadRangeSelect(N));
Alloc("[.. Range.Select, 42]", () => P.SpreadRangeSelectPlusOne(N));
Alloc("array.Select.ToArray()", () => arr.Select(x => x * 2).ToArray());
Alloc("array.Where.Select.ToArray()", () => arr.Where(x => x % 2 == 0).Select(x => x * 2).ToArray());
Alloc("array.Select.Where.ToArray()", () => arr.Select(x => x * 2).Where(x => x % 2 == 0).ToArray());
Alloc("manual for loop (N/2 array)", () => { var r = new int[N / 2]; for (int i = 0; i < r.Length; i++) r[i] = arr[i * 2] * 2; return r; });
Alloc("arr.Select(..).Sum()", () => arr.Select(x => x * 2).Sum());
Alloc("arr.Sum()", () => arr.Sum());
Console.WriteLine();

foreach (var name in new[] { nameof(P.SpreadRangeSelect), nameof(P.SpreadRangeSelectPlusOne), nameof(P.SpreadList), nameof(P.QuerySyntax) })
    Console.WriteLine($"{name,-26} calls: {string.Join(", ", Calls(typeof(P).GetMethod(name)!))}");

static void Show(string name, Func<object> f)
{
    var t = f().GetType();
    Console.WriteLine($"{name,-22} -> {t.Name.Split('`')[0]}");
}

static void Alloc(string name, Func<object> f)
{
    for (int i = 0; i < 50; i++) f(); // warm up / tier up
    long before = GC.GetAllocatedBytesForCurrentThread();
    const int reps = 100;
    for (int i = 0; i < reps; i++) f();
    long bytes = (GC.GetAllocatedBytesForCurrentThread() - before) / reps;
    Console.WriteLine($"{name,-32} {bytes,7} B/op");
}

// Minimal IL scan: list call/callvirt/newobj targets.
static IEnumerable<string> Calls(MethodInfo m)
{
    var il = m.GetMethodBody()!.GetILAsByteArray()!;
    var ops = typeof(OpCodes).GetFields().Select(f => (OpCode)f.GetValue(null)!)
        .ToDictionary(o => o.Value);
    for (int i = 0; i < il.Length;)
    {
        short v = il[i] == 0xFE ? (short)(0xFE00 | il[i + 1]) : il[i];
        var op = ops[v];
        i += op.Size;
        if (op == OpCodes.Call || op == OpCodes.Callvirt || op == OpCodes.Newobj)
        {
            var mb = m.Module.ResolveMethod(BitConverter.ToInt32(il, i))!;
            yield return $"{mb.DeclaringType!.Name.Split('`')[0]}.{mb.Name}";
        }
        i += op.OperandType switch
        {
            OperandType.InlineNone => 0,
            OperandType.ShortInlineBrTarget or OperandType.ShortInlineI or OperandType.ShortInlineVar => 1,
            OperandType.InlineVar => 2,
            OperandType.InlineI8 or OperandType.InlineR => 8,
            OperandType.InlineSwitch => 4 + 4 * BitConverter.ToInt32(il, i),
            _ => 4,
        };
    }
}

public static class P
{
    [MethodImpl(MethodImplOptions.NoInlining)]
    public static int[] SpreadRangeSelect(int n) => [.. Enumerable.Range(0, n).Select(x => x * 2)];
    [MethodImpl(MethodImplOptions.NoInlining)]
    public static int[] SpreadRangeSelectPlusOne(int n) => [.. Enumerable.Range(0, n).Select(x => x * 2), 42];
    public static int[] SpreadList(List<int> l) => [.. l];
    public static int[] QuerySyntax(int[] a) => (from x in a where x > 1 select x * 2).ToArray();
}
