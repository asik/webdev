using System.Runtime.InteropServices;
using BenchmarkDotNet.Columns;
using BenchmarkDotNet.Configs;
using BenchmarkDotNet.Jobs;
using BenchmarkDotNet.Running;
using BenchmarkDotNet.Toolchains.InProcess.Emit;

// In-process toolchain: the benchmark runs on whatever runtime launched this process, so the same
// build can be measured on .NET 10 and .NET 11 (`dotnet exec --fx-version ...`, see README.md).
Console.WriteLine($"Runtime: {RuntimeInformation.FrameworkDescription}");

// "--disasm": just warm every benchmark method into Tier-1 (with PGO) so DOTNET_JitDisasm can dump
// the final code. Run with DOTNET_JitDisasm="Map_* Bind_* Iter_*" DOTNET_JitStdOutFile=<file>.
if (args.Contains("--disasm"))
{
    var b = new NullableBench.NullableBenchmarks();
    b.Setup();
    var methods = typeof(NullableBench.NullableBenchmarks).GetMethods()
        .Where(m => m.GetCustomAttributes(typeof(BenchmarkDotNet.Attributes.BenchmarkAttribute), false).Length > 0)
        .Select(m => m.CreateDelegate<Func<float>>(b)).ToArray();
    for (int round = 0; round < 20; round++)
    {
        foreach (var m in methods) for (int i = 0; i < 200; i++) m();
        Thread.Sleep(50); // let the tiering background thread promote methods
    }
    return;
}

// "--quick" = smoke test (Job.Dry). Don't use BDN's own --job switch: it adds an out-of-process job.
bool quick = args.Contains("--quick");
args = args.Where(a => a != "--quick").ToArray();

var config = DefaultConfig.Instance
    .AddJob((quick ? Job.Dry : Job.Default).WithToolchain(InProcessEmitToolchain.Instance).WithId(Environment.Version.Major >= 11 ? "net11" : "net10"))
    .AddColumn(CategoriesColumn.Default)
    .WithOrderer(new BenchmarkDotNet.Order.DefaultOrderer(BenchmarkDotNet.Order.SummaryOrderPolicy.Declared))
    .AddLogicalGroupRules(BenchmarkLogicalGroupRule.ByCategory)
    .WithArtifactsPath(Path.Combine(AppContext.BaseDirectory, "../../../BenchmarkDotNet.Artifacts", $"net{Environment.Version.Major}"));

BenchmarkSwitcher.FromAssembly(typeof(Program).Assembly).Run(args, config);
