namespace NullableBenchFs

open System
open System.Numerics
open BenchmarkDotNet.Attributes

// Plain static field (no F# static-init checks on access).
[<AbstractClass; Sealed>]
type Sink =
    [<DefaultValue>] static val mutable private value: float32
    static member Value with get () = Sink.value and set v = Sink.value <- v

// Same shape as the C# benchmarks: 1024 Vector2? (~75% non-null, random, same seed), result
// accumulated so nothing is dead-code eliminated. Per-element cost = Mean / 1024.
[<MemoryDiagnoser>]
type NullableBenchmarks() =
    let mutable positions: Nullable<Vector2>[] = null
    let mutable vpositions: ValueOption<Vector2>[] = null

    static let adjustPosition (p: Vector2) : Nullable<Vector2> =
        if p.X > 50.0f then Nullable(Vector2(p.X - 50.0f, p.Y)) else Nullable()

    static let adjustPositionV (p: Vector2) : ValueOption<Vector2> =
        if p.X > 50.0f then ValueSome(Vector2(p.X - 50.0f, p.Y)) else ValueNone

    [<GlobalSetup>]
    member _.Setup() =
        let rng = Random(42)
        positions <-
            Array.init 1024 (fun _ ->
                if rng.NextDouble() < 0.75 then
                    Nullable(Vector2(float32 (rng.NextDouble()) * 100.0f, float32 (rng.NextDouble()) * 100.0f))
                else Nullable())
        vpositions <- positions |> Array.map (fun v -> if v.HasValue then ValueSome v.Value else ValueNone)

    // ---------------- Map ----------------

    [<Benchmark(Baseline = true); BenchmarkCategory("Map")>]
    member _.Map_HasValue() =
        let arr = positions
        let mutable sum = 0.0f
        for i in 0 .. arr.Length - 1 do
            let v = arr.[i]
            if v.HasValue then sum <- sum + v.Value.Length()
        sum

    [<Benchmark; BenchmarkCategory("Map")>]
    member _.Map_ActivePattern() =
        let arr = positions
        let mutable sum = 0.0f
        for i in 0 .. arr.Length - 1 do
            match arr.[i] with
            | Value p -> sum <- sum + p.Length()
            | _ -> ()
        sum

    [<Benchmark; BenchmarkCategory("Map")>]
    member _.Map_Module_Inline() =
        let arr = positions
        let mutable sum = 0.0f
        for i in 0 .. arr.Length - 1 do
            sum <- sum + (arr.[i] |> Nullable.map (fun p -> p.Length()) |> Nullable.defaultValue 0.0f)
        sum

    [<Benchmark; BenchmarkCategory("Map")>]
    member _.Map_Module_NoInline() =
        let arr = positions
        let mutable sum = 0.0f
        for i in 0 .. arr.Length - 1 do
            sum <- sum + (arr.[i] |> NullableNoInline.map (fun p -> p.Length()) |> Nullable.defaultValue 0.0f)
        sum

    [<Benchmark; BenchmarkCategory("Map")>]
    member _.Map_ValueOption_Match() =
        let arr = vpositions
        let mutable sum = 0.0f
        for i in 0 .. arr.Length - 1 do
            match arr.[i] with
            | ValueSome p -> sum <- sum + p.Length()
            | ValueNone -> ()
        sum

    [<Benchmark; BenchmarkCategory("Map")>]
    member _.Map_ValueOption_Module() =
        let arr = vpositions
        let mutable sum = 0.0f
        for i in 0 .. arr.Length - 1 do
            sum <- sum + (arr.[i] |> ValueOption.map (fun p -> p.Length()) |> ValueOption.defaultValue 0.0f)
        sum

    // ---------------- Bind ----------------

    [<Benchmark(Baseline = true); BenchmarkCategory("Bind")>]
    member _.Bind_HasValue() =
        let arr = positions
        let mutable sum = 0.0f
        for i in 0 .. arr.Length - 1 do
            let v = arr.[i]
            if v.HasValue then
                let a = adjustPosition v.Value
                if a.HasValue then sum <- sum + a.Value.X
        sum

    [<Benchmark; BenchmarkCategory("Bind")>]
    member _.Bind_Module_Inline() =
        let arr = positions
        let mutable sum = 0.0f
        for i in 0 .. arr.Length - 1 do
            match arr.[i] |> Nullable.bind adjustPosition with
            | Value a -> sum <- sum + a.X
            | _ -> ()
        sum

    [<Benchmark; BenchmarkCategory("Bind")>]
    member _.Bind_Module_NoInline() =
        let arr = positions
        let mutable sum = 0.0f
        for i in 0 .. arr.Length - 1 do
            match arr.[i] |> NullableNoInline.bind adjustPosition with
            | Value a -> sum <- sum + a.X
            | _ -> ()
        sum

    [<Benchmark; BenchmarkCategory("Bind")>]
    member _.Bind_ValueOption_Module() =
        let arr = vpositions
        let mutable sum = 0.0f
        for i in 0 .. arr.Length - 1 do
            match arr.[i] |> ValueOption.bind adjustPositionV with
            | ValueSome a -> sum <- sum + a.X
            | ValueNone -> ()
        sum

    // ---------------- Iter ----------------

    [<Benchmark(Baseline = true); BenchmarkCategory("Iter")>]
    member _.Iter_HasValue() =
        let arr = positions
        for i in 0 .. arr.Length - 1 do
            let v = arr.[i]
            if v.HasValue then Sink.Value <- Sink.Value + v.Value.X
        Sink.Value

    [<Benchmark; BenchmarkCategory("Iter")>]
    member _.Iter_Module_Inline() =
        let arr = positions
        for i in 0 .. arr.Length - 1 do
            arr.[i] |> Nullable.iter (fun p -> Sink.Value <- Sink.Value + p.X)
        Sink.Value

    [<Benchmark; BenchmarkCategory("Iter")>]
    member _.Iter_Module_NoInline() =
        let arr = positions
        for i in 0 .. arr.Length - 1 do
            arr.[i] |> NullableNoInline.iter (fun p -> Sink.Value <- Sink.Value + p.X)
        Sink.Value

    // Capturing a local: F# needs a ref cell (closures can't capture `let mutable`).
    [<Benchmark; BenchmarkCategory("Iter")>]
    member _.Iter_Module_Inline_Capturing() =
        let arr = positions
        let sum = ref 0.0f
        for i in 0 .. arr.Length - 1 do
            arr.[i] |> Nullable.iter (fun p -> sum.Value <- sum.Value + p.X)
        sum.Value

    [<Benchmark; BenchmarkCategory("Iter")>]
    member _.Iter_Module_NoInline_Capturing() =
        let arr = positions
        let sum = ref 0.0f
        for i in 0 .. arr.Length - 1 do
            arr.[i] |> NullableNoInline.iter (fun p -> sum.Value <- sum.Value + p.X)
        sum.Value
