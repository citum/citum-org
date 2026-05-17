---
title: Citum is on crates.io
date: 2026-05-17
summary: Install the engine, the server, and the migration tool with one cargo command — and three new integration recipes to get you from zero to citations.
---

# Citum is on crates.io

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

The crates ship the same engine the docs and the compatibility reports already describe — declarative YAML styles, native EDTF dates, paired bilingual scripts, style inheritance, and renderers for HTML, LaTeX, Typst, and PDF.

## Who this is for

There are four ways to use Citum today. The pipe-fitting differs; the engine is the same.

**Scholars writing Markdown or Djot.** If you already work with Pandoc-style citations, this should feel familiar: write `[@key]` markers in your manuscript, point at a bibliography (CSL-JSON, BibLaTeX, RIS, or Citum YAML all work), pick a style, and `citum render doc` produces HTML, LaTeX, Typst, or PDF. The [scholar recipe](https://docs.citum.org/guides/integrations/scholar-cli.html) walks the whole thing in five minutes.

**Editor, IDE, and plugin authors.** Spawn `citum-server` once per session and speak newline-delimited JSON-RPC. One `format_document` call returns formatted citations and a rendered bibliography for the entire buffer — interactive latency, no per-keystroke process spawns. The [editor / plugin recipe](https://docs.citum.org/guides/integrations/editor-plugin.html) has a working Node client and a sample request/response pair.

**Docs and static-site maintainers.** Drop `citum` into your existing build step. The [static-site recipe](https://docs.citum.org/guides/integrations/static-site.html) shows a Makefile pattern rule — the same shape works for npm scripts, justfiles, and CI jobs.

**Publishers and style maintainers.** House styles extend a pinned parent (APA, Chicago, …) in YAML rather than forking the whole thing. Updates to your overrides don't break when upstream changes. The [style authoring guide](https://docs.citum.org/guides/style-authoring/start.html) is the way in.

## What's confirmed working in this release

- The `citum` CLI: `render doc` (Markdown, Djot), `render refs`, `convert`, `style`, `check`, `schema`, `doctor`.
- The `citum-server` JSON-RPC surface: `format_document`, `render_citation`, `render_bibliography`, `validate_style`. stdin/stdout by default; HTTP behind the `http` feature.
- Bundled, validated styles: APA, Chicago, MLA, and dozens more, tested against published examples.
- Markdown citation syntax: `[@key]`, bare `@key` for narrative/integral, `[-@key]` for author-suppression, `[@a; @b]` for multi-cite, locators like `[p. 10]`.
- Djot citation syntax with explicit integral form `[+@key]` plus the rest of the above.
- Output formats: plain text, HTML, Djot, LaTeX, Typst, and PDF (via Typst).
- Bibliography conversion from BibLaTeX, CSL-JSON, and RIS.

The [compatibility report](https://docs.citum.org/compat.html) tracks where Citum stands against citeproc-js across the full CSL fixture set — pre-1.0 means gaps are visible and documented rather than hidden.

## Open invitations

- **Try a recipe.** Each of the integration pages has a fixture you can copy. Report what doesn't work.
- **File issues.** [`citum-core` on GitHub](https://github.com/citum/citum-core) is the right place. Migration cases, missing style edge cases, and integration friction are all welcome.
- **Word, LibreOffice, Pages, Google Docs.** Citum doesn't ship plugins for these yet, but the JSON-RPC and WASM surfaces are well-suited to them. If you're interested in building one, [open a thread on Discussions](https://github.com/citum/citum-core/discussions/734).

## What's next

Hub (browser-based style testing) and Labs (experimental features and bindings) are both in active development and will get their own announcements. More integration recipes are welcome too — if you build something useful on top of `citum-server` or the WASM bridge, a write-up here helps the next person.
