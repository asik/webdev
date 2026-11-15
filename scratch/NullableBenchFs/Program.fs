module Program

open System
open System.IO
open System.Runtime.InteropServices
open BenchmarkDotNet.Attributes
open BenchmarkDotNet.Columns
open BenchmarkDotNet.Configs
open BenchmarkDotNet.Jobs
open BenchmarkDotNet.Order
open BenchmarkDotNet.Running
open BenchmarkDotNet.Toolchains.InProcess.Emit
open NullableBenchFs

[<EntryPoint>]
let main argv =
    printfn "Runtime: %s" RuntimeInformation.FrameworkDescription
    if Array.contains "--disasm" argv then
        // Warm every benchmark into Tier-1 for DOTNET_JitDisasm (same as the C# project).
        let b = NullableBenchmarks()
        b.Setup()
        let methods =
            typeof<NullableBenchmarks>.GetMethods()
            |> Array.filter (fun m -> m.GetCustomAttributes(typeof<BenchmarkAttribute>, false).Length > 0)
            |> Array.map (fun m -> m.CreateDelegate<Func<float32>>(b))
        for _ in 1..20 do
            for m in methods do
                for _ in 1..200 do m.Invoke() |> ignore
            Threading.Thread.Sleep 50
        0
    else
        let quick = Array.contains "--quick" argv
        let args = argv |> Array.filter ((<>) "--quick")
        let job = (if quick then Job.Dry else Job.Default).WithToolchain(InProcessEmitToolchain.Instance)
        let config =
            DefaultConfig.Instance
                .AddJob(job.WithId(if Environment.Version.Major >= 11 then "net11" else "net10"))
                .AddColumn(CategoriesColumn.Default)
                .WithOrderer(DefaultOrderer(SummaryOrderPolicy.Declared))
                .AddLogicalGroupRules(BenchmarkLogicalGroupRule.ByCategory)
                .WithArtifactsPath(Path.Combine(AppContext.BaseDirectory, "../../../BenchmarkDotNet.Artifacts", $"net{Environment.Version.Major}"))
        BenchmarkSwitcher.FromAssembly(typeof<NullableBenchmarks>.Assembly).Run(args, config) |> ignore
        0
