---
title: "Writing scholarly documents with Djot: what Citum supports now"
date: 2026-06-22
summary: "Citum's native document format supports citations, bibliography grouping, name memory, rich text in reference fields, EDTF dates, and multilingual sources — all rendered to HTML, LaTeX, or Typst from one command."
---

# Writing scholarly documents with Djot: what Citum supports now

The [demo page](https://docs.citum.org/demo.html) has always been the most complete illustration of what Citum can do with a real document. But the features it demonstrates were never documented in a single place — they were scattered across an integration recipe, a spec file, and the demo source itself. This post collects everything in one place and points to the new [Djot document authoring guide](https://docs.citum.org/guides/djot-documents.html).

## The pipeline

A Djot document is a plain text file with citation keys inside brackets. The Citum CLI reads the document, resolves each key against your reference file, and produces formatted output:

```bash
citum render doc manuscript.djot -b references.yaml -s apa-7th -f html -o paper.html
```

The same command works for LaTeX and Typst — change `-f html` to `-f latex` or `-f typst`. The reference data and citation keys stay the same; only the output format changes.

## Citation syntax

Citum uses the same bracketed syntax as Pandoc, with one difference: integral (narrative) citations use a `+` prefix:

| Form | Syntax | Rendered (APA) |
|------|--------|----------------|
| Non-integral | `[@kuhn1962]` | (Kuhn 1962) |
| Integral | `[+@chen2017]` | Mei Chen (2017) |
| Author suppressed | `[-@watson1953]` | (1953) |
| With locator | `[@chen2017, ch. 3]` | (Chen 2017, ch. 3) |
| Multiple | `[@kuhn1962; @watson1953]` | (Kuhn 1962; Watson 1953) |

## Name memory

When the same author appears multiple times as an integral citation, you can suppress the given name on repeat occurrences — exactly as a copy-editor would:

```yaml
---
options:
  integral-name-memory:
    enabled: true
    scope: document
    contexts: body-and-notes
---
```

With this set, `[+@chen2017]` renders as "Chen (2017)" the second time it appears, dropping the given name automatically.

## Rich text in reference fields

Djot inline markup is understood natively in `title`, `note`, and `abstract` fields. This lets you encode an embedded book title or a protected proper noun directly in the reference data — once, for all output formats:

```yaml
# Title-within-title: the embedded book title gets italic markup
- id: hoyningen2015
  type: article
  title: "Kuhn's _The Structure of Scientific Revolutions_ Revisited"

# Case protection: prevents title-case styles from upcasing acronyms
- id: smith2020
  type: article
  title: "The role of {.nocase}[DNA] in evolutionary theory"
```

HTML output renders `<em>` for `_..._`; LaTeX renders `\emph{}`; Typst renders `#emph[]`. The same source data works for all three.

## Grouped bibliographies

A document can split its bibliography into named sections using fenced divs with filter attributes:

```djot
{ type="manuscript" title="Primary Sources" }
::: bibliography
:::

{ not-type="manuscript" title="Secondary Sources" }
::: bibliography
:::
```

The `title` attribute sets the section heading. Any reference field can be used as a filter; prefix with `not-` to invert. The [live demo](https://docs.citum.org/demo.html) shows this splitting archival manuscripts from secondary literature.

## EDTF dates, archival sources, and preprints

The reference YAML accepts EDTF Level 1 date modifiers: `"1891?"` for uncertain dates and `"2022~"` for approximate ones. Archival manuscripts use an `archive-info` block with repository metadata. Preprints use an `eprint` block with server and ID.

All three appear in the [demo](https://docs.citum.org/demo.html), rendered with Chicago author-date 18th so full given names are visible. Click the feature bubbles at the top of the page to highlight each example in the rendered text and bibliography.

## Try it

The [Djot document authoring guide](https://docs.citum.org/guides/djot-documents.html) documents all of the above in one place, with copy-ready examples. The demo source files (`docs/demo.djot` and `docs/demo-refs.yaml`) are in the repository and can be run locally:

```bash
# Install
cargo install citum

# Clone the repo for the example files
git clone https://github.com/citum/citum-core.git --depth 1
cd citum-core

# Render the demo
citum render doc docs/demo.djot -b docs/demo-refs.yaml -s styles/embedded/chicago-author-date-18th.yaml -f html
```
