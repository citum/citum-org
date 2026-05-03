---
title: Welcome to Citum News
date: 2026-05-02
summary: A new space to share project updates and feature releases.
---


# Introducing Citum: The Next Generation of Citation Styling

Welcome to the official Citum blog!

Citum is a modern, declarative citation styling system designed to be the successor-focused evolution of CSL 1.0 (Citation Style Language). For years, citation styling has relied on
complex XML definitions and legacy processing. With Citum, we are reimagining this ecosystem from the ground up to be faster, more maintainable, and deeply integrated with modern
tooling.

Instead of dealing with intricate XML logic, Citum styles are expressed as clean, declarative YAML or JSON templates. These templates are then rendered by a highly performant, type-safe
Rust processor.

## The Broader Project Ecosystem

Citum isn’t just an engine; it’s a complete platform for authors, developers, and style maintainers. The project is currently divided into two main pillars:

1. Citum Core

At the heart of the project is citum-core, our Rust-based engine. It provides:
 - Type-Safe Processing: A robust schema and shared models for predictable, error-free rendering.
 - The Citum CLI: Tools to render references, convert formats (including robust support for CSL-JSON, BibLaTeX, and RIS), and validate styles directly from your terminal.
 - Migration Pipeline: A hybrid migration tool designed to seamlessly convert legacy CSL 1.0 XML styles into the modern Citum YAML format while maintaining high fidelity.

2. Citum Hub

To make styling accessible to everyone, we are building Citum Hub—a modern web platform powered by Svelte 5, Bun, and the Citum Rust engine running via WebAssembly (WASM).
 - Discover & Manage: A centralized repository to browse, find, and save citation styles.
 - Intent-Based Wizard: Create new styles simply by answering questions about how you want your citations to look, with real-time WASM-powered previews.
 - Export Anywhere: Download your custom styles as valid Citum JSON/YAML to use in your local workflow.

## Future Plans

We are in active development, and our immediate roadmap is focused on stabilization and adoption:

1. Perfecting Legacy Migration: We are continuously refining our CSL 1.0 to Citum migration pipeline, using our compatibility dashboard and oracle verification against citeproc-js to
   ensure styles behave exactly as expected.
2. Schema Stabilization: Locking down the core citum_schema to ensure long-term stability for style authors.
3. Citum Hub Expansion: Expanding the intent-based creation wizard and building out the public library of community-managed styles.
4. Tooling Integrations: Paving the way for Citum to be integrated into modern writing tools, markdown processors, and text editors.

## We Need Your Feedback

Citum is being built for the community, and we want your input to ensure we're building the right tools for your workflow.

 - Test the Engine: Clone citum-core, run the CLI, and try rendering your references or converting your existing legacy styles.
 - Try the Hub: Test out the visual style editor and WASM integration.
 - Share Your Thoughts: Are there specific citation edge-cases you struggle with? Is the YAML schema intuitive? We'd love to hear from you in our GitHub Discussions or via issues.

Stay tuned for more deep dives into the architecture, migration strategies, and tutorial guides. Welcome to the future of citation styling!

