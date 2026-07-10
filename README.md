# citum.org

Static GitHub Pages source for `https://citum.org`. The published root is `docs/`.

## Local preview

```bash
cd scripts && bun install && bun run build-news.js
python3 -m http.server -d docs 8080
```

This generates the news HTML from `docs/news/posts/*.md` before serving `docs/` at `http://localhost:8080`.

## Writing news posts

Posts live as Markdown files with YAML frontmatter (`title`, `date`, `summary`) in `docs/news/posts/`. Running `bun run build-news.js` in `scripts/` renders them into `docs/news/` using `news-index.template.html` and `news-item.template.html`. The generated HTML is gitignored — only the Markdown sources and templates are tracked.

## Deployment

`.github/workflows/deploy_pages.yml` builds the news HTML and publishes `docs/` to GitHub Pages on every push to `main` that touches `docs/**` or `scripts/**`.
