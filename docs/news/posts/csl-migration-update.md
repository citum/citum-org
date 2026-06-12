---
title: "CSL migration update: why style conversion is still hard"
date: 2026-06-12
summary: Citum's CSL migration path is improving, but automatic conversion is not solved. This update explains why CSL XML is hard to translate, how the migrator has shifted toward measured output, and why citum/skills is part of the bridge between automated migration and usable styles.
---

# CSL migration update: why style conversion is still hard

Citum's long-term goal is straightforward to state: take the large existing CSL
style ecosystem and make it usable in Citum's declarative style model.

Achieving that goal, however, is not straightforward. CSL 1.0 encodes citation
and bibliography behavior through nested XML macros, conditionals, locale terms,
substitution rules, position tests, type tests, and formatting inheritance.
In short, the template language is quite complex. 
Citum styles are deliberately different: declarative YAML or JSON, typed components,
explicit options, and style inheritance rather than procedural layout trees.
The Citum template language, in particular, is deliberately simpler than CSL, with
logic mostly defined outside of templates.

That difference is the reason Citum exists. It is also the reason migration is
hard.

This post is a status update on where the migration work stands, why it has
taken longer than hoped, and why automated conversion will likely remain a
hybrid process for a while.

## The hard part is not parsing XML

Parsing CSL XML is the easy part. The migrator can read a `.csl` file, extract
metadata, identify citation and bibliography layouts, and map many variables,
terms, names, dates, numbers, and formatting attributes into Citum's schema.

The hard part is preserving *behavior*.

A CSL layout is not just a list of output components. It is a small decision
tree. A style may render a publisher only for books, suppress a title for
journal articles, swap author and editor when one is missing, change date
granularity for webpages, use a different delimiter inside a particular group,
or rely on a macro that means different things in citation and bibliography
contexts.

When that logic is compiled into a Citum template, the converter has to decide
what should become a general template, what should become a type-specific
variant, what should become an option, and what should be left for a later
human edit. Some CSL constructs map cleanly. Others map only after the style is
observed against real output.

That is the central lesson so far: the migration problem is output-driven, not
syntax-driven.

## The first approach: structural translation

The early migrator mostly followed the XML structure. It walked the CSL layout,
translated known elements into Citum components, and emitted a style that
looked like a declarative equivalent of the source.

That got us a long way. It also exposed a ceiling.

The structural approach can produce styles that are valid and plausible, but
not faithful enough. Common failure modes include:

- component order drift, especially when CSL macros expand differently across
  contexts
- conditional leakage, where a component meant for one reference type appears
  in another
- lost or misplaced affixes and delimiters
- date granularity mismatches, such as year-only output where a full date is
  required
- name formatting differences, including small caps and case behavior
- bibliography entries that look close but fail strict case or punctuation
  expectations

In a migration tool, "close" is useful but not sufficient. If the converted
style still needs many manual fixes, we need to know where the failures are and
which automated edits are actually improving output.

## The current approach: measured candidates

The current work has shifted the migrator toward measured candidate selection.
Instead of trusting a single translation path, the migrator can render candidate
Citum styles, compare them against citeproc-js output for the original CSL
style, and select the candidate that scores better.

This matters because Citum now has both sides of the comparison embedded in the
migration workflow:

- citeproc-js can render the CSL source as the reference output
- Citum's engine can render candidate migrated styles

That lets the migrator ask a more useful question than "did this XML tree
compile?" It can ask "which candidate produces output closest to the CSL
oracle?"

## Current status

The migration pipeline is improving, but it is not finished.

On a fixed random sample of 100 CSL styles, recent measured-candidate work
moved the number of styles scoring over 90 percent from the high 50s to the
high 60s. That is meaningful progress. It is also not enough to claim that CSL
migration is solved.

The practical status is:

- many common styles migrate to usable or nearly usable Citum styles
- measured output selection is catching failures the structural translator
  could not see
- some sentinel styles have moved from visibly wrong output to high-fidelity
  output
- a substantial minority of styles still need manual or agent-assisted cleanup
- the remaining failures are often style-specific, not one global missing
  feature

That last point matters. Conversion often involves judgement calls: how to
represent a style's intent declaratively, which parent style it should extend,
which type variants should be kept, and which tiny output differences are
actually meaningful.

## Human and LLM tweaking is still part of the workflow

For now, many converted styles still need review and cleanup by a human, an LLM,
or both.

That is not a failure of the project. It is an honest description of the bridge
between CSL's procedural XML ecosystem and Citum's declarative model.

A useful migration result is not necessarily a giant one-to-one translation of
the original CSL file. Often the better result is a small Citum style that
extends a known parent and overrides only what differs. Producing that minimal
style can require domain judgement:

- Is this really an APA variant, or only superficially similar?
- Should the journal article template inherit from the default bibliography
  template, or should it have its own variant?
- Is a case-only mismatch a bug, or a style convention?
- Should a date be year-only for books but full for webpages?
- Which output differences are acceptable under the target style's rules?

These questions are exactly where human review and capable LLM agents are
useful. The automated migrator should do the heavy lifting, produce evidence,
and narrow the search space. It should not pretend every style can be converted
perfectly from XML syntax alone.

## Where `citum/skills` fits

This is why [`citum/skills`](https://github.com/citum/skills) matters.

The skill is intended to bridge the current gap between automated migration and
production-quality style authoring. It teaches an agent the Citum style model,
the validation workflow, the difference between CSL macros and Citum templates,
and the preferred way to extend an existing parent style instead of rewriting
everything.

In practice, the emerging workflow looks like this:

1. Run `citum-migrate` to get a measured first draft.
2. Validate the output with `citum check --strict`.
3. Render fixture references and compare the output.
4. Use `citum/skills` to guide targeted cleanup.
5. Keep the final style as small and declarative as possible.

The point is not to outsource correctness to an LLM. The point is to give the
agent enough schema knowledge, examples, and validation discipline that it can
make useful edits instead of inventing CSL-shaped YAML.

## What comes next

The migration work will continue in two tracks.

First, `citum-core` will keep improving the measured migrator: better candidate
families, better evidence, better fixture coverage, and tighter alignment with
the oracle. Each improvement should move a measurable slice of styles without
making runtime or search complexity explode.

Second, `citum/skills` will keep improving the authoring layer around the
migrator: how to inspect parent templates, how to write safe type-variant
diffs, how to validate a converted style, and how to explain the remaining
differences.

The honest goal is not magic conversion. The goal is a migration pipeline that
gets most of the way automatically, shows its evidence, and leaves a small,
well-structured cleanup task when a style needs judgement.

That is a less dramatic story than "all CSL styles convert perfectly." It is
also the path that is proving technically sustainable.
