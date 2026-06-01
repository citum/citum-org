---
title: "Citing with Citum in Emacs org-mode"
date: 2026-06-01
summary: A new org-cite export processor connects Emacs org-mode citations directly to the Citum engine over a JSON-RPC pipe — no FFI, no LaTeX intermediary, and compatible with the citar reference manager out of the box.
---

# Citing with Citum in Emacs org-mode

A new binding in [citum-labs](https://github.com/citum/citum-labs/tree/main/bindings/emacs) brings the Citum citation engine to Emacs [org-mode](https://orgmode.org) through the [`org-cite`](https://orgmode.org/manual/Citations.html) framework. Like the [LuaLaTeX binding](citum-for-lualatex-an-experimental-binding.html) before it, it speaks to `citum-server` over a newline-delimited JSON-RPC pipe. Unlike the LaTeX binding, there is no FFI option at all — and no need for one.

## What org-cite is

Emacs's built-in org-cite framework (shipped since Org 9.5) separates citation *management* from citation *export*. Separate processors handle each role:

- **Activate / follow / insert** — what happens when you type or click a citation in the editor. [citar](https://github.com/emacs-citar/citar) is the most widely used processor for this role.
- **Export** — what happens when you export an Org document to HTML, LaTeX, Markdown, or plain text. This is where `oc-citum` fits in.

The two roles are independent. You can keep using citar for insertion and completion and add `oc-citum` solely for the export step, sharing the same `.bib` file.

## The design

```
Org document  →  oc-citum  →  citum-server (stdin/stdout)
                                    ↓
                            Citum engine
                            (style + biblatex refs)
                                    ↓
                            rendered citations
                            + bibliography
```

`oc-citum` collects all citations in the document, builds a single `format_document` JSON-RPC request, and writes it to `citum-server`'s stdin. One line of JSON comes back. Results are cached in the Org export channel so subsequent callbacks are pure table lookups — there is no repeated process spawning.

The bibliography is read from standard `.bib` (biblatex) files, the same files citar uses. A companion change to `citum-server` (in [citum-core #860](https://github.com/citum/citum-core/pull/860)) adds native biblatex parsing on the server side, so no client-side conversion is needed.

## Setting it up

```elisp
(add-to-list 'load-path "/path/to/citum-labs/bindings/emacs")
(require 'oc-citum)

(setq org-cite-export-processors '((t . (citum))))
(setq org-cite-global-bibliography '("/path/to/refs.bib"))
```

With citar for insertion:

```elisp
(setq citar-bibliography org-cite-global-bibliography)
(setq org-cite-insert-processor 'citar
      org-cite-follow-processor 'citar
      org-cite-activate-processor 'citar)
```

In a document, set the export processor and bibliography:

```org
#+cite_export: citum
#+bibliography: refs.bib
```

Then export as usual: `C-c C-e h h` for HTML, `C-c C-e l p` for LaTeX PDF, and so on.

## Citation styles

`oc-citum` declares the full standard org-cite style set and maps each to the Citum engine's citation model:

| Style | In-document syntax | Output |
|-------|--------------------|--------|
| Default (parenthetical) | `[cite:@key]` | `(Author, 2024)` |
| Integral (narrative) | `[cite/t:@key]` | `Author (2024)` |
| Author-suppressed | `[cite/na:@key]` | `(2024)` |
| Capitalized | `[cite//c:@key]` | `(Author, 2024)` |
| Page locator | `[cite:@key p. 42]` | `(Author, 2024, p. 42)` |
| Multiple | `[cite:@a; @b]` | `(A, 2024; B, 2019)` |

The style shorthand works too: `[cite/t:...]` is equivalent to `[cite/text:...]`, and `[cite/na:...]` to `[cite/noauthor:...]`.

## Why this fits the citum-labs pattern

The LaTeX binding's raison d'être — as described in the [earlier post](citum-for-lualatex-an-experimental-binding.html) — was to stress-test the `citum-server` JSON-RPC protocol under a realistic integration. The Emacs binding does the same thing from a completely different runtime environment: pure interpreted Elisp, a different process model, and a different bibliography format (biblatex `.bib` instead of Citum's own YAML).

The biblatex support is the substantive engine contribution here. Adding `RefsInput::Biblatex` to the server means any client — not just the Emacs binding — can now send inline `.bib` content directly, without an intermediate conversion step.

## Current status and limitations

- Works with Emacs 29.1+ and Org 9.6+.
- Requires `citum-server` built from the `feat/biblatex-refs-input` branch of citum-core, or any release ≥ 0.62 once that PR merges.
- `nocite`/`n` style currently renders an inline parenthetical citation in addition to adding the entry to the bibliography — full inline suppression requires a server-side flag not yet implemented.
- Non-en-US locales are forwarded to the server but Citum currently falls back to en-US for most locale tags.
- This is an experiment in the `citum-labs` tradition: not a production package, but a working integration that can evolve.

Source is at [citum/citum-labs](https://github.com/citum/citum-labs/tree/main/bindings/emacs).

## Feedback?

Questions and discussion are welcome on the [citum-labs repository](https://github.com/citum/citum-labs) or [citum-core](https://github.com/citum/citum-core).
