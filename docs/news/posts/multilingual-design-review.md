---
title: "Multilingual Citum: is the design sound? Help us find the gaps"
date: 2026-05-28
summary: A call for multilingual scholars to test Citum's parallel-metadata design and help identify what needs to change before the schema reaches 1.0.
---

# Multilingual Citum: is the design sound? Help us find the gaps

I need help from multilingual scholars — and I want to be honest about why. I'm a monolingual, English-language scholar. I've spent years building the core data model, the rendering pipeline, and the migration path from CSL, but multilingual citation practice is my biggest blind spot. Before I declare the schema 1.0, I need people who actually work in Japanese, Arabic, Korean, Russian, Chinese, Vietnamese, and other languages to tell me whether what we've built makes sense for their practice — and where it doesn't.

This post describes the design, links to the relevant specs, and gives you concrete, runnable scenarios to test. What I'm asking for is either "yes, this looks right" or "here's specifically where you went wrong."

## What we built

Citum stores parallel metadata side-by-side in the reference record: an original field, transliterations keyed by BCP 47 tag, and translations keyed by language. A style then requests a *view* — transliterated, original, combined, or translated — rather than implementing rendering logic. The complexity of multilingual support is opt-in; simple monolingual records stay simple.

**A multilingual title in a Citum reference file:**

```yaml
title:
  original: "源氏物語"
  lang: "ja"
  transliterations:
    ja-Latn-hepburn: "Genji Monogatari"
  translations:
    en: "The Tale of Genji"
```

**A multilingual contributor:**

```yaml
author:
  - original:
      family: "紫式部"
      given: ""
    lang: "ja"
    transliterations:
      ja-Latn-hepburn:
        family: "Murasaki"
        given: "Shikibu"
```

**A style requesting a transliterated view:**

```yaml
options:
  multilingual:
    title-mode: combined       # original [translation]
    name-mode: transliterated  # use the romanized form
    preferred-script: Latn
```

Beyond title and name views, the design includes:

- **Script-aware name ordering and separators** — styles can specify that CJK names render family-first with no inter-part space, or that Katakana names use `・` between given and family parts, and `、` when inverted.
- **Field-scoped language** — for records where the chapter title is in one language but the containing volume is in another, you can tag individual fields rather than the whole entry.
- **Bibliography partitioning** — sort or visually separate entries by script or language, using `sort-only`, `sections`, or both.

## Prior art

The design draws on two established systems. **CSL-M** (the Juris-M multilingual extension to CSL) pioneered locale-targeted citation layouts and entry-level language variables. **biblatex** demonstrated flat, scoped options and field-level language metadata. Both informed the Citum design — but neither was copied directly. Where CSL-M encodes multilingual logic in procedural XML and biblatex embeds it in LaTeX macros, Citum's approach is declarative and schema-driven: you describe what you want, and the engine resolves it from data. The detailed comparison is in [`docs/architecture/PRIOR_ART.md`](https://github.com/citum/citum-core/blob/main/docs/architecture/PRIOR_ART.md).

## Try it yourself

The scenarios below all run against the same example bibliography that ships with citum-core. You can install the `citum` binary like so:

```bash
curl -fsSL https://github.com/citum/citum-core/releases/latest/download/install.sh | sh
```

Or, if you have a Rust toolchain installed:

```bash
cargo install citum
```

You then need to clone the citum-core repo, like so:

```bash
git clone https://github.com/citum/citum-core.git --depth 1 # last argument is if you don't want the full history
cd citum-core
````

Then try each scenario below.

---

### Scenario 1: Transliterated view (ISO 690)

```bash
citum render refs \
  -b examples/multilingual-refs.yaml \
  -s styles/iso690-numeric.yaml
```

This style uses `name-mode: transliterated` and `title-mode: combined`. The bibliography for the Japanese and Chinese records renders romanized names and titles, with bracketed translations:

```
[1] Murasaki, S. Genji Monogatari [The Tale of Genji].: 古典文学之友. 1010.
[7] Kǒng, Z. Lùnyǔ [Analects of Confucius].: 人民文学出版社.
[8] Kim, J. Hanguk Munhak-ui Yeoksa [A History of Korean Literature].: 서울대학교 출판부. 2018.
```

**Confirm or correct:** Is `name [translation]` the right combined view for your discipline's conventions? Is the choice of romanization key — Hepburn for Japanese, Pinyin for Chinese, RR for Korean — what you'd expect?

The Arabic entry has no transliteration in the data (only a translation), so it falls back to original script. But initialization is applied to the Arabic given name, producing `أحمبم` — clearly wrong. **Open question: should initialization ever be applied to non-Latin script names, or should it be suppressed entirely when no transliteration is available?**

---

### Scenario 2: Per-group name-order conventions

```bash
citum render refs \
  -b examples/multilingual-refs.yaml \
  -s styles/experimental/multilingual-academic.yaml
```

This style groups the bibliography by language. Vietnamese sources are sorted given-family (following Vietnamese convention); Western sources are sorted family-given. The rendered bibliography:

```
# Vietnamese Sources

Văn An Nguyễn (2019). Học thuật số và thực hành trích dẫn
Thị Bình Trần (2021). Quy trình trích dẫn cho xuất bản hiện đại

# Western Sources

Elizabeth Anderson (2020). Contemporary Approaches to Citation
Zeynep Çelik (1996). Streets: critical perspectives on public space
...
```

**Confirm or correct:** Does per-group name-order handle Vietnamese correctly? Note that Korean (`준 김`) and CJK entries fall into the "Western" group because no language-specific group is defined for them — their names are rendered given-family there, which is likely wrong for Korean (where family-first is conventional). Is that a gap in the example, in the schema, or both?

---

### Scenario 3: Script-based partitioning with combined title view

```bash
citum render refs \
  -b examples/multilingual-refs.yaml \
  -s styles/experimental/multilingual-partitioned.yaml
```

This style extends MLA and partitions the bibliography by script (`Latn`, `Arab`, `Hani`, `Hang`), with `title-mode: combined`:

```
# Western Sources

Anderson, Elizabeth. Contemporary Approaches to Citation. Oxford University Press, 2020.
Çelik, Zeynep. Streets: critical perspectives on public space. University of California Press, 1996.
Nguyễn, Văn An. Học thuật số và thực hành trích dẫn. Nhà xuất bản Khoa học Xã hội, 2019.
...

# Arabic Sources

الغزالي, أبو حامد محمد بن محمد. "منطق الفلاسفة والمنطق الأرسطي [The Logic of Philosophers and Aristotelian Logic]." دراسات إسلامية, 1095.

# Chinese & Japanese Sources

孔, 子. 论语 [Analects of Confucius]. 人民文学出版社.
紫式部. 源氏物語 [The Tale of Genji]. 古典文学之友, 1010.

# Korean Sources

김, 준. 한국 문학의 역사 [A History of Korean Literature]. 서울대학교 출판부, 2018.
```

**Confirm or correct:** Is partitioning by Unicode script the right primitive for your bibliography, or do you need partitioning by language code? Is collapsing Chinese and Japanese into a single `Hani` section acceptable, or should they always be separated? Does the heading model (`Latn`, `Arab`, `Hani`, `Hang`) cover your use cases, or are there common scripts missing?

---

### Scenario 4: Native CJK ordering

```bash
citum render refs \
  -b examples/multilingual-refs.yaml \
  -s styles/experimental/jm-turabian-multilingual.yaml
```

This style uses `use-native-ordering: true` and `delimiter: ""` for CJK, rendering family-first with no inter-part space. In the bibliography (which uses `name-form: initials`):

```
子.孔. 论语 [Analects of Confucius]. 人民文学出版社.
준.김. 한국 문학의 역사 [A History of Korean Literature]. 서울대학교 출판부, 2018.
紫式部. 源氏物語 [The Tale of Genji]. 古典文学之友, 1010.
```

**Confirm or correct:** Is `子.孔` the right initialized form, or should CJK names never be initialized at all (since single-character given names can't be meaningfully abbreviated)? Does `use-native-ordering: true` interact correctly with name inversion in your style context?

---

## Specs

The full design documentation is in citum-core:

- [`docs/specs/MULTILINGUAL.md`](https://github.com/citum/citum-core/blob/main/docs/specs/MULTILINGUAL.md) — overview: data model, style configuration, processor logic, transliteration matching strategy, disambiguation
- [`docs/specs/MULTILINGUAL_NAMES.md`](https://github.com/citum/citum-core/blob/main/docs/specs/MULTILINGUAL_NAMES.md) — script-aware name ordering and separators; precedence rules
- [`docs/specs/MULTILINGUAL_BIBLIOGRAPHY_PARTITIONING.md`](https://github.com/citum/citum-core/blob/main/docs/specs/MULTILINGUAL_BIBLIOGRAPHY_PARTITIONING.md) — sort-only, sections, and sort-and-sections modes
- [`docs/architecture/PRIOR_ART.md`](https://github.com/citum/citum-core/blob/main/docs/architecture/PRIOR_ART.md) — comparison with CSL-M, biblatex, citeproc-rs, and BibTeX

---

## How to give feedback

**Design questions — "did we get this right?"** → post to [citum-core Discussions](https://github.com/citum/citum-core/discussions). There's already a [Notes on names](https://github.com/citum/citum-core/discussions) thread there, and I'll be watching for new ones. This is the right place for "here's how my discipline handles this" or "the model is missing this concept."

**Concrete rendering bugs** → open an [Issue](https://github.com/citum/citum-core/issues) with the `multilingual` label.

To make your feedback actionable — both for me to evaluate and for the project to implement — please include:

1. **The exact command** you ran (or the style and reference YAML you used).
2. **A minimal reference snippet** — the YAML record that triggered the problem.
3. **Actual output** — what citum produced.
4. **Expected output** — what it should have produced, with a pointer to the authority: a style manual, national standard, disciplinary convention, or concrete published example.
5. **Language, script, and romanization scheme** involved.
6. **Why it matters in practice** — a sentence on who encounters this and how often.

I'm most interested in whether the fundamental model — parallel metadata fields, style-requested views, script-aware rendering — is the right abstraction, or whether there are citation practices that it cannot express at all. That's the thing to tell me before 1.0.
