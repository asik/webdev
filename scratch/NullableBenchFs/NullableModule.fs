namespace NullableBenchFs

open System

/// The F# take on the same API. `inline` + `[<InlineIfLambda>]`: the F# compiler itself substitutes
/// the lambda body at the call site, so no FSharpFunc/delegate reaches the JIT at all.
[<RequireQualifiedAccess>]
module Nullable =
    let inline map ([<InlineIfLambda>] f: 'T -> 'U) (v: Nullable<'T>) : Nullable<'U> =
        if v.HasValue then Nullable(f v.Value) else Nullable()

    let inline bind ([<InlineIfLambda>] f: 'T -> Nullable<'U>) (v: Nullable<'T>) : Nullable<'U> =
        if v.HasValue then f v.Value else Nullable()

    let inline iter ([<InlineIfLambda>] f: 'T -> unit) (v: Nullable<'T>) : unit =
        if v.HasValue then f v.Value

    let inline defaultValue (d: 'T) (v: Nullable<'T>) : 'T = v.GetValueOrDefault(d)

/// Same functions WITHOUT `inline`: compiled as ordinary generic methods taking an FSharpFunc
/// (an abstract class with a virtual Invoke) — the F# equivalent of the C# Func-based version.
[<RequireQualifiedAccess>]
module NullableNoInline =
    let map (f: 'T -> 'U) (v: Nullable<'T>) : Nullable<'U> =
        if v.HasValue then Nullable(f v.Value) else Nullable()

    let bind (f: 'T -> Nullable<'U>) (v: Nullable<'T>) : Nullable<'U> =
        if v.HasValue then f v.Value else Nullable()

    let iter (f: 'T -> unit) (v: Nullable<'T>) : unit =
        if v.HasValue then f v.Value

/// Struct (allocation-free) active pattern so Nullable can be pattern matched: `| Value p -> ...`.
[<AutoOpen>]
module NullablePatterns =
    [<return: Struct>]
    let inline (|Value|_|) (v: Nullable<'T>) = if v.HasValue then ValueSome v.Value else ValueNone
