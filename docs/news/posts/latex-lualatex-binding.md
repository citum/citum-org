---
title: "Citum for LuaLaTeX: a pipe-based citation package"
date: 2026-06-08
slug: citum-for-lualatex-an-experimental-binding
summary: A LuaLaTeX package that formats citations through citum-server over JSON-RPC, with split bibliographies and no runtime shared-library loading.
---

# Citum for LuaLaTeX: a pipe-based citation package

The `citum` LaTeX package brings the Citum citation engine into LuaLaTeX without
BibTeX, Biber, or runtime shared-library loading. LuaLaTeX records the document's
citations, sends one `format_document` request to `citum-server` over
stdin/stdout JSON-RPC, and reads rendered citations and bibliography blocks back
from a cache on the next LaTeX pass.

The package now lives in the standalone
[citum-latex](https://github.com/citum/citum-latex) repository.

## What it looks like

```latex
\usepackage[
    style   = apa-7th,
    bibfile = refs.bib,
]{citum}
```

Then cite in the document:

```latex
As \textcite{harrington1891} observed, bibliographic method has long been
contested \cite[p.~42]{chen2017}.
```

The same engine renders citations and bibliographies for the CLI, server, WASM
surface, Emacs org-cite processor, and LuaLaTeX package. The LaTeX package is a
client, not a second implementation.

## Why the architecture matters

TeX distribution policy is hostile to packages that load arbitrary external
shared libraries at runtime. The current package avoids that problem by keeping
`citum-server` entirely outside the LuaLaTeX process. The `scripts/citum-lualatex`
compile driver orchestrates the passes: LuaLaTeX writes a JSON-RPC request file,
the driver runs `citum-server` on it between passes, and the next LuaLaTeX pass
reads the cached result. No `--shell-escape` is required. An opt-in `pipe` backend
lets LuaLaTeX spawn the server directly when shell-escape is available.

The document flow is deliberately close to BibTeX/Biber:

```text
scripts/citum-lualatex  ->  LuaLaTeX pass 1  (writes JOB.citum_request.json)
scripts/citum-lualatex  ->  citum-server      (formats document, writes cache)
scripts/citum-lualatex  ->  LuaLaTeX pass 2  (reads cache, prints output)
```

That whole-document request is the important part. Citation processors need
document context for disambiguation, name memory, note behavior, and bibliography
selection. Formatting one citation at a time is the wrong abstraction.

## Split bibliographies

The package can request bibliography blocks from the server:

```latex
\subsection*{Primary Sources}
\printcitumbibliography[type=manuscript]

\subsection*{Secondary Sources}
\printcitumbibliography[not-type=manuscript]
```

This is not Lua-side filtering. The package sends `bibliography_blocks` to
`citum-server`, each block carries a real Citum `BibliographyGroup` selector, and
the server applies first-match assignment so entries emitted in the primary block
do not repeat in the secondary block.

For historians, legal scholars, editors, and humanities writers, this matters:
primary/secondary splits and source-class bibliographies are not decorative
features. They are part of the scholarly apparatus.

## Bibliography input

LuaLaTeX users can point `bibfile` at either Citum YAML references or ordinary
BibLaTeX `.bib` files:

```latex
\usepackage[style=apa-7th, bibfile=refs.bib]{citum}
\usepackage[style=apa-7th, bibfile=refs.yaml]{citum}
```

The BibLaTeX parsing happens server-side through Citum's `RefsInput::Biblatex`
path, so there is no client-side conversion step in the LaTeX package.

## What this demonstrates

The demo document exercises more than a parenthetical citation:

- integral and non-integral citations
- locators
- grouped citations with item prefixes
- EDTF uncertain and approximate dates
- archival manuscript metadata
- multilingual titles
- primary/secondary split bibliographies

Those features are meant to show the broader point: Citum is not just a CSL
renderer with a different file extension. It is a citation engine with a richer
data model, declarative YAML styles, structured archival fields, EDTF dates, and
a server protocol that lets real host environments integrate without duplicating
processor logic.

## Current status

This is a pre-CTAN package candidate. It compiles under LuaLaTeX with no
`--shell-escape` required (the default external backend), requires `citum-server`,
and is designed around the distribution constraint that TeX packages should not
load runtime shared libraries.

The next useful feedback is practical: LaTeX users who maintain complex
bibliographies, split source lists, or citation-heavy scholarly documents should
try the package and report where the command surface, build workflow, or rendered
output still fails their real documents.

Source is at [citum/citum-latex](https://github.com/citum/citum-latex). The
engine and server live in [citum/citum-core](https://github.com/citum/citum-core).
