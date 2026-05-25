---
title: "Citum for LuaLaTeX: an experimental binding"
date: 2026-05-25
summary: An experimental LuaLaTeX package that calls the Citum engine directly from inside a LaTeX document — with two transport modes, the second of which avoids loading external binaries.
---

# Citum for LuaLaTeX: an experimental binding

The `citum` LaTeX package is a LuaLaTeX binding that calls the Citum engine directly during the LaTeX pass — no Biber, no BibTeX, no external build step. It lives in [citum-labs](https://github.com/citum/citum-labs/tree/main/bindings/latex).

## What it does

You load it like any other package:

```latex
\usepackage[
    style   = apa-7th,
    bibfile = my-references,
]{citum}
```

Then cite in the document:

```latex
As \textcite{harrington1891} observed, bibliographic method has long been
contested \cite[p.~42]{chen2017}. More recently, \textcite{okafor2024}
provided computational evidence at scale.
```

The engine renders citations and bibliography during the LuaLaTeX pass itself, using the same style files and rendering logic as the CLI and the server.

## Why this project exists

Projects in `citum-labs` are experiments. Their purpose is to test and refine the citum-core code — in this case the C FFI surface, the citation API, and the `citum-server` JSON-RPC protocol — in a realistic integration context. They are not production tools, and may change without notice.

That said: [Zeping Lee](https://github.com/zepinglee), who maintains a Lua-based citation processor for LaTeX and is well-known in the CSL community, posted to the TeX Live mailing list in March 2026 asking whether this kind of binding could be added to TeX Live:

> [tex-live] [Proposal] Adding a new Lua citation processor to TeX Live — March 2026

[Karl Berry's reply](https://tug.org/pipermail/tex-live/2026-March/052256.html) made clear that TeX Live policy prohibits loading external shared libraries at run time, for security and sandboxing reasons. That makes the FFI transport — which loads `libcitum_engine` via LuaJIT — a dead end for broad distribution.

## Two transport modes

The package tries FFI first, then falls back to pipe/RPC:

**FFI** — loads `libcitum_engine` directly via LuaJIT. Fast for local development. Requires building the shared library from `citum-core`:

```
cargo build -p citum-engine --release --features ffi
```

**Pipe/RPC** — spawns `citum-server` as a subprocess and speaks JSON-RPC 2.0 over stdin/stdout. No shared library loading. This is the path compatible with TeX Live policy:

```
cargo install citum-server
```

If `citum-server` is on your PATH (or set via the `server` package option), the pipe transport is selected automatically.

## What Citum styles are, briefly

Citum is not a CSL processor — it is a successor project with its own style format. Where CSL is XML-based and procedural, Citum styles are YAML-based and declarative, with a richer data model (native EDTF dates, structured archive info, multilingual fields, and more). Existing CSL styles can be translated; Citum-native styles are authored directly in the YAML format documented at [docs.citum.org](https://docs.citum.org/guides/style-authoring/start.html).

## A taste of the feature set

The demo document (`bindings/latex/demo/citum-example.tex`) uses an artificial set of references designed to exercise the engine across several feature dimensions:

```latex
% Integral citation with locator
\textcite[ch.~3]{chen2020} extends this analysis to the digital transition.

% Non-integral with EDTF approximate date (2022~ → "ca. 2022")
Citation practices differ across contexts \cite{garcia2022}.

% Archival reference — EDTF uncertain date (1891? → "1891?") + archive-info
\textcite{harrington1891} noted these tensions in an 1891 manuscript
held at the British Library \cite[ff.~12--15]{harrington1891}.

% Preprint with arXiv eprint identifier
\textcite{okafor2024} provide computational evidence at scale.
```

Features demonstrated: integral and non-integral citations, locators, name memory across two works by the same author, EDTF uncertain and approximate dates, archival references with structured `archive-info`, and preprints with `eprint` identifiers. The companion reference data and a richer interactive HTML version are at [docs.citum.org/demo.html](https://docs.citum.org/demo.html).

## Current status

- Compiles with LuaLaTeX on macOS and Linux in both transport modes.
- Not suitable for TeX Live distribution in its current form (FFI mode) or in general as a production-ready package.
- The pipe/RPC mode is the right direction for any future distribution story.
- Feedback welcome, especially from people who work at the intersection of LaTeX and bibliography tooling.

Source is at [citum/citum-labs](https://github.com/citum/citum-labs/tree/main/bindings/latex). Issues and discussion go to [citum-core on GitHub](https://github.com/citum/citum-core).
