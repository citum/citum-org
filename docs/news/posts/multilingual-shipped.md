---
title: "Multilingual Citum: what you told us, and what shipped"
date: 2026-07-26
summary: Two months ago we asked multilingual scholars to find the gaps in Citum's design. They did. This post demos what came out of it — GB/T 7714—2025 support, a punctuation layer that resolves glyphs by script, per-item term languages, and opaque calendar annotations on dates.
---

In May I published [a post asking for help](multilingual-citum-is-the-design-sound-help-us-find-the-gaps.html). It was five open questions and an admission: I'm a monolingual English-language scholar, multilingual citation practice is my biggest blind spot, and I wanted to know whether Citum's design was right before the schema reached 1.0.

That worked better than I expected. This post is the follow-up. Same structure — but instead of asking questions, it demos what shipped.

The chain went: feedback on the design-review post → [a whole-system multilingual architecture audit](https://github.com/citum/citum-core/blob/main/docs/architecture/audits/2026-07-18_MULTILINGUAL_ARCHITECTURE_AUDIT.md) → an epic of follow-up work → **`citum` v0.78.0**. Everything demonstrated below runs on that release. You can install it with:

```bash
curl -fsSL https://github.com/citum/citum-core/releases/latest/download/install.sh | sh
```

Every YAML block below is self-contained. Save it, run the command under it, and you should get the output shown — these are captured from actual runs, not written by hand.

## GB/T 7714—2025

The single largest thing to come out of that thread was Chinese support.

[YDX-2147483647](https://github.com/YDX-2147483647) wrote [a long, precise reply](https://github.com/citum/citum-core/discussions/828#discussioncomment-17636439) explaining how Chinese bibliographies actually work: that most mainland Chinese universities follow **GB/T 7714**, that the current version took effect on 2026-07-01, that it defines three citation styles (numeric at roughly 90% of use, author-date at 7%, note at 3%), and — bluntly and correctly — that none of them existed in Citum.

They also corrected my examples. My Chinese sample had rendered 孔子 as "Kǒng, Z.", splitting a name that cannot be split (孔 is the family name, 子 an honorific — not a given name), and had used the wrong tone in the pinyin for 论语. They pointed out that the 2025 standard requires each entry to use the language of the original work, so the bracketed-translation view I'd been showing off is uncommon in current practice. And they explained why collapsing Chinese and Japanese into one "Han script" bucket is wrong: 环境司法制度改革对企业绿色创新的影响 is entirely Han characters, but in ノルウェイの森 only 森 is — the rest is katakana and hiragana.

All three of Citum's GB/T styles are now embedded: `gb-t-7714-2025-numeric`, `gb-t-7714-2025-author-date`, and `gb-t-7714-2025-note`.

### Where the benchmark stands

YDX also maintains [**gb7714-bench**](https://github.com/YDX-2147483647/gb7714-bench), which cross-compares GB/T 7714 output from ten reference engines — Zotero/citeproc-js, the BibTeX and BibLaTeX packages, several Typst packages, Pandoc — on a shared corpus, and [publishes the results](https://gb7714.zhtyp.art/converge/). They added Citum to it, and [reported back](https://github.com/YDX-2147483647/gb7714-bench/pull/25#issuecomment-5076956695):

> Citum + builtin json is cool! The difference between Citum and citeproc-lua (the only processor for builtin json that is better than Citum) is mainly `<span class="nocase">`.

As of 2026-07-26, Citum reading Zotero's built-in CSL-JSON export matches 146 of 344 entries exactly, against 152 for the strongest run on the board. The board is live and the numbers move, so [check it](https://gb7714.zhtyp.art/converge/) rather than trusting that figure.

The `nocase` difference YDX identified turned out to be a real Citum bug — CSL-JSON carries citeproc-js's `<span class="nocase">` convention on `container-title` as well as `title`, and Citum was only interpreting it on the latter, so it leaked into output verbatim. That's fixed on `main`, with [a regression test](https://github.com/citum/citum-core/blob/main/crates/citum-engine/tests/gb7714_bench_regression.rs) pinned to the exact benchmark entry that surfaced it.

One row on that board is honestly bad: Citum reading **BibTeX** input scores 1 of 344, because `citum convert refs` was dropping author data on the way from `.bib` to Citum YAML. YDX found that too. It's fixed on `main` but not in 0.78.0 — until the next release, export CSL-JSON from Zotero directly rather than going through BibTeX.

### Demo: three languages, one style

Save this as `gbt-demo.yaml`. The content is taken verbatim from the standard's own worked examples, by way of the [corpus](https://github.com/citum/citum-core/blob/main/tests/fixtures/test-items-library/gb-t-7714-2025.json) that the [zotero-chinese](https://github.com/zotero-chinese/styles) community maintains — so the Chinese and Japanese here is the standard's, not mine.

```yaml
references:
  # Chinese book, with a translator — GB/T 7714—2025 §5.1
  - id: gbt7714.5.1:1
    class: monograph
    type: book
    title: "银行业的未来与人工智能"
    author:
      - name: "博伯尔"
    translator:
      - name: "徐超"
    publisher:
      name: "清华大学出版社"
      place: "北京"
    issued: "2023"
    pages: "35"
    language: "zh-CN"

  # Japanese book, with a corporate editor
  - id: gbt7714.5.1:2
    class: monograph
    type: book
    title: "最新図書館用語大辭典"
    editor:
      - name: "図書館用語辞典編集委員会"
    publisher:
      name: "柏書房株式會社"
      place: "東京"
    issued: "2004"
    pages: "154"
    language: "ja-JP"

  # English book
  - id: gbt7714.5.1:3
    class: monograph
    type: book
    title: "AI and the future of banking"
    author:
      - given: "Tony"
        family: "Boobier"
    publisher:
      name: "John Wiley & Sons"
      place: "Chichester"
    issued: "2020-04-27"
    pages: "35"
    language: "en-US"
```

Note the shape of a personal name here. A name that shouldn't be decomposed — a Chinese personal name, a corporate body — is written as `name:`, a single opaque string. Only names you actually want split carry `given:` and `family:`. That's the schema-level answer to YDX's 孔子 correction: the data model lets you decline to split, rather than forcing a decomposition and hoping the renderer puts it back together.

```bash
citum render refs -b gbt-demo.yaml -s gb-t-7714-2025-numeric
```

<div class="ba">
<div class="ba-row">
<p class="ba-label">gb-t-7714-2025-numeric</p>
<pre class="ba-out">[1]博伯尔. 银行业的未来与人工智能[M]. 徐超，译. 北京：清华大学出版社，2023：35.
[2]図書館用語辞典編集委員会. 最新図書館用語大辭典[M]. 東京：柏書房株式會社，2004：154.
[3]Boobier T. AI and the future of banking[M]. Chichester：John Wiley &amp; Sons，2020：35.</pre>
</div>
<div class="ba-row">
<p class="ba-label">gb-t-7714-2025-author-date <span class="ba-note">— same data, <code>-s gb-t-7714-2025-author-date</code></span></p>
<pre class="ba-out">博伯尔，2023. 银行业的未来与人工智能[M]. 徐超，译. 北京：清华大学出版社：35.
図書館用語辞典編集委員会，2004. 最新図書館用語大辭典[M]. 東京：柏書房株式會社：154.
Boobier T，2020. AI and the future of banking[M]. Chichester：John Wiley &amp; Sons：35.</pre>
</div>
</div>

For the full 203-entry standard corpus rather than these three entries, clone [citum-core](https://github.com/citum/citum-core) and point `-b` at `tests/fixtures/test-items-library/gb-t-7714-2025.json`.

## Punctuation that follows the script, not the style file

This is the architectural change I'm happiest about, and it came directly out of the audit.

Citum used to get full-width CJK punctuation the backwards way. A style author typed the literal glyphs — `prefix: （`, `delimiter: ，` — into every component, and then a rewrite pass ran over the finished string and converted them *back* to ASCII for Latin-script entries. That pass only worked in one direction, and it had to be maintained at three separate points in the renderer. It worked for GB/T 7714. It would not have survived Cyrillic or Arabic.

The replacement inverts it. A style names the punctuation's *role* once — `delimiter: { mark: comma }`, `wrap: parentheses` — and the glyph is chosen late, from the item's own script. The style says what the mark means; the engine decides how wide it is.

Because that's now a table rather than a rewrite pass, the whole width policy collapses to one named option. `punctuation-width` takes four values, and **the vocabulary is borrowed directly from [biblatex-gb7714-2025](https://github.com/hushidong/biblatex-gb7714-2025)**, which named this design space first with its `gbpunctwidth` option: `half`, `full`, `mixed`, `bylan`.

To see the mechanism, extend the shipped style and change one line. Save as `gbt-bylan.yaml`:

```yaml
extends: gb-t-7714-2025-numeric
info:
  id: gbt-7714-2025-numeric-bylan
  title: "GB/T 7714—2025 (numeric), punctuation width by language"
options:
  multilingual:
    punctuation-width: bylan
```

```bash
citum render refs -b gbt-demo.yaml -s gbt-bylan.yaml
```

<div class="ba">
<div class="ba-row">
<p class="ba-label">As shipped <span class="ba-note">— <code>punctuation-width: mixed</code></span></p>
<pre class="ba-out">[1]博伯尔. 银行业的未来与人工智能[M]. 徐超，译. 北京：清华大学出版社，2023：35.
[2]図書館用語辞典編集委員会. 最新図書館用語大辭典[M]. 東京：柏書房株式會社，2004：154.
[3]Boobier T. AI and the future of banking[M]. Chichester：John Wiley &amp; Sons，2020：35.</pre>
</div>
<div class="ba-row">
<p class="ba-label">One line changed <span class="ba-note">— <code>punctuation-width: bylan</code></span></p>
<pre class="ba-out">【1】博伯尔. 银行业的未来与人工智能【M】. 徐超，译. 北京：清华大学出版社，2023：35.
【2】図書館用語辞典編集委員会. 最新図書館用語大辭典【M】. 東京：柏書房株式會社，2004：154.
[3]Boobier T. AI and the future of banking[M]. Chichester: John Wiley &amp; Sons, 2020: 35.</pre>
</div>
</div>

Under `bylan`, the Chinese and Japanese entries keep full-width punctuation and the English one drops to half-width — `Chichester: John Wiley & Sons, 2020: 35.` — including the brackets around the entry number. Nothing in the template changed. Each item's language decided its own glyphs.

`mixed` is what ships, and it's worth saying why: GB/T 7714 shows the period and the square brackets as ASCII in every example it gives, for Chinese and Western references alike, even where it uses full-width commas and colons. `bylan` is the more mechanically consistent rule; `mixed` is the one the standard actually specifies. The reasoning, and the places where citeproc-js and the published standard disagree, are recorded in Citum's [divergence register](https://github.com/citum/citum-core/blob/main/docs/adjudication/DIVERGENCE_REGISTER.md).

The design is written up in [`PUNCTUATION_REALIZATION.md`](https://github.com/citum/citum-core/blob/main/docs/specs/PUNCTUATION_REALIZATION.md). The old rewrite pass still exists, but it's frozen — kept working for externally authored styles that used literal glyphs, and never extended again.

## Terms in the language of the source

A German source cited in an English-language document should read "hrsg. von", not "edited by", while its English neighbours keep reading "edited by". biblatex has done this for years under `autolang`; CSL-M approximates it with a per-item `default-locale`.

Citum could only do it by swapping the entire template out through a locale branch — changing the structure of every entry in order to change the language of two words. Those are different axes, and the audit called out that bundling them was wrong.

There is now a one-line opt-in. Save these as `autolang-refs.yaml`:

```yaml
references:
  - id: kant-kritik
    class: monograph
    type: book
    title: "Kritik der reinen Vernunft"
    author:
      - given: "Immanuel"
        family: "Kant"
    editor:
      - given: "Jens"
        family: "Timmermann"
    publisher:
      name: "Felix Meiner Verlag"
      place: "Hamburg"
    issued: "1998"
    language: "de-DE"

  - id: rawls-justice
    class: monograph
    type: book
    title: "A Theory of Justice"
    author:
      - given: "John"
        family: "Rawls"
    editor:
      - given: "Erin"
        family: "Kelly"
    publisher:
      name: "Harvard University Press"
      place: "Cambridge, MA"
    issued: "2001"
    language: "en-US"

  - id: bourdieu-distinction
    class: monograph
    type: book
    title: "La distinction"
    author:
      - given: "Pierre"
        family: "Bourdieu"
    editor:
      - given: "Anne"
        family: "Lefebvre"
    publisher:
      name: "Les Éditions de Minuit"
      place: "Paris"
    issued: "1979"
    language: "fr-FR"
```

and this as `autolang-style.yaml`:

```yaml
extends: chicago-author-date-18th
info:
  id: chicago-author-date-18th-autolang
  title: "Chicago 18 (author-date), terms in each item's language"
bibliography:
  options:
    multilingual:
      term-locale: item
```

```bash
citum render refs -b autolang-refs.yaml -s autolang-style.yaml
```

<div class="ba">
<div class="ba-row">
<p class="ba-label">Default <span class="ba-note">— <code>term-locale: style</code>, i.e. <code>-s chicago-author-date-18th</code></span></p>
<pre class="ba-out">Bourdieu, Pierre. 1979. _La distinction_. Edited by Anne Lefebvre. Les Éditions de Minuit.
Kant, Immanuel. 1998. _Kritik der reinen Vernunft_. Edited by Jens Timmermann. Felix Meiner Verlag.
Rawls, John. 2001. _A Theory of Justice_. Edited by Erin Kelly. Harvard University Press.</pre>
</div>
<div class="ba-row">
<p class="ba-label">Opted in <span class="ba-note">— <code>term-locale: item</code></span></p>
<pre class="ba-out">Bourdieu, Pierre. 1979. _La distinction_. Édité par Anne Lefebvre. Les Éditions de Minuit.
Kant, Immanuel. 1998. _Kritik der reinen Vernunft_. Herausgegeben von Jens Timmermann. Felix Meiner Verlag.
Rawls, John. 2001. _A Theory of Justice_. Edited by Erin Kelly. Harvard University Press.</pre>
</div>
</div>

Three languages, three role labels, one template — and the English entry is byte-identical to what it was before. Typography stays with the style: quote characters and collision policy don't follow the item, only the words do. Details in [`PER_ITEM_TERM_LOCALE.md`](https://github.com/citum/citum-core/blob/main/docs/specs/PER_ITEM_TERM_LOCALE.md).

## Dates that remember what calendar they came from

GB/T 7714—2025 requires a Gregorian publication year to carry the source calendar's own year alongside it: `1705（康熙四十四年）` — the 44th year of the Kangxi reign — or `1947（民国三十六年）`, Minguo year 36.

This is a genuinely awkward thing to model. The obvious approach is a calendar system field, era tables, and conversion — which is a large amount of machinery, all of it a liability the moment it's slightly wrong about someone's history.

Citum does the small thing instead. Any date value can carry an opaque `note`:

```yaml
issued:
  value: "1705"
  note: "康熙四十四年"
```

`value` is the only date the engine computes with. Sorting, author-date collision grouping, year-suffix assignment, and disambiguation all read `value` and ignore `note` entirely — two works with the same author and year stay a collision no matter what their notes say, and a note can never reorder a bibliography. Citum stores the note's text verbatim and never parses, converts, translates, or validates it. There is no era table, no dynasty list, and no calendar identifier, by design.

Whether it's *displayed* is the style's decision, not the data's. Save as `datenote-refs.yaml`:

```yaml
references:
  - id: kangxi-diary
    class: monograph
    type: book
    title: "康熙起居注"
    author:
      - name: "中国第一历史档案馆"
    publisher:
      name: "中华书局"
      place: "北京"
    issued:
      value: "1705"
      note: "康熙四十四年"
    language: "zh-CN"

  - id: li-hongzhang-memorial
    class: monograph
    type: book
    title: "上海道库洋务外销要款"
    author:
      - name: "李鸿章"
    publisher:
      name: "中国第一历史档案馆"
      place: "北京"
    issued:
      value: "1947"
      note: "民国三十六年"
    language: "zh-CN"
```

<div class="ba">
<div class="ba-row">
<p class="ba-label">A style with no opt-in <span class="ba-note">— <code>-s apa-7th</code>; the annotation is simply not rendered</span></p>
<pre class="ba-out">中国第一历史档案馆. (1705). _康熙起居注_. 中华书局.
李鸿章. (1947). _上海道库洋务外销要款_. 中国第一历史档案馆.</pre>
</div>
<div class="ba-row">
<p class="ba-label">A style that opts in <span class="ba-note">— <code>-s gb-t-7714-2025-numeric</code>, which sets <code>note-wrap: parentheses</code></span></p>
<pre class="ba-out">[1]中国第一历史档案馆. 康熙起居注[M]. 北京：中华书局，1705（康熙四十四年）.
[2]李鸿章. 上海道库洋务外销要款[M]. 北京：中国第一历史档案馆，1947（民国三十六年）.</pre>
</div>
</div>

Identical input files. The data describes what's true about the source; the style decides what to show. And the parentheses around the annotation are full-width because the item is Chinese — the punctuation layer from two sections up, doing its job without the style asking.

Note that this `note` is a sub-field of a *date*, and has nothing to do with CSL's top-level `note` variable on a reference. Spec: [`CALENDAR_DATE_ANNOTATIONS.md`](https://github.com/citum/citum-core/blob/main/docs/specs/CALENDAR_DATE_ANNOTATIONS.md).

## Also landed

The audit found more than four things. Briefly, all in 0.78.0:

- **Script resolution now produces ISO 15924 codes**, not a latin/not-latin boolean, resolved from BCP 47 language tags via ICU4X — so `zh-CN` and `ja-JP` are distinguishable, which is the precondition for taking YDX's Chinese-is-not-Japanese point seriously anywhere in the engine. Absent or unrecognised evidence still resolves to *no* script rather than a default.
- **zh-CN and ar-AR grew typography and date patterns.** Both locales previously had no `grammar-options` and no `date-formats`, so Chinese and Arabic output silently inherited English curly quotes and English date assembly. `yyyy年M月d日`-style patterns are now expressible. A lint now warns when an embedded locale is missing either section, so English fallback is a visible choice instead of a silent one.
- **ja-JP, ko-KR, and ru-RU embedded locales** now exist at the structural depth of the German one. Each carries an explicit marker that its vocabulary has not been reviewed by a native speaker — if you read one of these languages, that file is the highest-leverage thing you could look at.
- **Digit systems are localizable.** Arabic-Indic (٠١٢), extended Arabic-Indic, and Devanagari digits render from locale configuration; ar-AR uses Arabic-Indic.
- **Case mapping is locale-tailored.** Turkish and Azerbaijani dotted and dotless i (`i`↔`İ`, `ı`↔`I`) were being mangled by Rust's locale-blind case conversion. The sting was that Citum's `tr-TR` locale file was one of the most complete in the tree — locale-data investment bought no protection against an engine-level gap.
- **There is now a bidi/RTL spec**, [`BIDI_OUTPUT.md`](https://github.com/citum/citum-core/blob/main/docs/specs/BIDI_OUTPUT.md), covering direction detection and isolation for HTML and plain-text output. To be clear: that one is a **spec, not an implementation**. An Arabic bibliography entry mixing RTL text with a Latin DOI can still scramble visually today.

## Prior art

Chinese bibliography support in Citum is not an independent invention, and it would be dishonest to present it as one.

The three embedded GB/T styles derive from the CSL-M bilingual styles maintained by **Zeping Lee** and the [zotero-chinese](https://github.com/zotero-chinese/styles) community, used under CC BY-SA 3.0 with upstream metadata and rights notices retained; the provenance is [recorded in the repo](https://github.com/citum/citum-core/blob/main/tests/fixtures/csl-m/gb-t-7714-2025-SOURCE.md). Zeping Lee also maintains `gbt7714-bibtex-style` and `citeproc-lua` — the latter being, on YDX's benchmark, the strongest performer on the same input Citum reads.

The `punctuation-width` presets take their names and their meanings from **hushidong**'s [biblatex-gb7714-2025](https://github.com/hushidong/biblatex-gb7714-2025). Establishing that this design space is a closed set of four options, and what each should mean, was their work; Citum's contribution is realizing them from semantic marks rather than from string rewriting.

`term-locale: item` is Citum's version of biblatex's `autolang` and CSL-M's per-item `default-locale`.

And if you don't read Chinese, [typst-doc-cn's clreq notes](https://typst-doc-cn.github.io/clreq/#bibliography) are the best English-language description of what makes GB/T 7714 hard. GB/T 7714 itself has no English text.

The fuller comparison with CSL-M, biblatex, citeproc-rs, and BibTeX is in [`PRIOR_ART.md`](https://github.com/citum/citum-core/blob/main/docs/architecture/PRIOR_ART.md).

## Still open

In the spirit of the first post, the things that aren't done:

- **Compound citations that mix scripts** resolve their punctuation from the first item in the cluster, and apply it to the whole thing. If you cite a Chinese and an English source together in one bracket, one of them gets the wrong glyphs.
- **Bidi is specified but not implemented**, as above.
- **The BibTeX conversion path is fixed but unreleased.** Export CSL-JSON from Zotero until the next release.
- **I have not yet fixed the examples YDX corrected.** The multilingual example file in citum-core still splits 孔子 into family and given parts and still carries the wrong pinyin tone, and the partitioning example still puts Chinese and Japanese in one section. The engine can now tell those apart; the example files haven't caught up. That's on me.

## How to give feedback

Unchanged from last time:

**Design questions** — "is this the right abstraction?" — go to [citum-core Discussions](https://github.com/citum/citum-core/discussions/828).

**Concrete rendering bugs** go to [Issues](https://github.com/citum/citum-core/issues) with the `multilingual` label. To make a report actionable, include the exact command, a minimal reference snippet, the actual output, the expected output *with a pointer to the authority* — a standard, a style manual, a published example — and the language, script, and romanization scheme involved.

That last part matters more than it sounds. The reason GB/T support exists at all is that someone took the trouble to cite the clause, screenshot the standard, and explain why my example was wrong. Thank you, YDX.

<style>
  .ba{ margin:0 0 1.8rem; border:1px solid var(--hairline); background:var(--plaster); }
  .ba-row{ padding:1rem 1.2rem 1.1rem; }
  .ba-row + .ba-row{ border-top:1px solid var(--hairline); background:var(--paper); }
  .ba-label{ font-family:var(--sans); font-size:.7rem; letter-spacing:.09em;
             text-transform:uppercase; font-weight:700; margin:0 0 .55rem;
             color:var(--graphite); }
  .ba-row + .ba-row .ba-label{ color:var(--moss); }
  .ba-label .ba-note{ text-transform:none; letter-spacing:0; font-weight:400; }
  .ba-out{ font-family:var(--mono); font-size:.84rem; line-height:1.75;
           white-space:pre; overflow-x:auto; margin:0;
           background:none; border:0; padding:0; }
</style>
