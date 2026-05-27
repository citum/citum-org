---
title: Citum is on crates.io and jsr.io
date: 2026-05-19
summary: Install the Rust engine and server with cargo, or drop in the TypeScript WASM package from jsr.io — plus three integration recipes to get you from zero to citations.
---

# Citum, a modern citation engine, is on crates.io and jsr.io

The first public release of Citum is now on [crates.io](https://crates.io). If you have a Rust toolchain, one command gets you a working citation processor:

```
cargo install citum
```

No Rust toolchain? A pre-built binary installer works on Linux, macOS, and Windows:

```
curl -fsSL https://github.com/citum/citum-core/releases/latest/download/install.sh | sh
```

Installs to `$HOME/.local/bin` by default.

For editor and plugin authors who want a long-lived JSON-RPC server:

```
cargo install citum-server
```

For JavaScript and TypeScript projects, the same engine ships as a WASM package on [jsr.io](https://jsr.io/@citum/engine):

```sh
npx jsr add @citum/engine   # Node
```

Deno and Bun users: see the package page for the right install command.

The crates and the package ship the same engine the docs and the compatibility reports already describe — declarative YAML styles, native EDTF dates, paired bilingual scripts, style inheritance, and renderers for HTML, LaTeX, Typst, and PDF.

## Who this is for

There are five ways to use Citum today. The interface differs; the engine is the same.

**Scholars writing Djot or Markdown.** If you already work with Pandoc-style citations, this should feel familiar: write `[@key]` markers in your manuscript, point at a bibliography (CSL-JSON, BibLaTeX, RIS, or Citum YAML all work), pick a style, and `citum render doc` produces HTML, LaTeX, Typst, or PDF. Markdown works today as a compatibility mode (`citum render -I markdown doc`). Djot is Citum's native format and supports rich inline markup in reference fields; its citation syntax is a draft implementation — enabled by default, but subject to change as the upstream spec evolves (see below).

**Editor, IDE, and plugin authors.** Spawn `citum-server` once per session and speak newline-delimited JSON-RPC. One `format_document` call returns formatted citations and a rendered bibliography for the entire buffer — interactive latency, no per-keystroke process spawns. The [editor / plugin recipe](https://docs.citum.org/guides/integrations/editor-plugin.html) has a working Node client and a sample request/response pair.

**Docs and static-site maintainers.** Drop `citum` into your existing build step. The [static-site recipe](https://docs.citum.org/guides/integrations/static-site.html) shows a Makefile pattern rule — the same shape works for npm scripts, justfiles, and CI jobs.

**Publishers and style maintainers.** House styles extend a pinned parent (APA, Chicago, …) in YAML rather than forking the whole thing. Updates to your overrides don't break when upstream changes. The [style authoring guide](https://docs.citum.org/guides/style-authoring/start.html) is the way in.

**JavaScript and TypeScript developers.** Import `@citum/citum` directly — no Rust toolchain required. The WASM module exposes the same rendering engine: pass a bibliography and style, get back formatted citations and a bibliography string. Useful for browser apps, Deno scripts, and Node tools.

## Experimental: Djot citations

Djot doesn't have an official citation syntax yet — [issue #32](https://github.com/jgm/djot/issues/32) and [issue #343](https://github.com/jgm/djot/issues/343) are still open.
What Citum ships today is a draft implementation that is **enabled by default**: it follows the direction of the discussion (Pandoc-style bracket syntax, `[+@key]` for integral/author-in-text citations as jgm proposed) and adds a few ideas of my own where the spec is silent.

The supported forms in this release:

```text
[@key]          standard parenthetical
[+@key]         integral / author-in-text (jgm's proposed form)
[-@key]         suppress author
[@a; @b]        multi-cite
[@key, p. 10]   with locator
```

Because Djot’s citation syntax is still being designed upstream, this support should be considered experimental and subject to change; future Citum releases may adjust the exact forms to match whatever the Djot spec eventually settles on. If you're involved in the Djot discussion, I'd welcome feedback on anything here.
The goal is to be a useful early implementation; not to get ahead of the spec.
If you want to try it, the [Djot integration recipe](https://docs.citum.org/guides/integrations/djot.html) has a working example and shows how Djot inline markup in reference fields differs from the Markdown mode.

## Open invitations

- **Try a recipe.** Each of the integration pages has a fixture you can copy. Report what doesn't work.
- **File issues.** [`citum-core` on GitHub](https://github.com/citum/citum-core) is the right place. Migration cases, missing style edge cases, and integration friction are all welcome.
- **Build a browser tool or framework integration.** `@citum/citum` exposes a small functional API (`formatDocument`, `renderCitation`, `renderBibliography`, …); React/Svelte/Vue wrappers and browser-bundle tooling would be welcome.
- **Word, LibreOffice, Pages, Google Docs.** Citum doesn't ship plugins for these yet, but the JSON-RPC and WASM surfaces are well-suited to them. If you're interested in building one, [open a thread on Discussions](https://github.com/citum/citum-core/discussions/734).

The [compatibility report](https://docs.citum.org/compat.html) tracks where Citum stands against citeproc-js on the full CSL fixture set; biblatex-derived styles are first-class in the engine but don't have an equivalent upstream oracle. Pre-1.0 means gaps are visible and documented rather than hidden.
