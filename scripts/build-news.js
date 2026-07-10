const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const yaml = require('js-yaml');

const POSTS_DIR = path.join(__dirname, '../docs/news/posts');
const OUTPUT_DIR = path.join(__dirname, '../docs/news');
const INDEX_TEMPLATE_PATH = path.join(__dirname, '../docs/news/news-index.template.html');
const ITEM_TEMPLATE_PATH = path.join(__dirname, '../docs/news/news-item.template.html');

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function build() {
    console.log('Building News Section for citum-org...');
    if (!fs.existsSync(POSTS_DIR)) {
        console.error('Posts directory not found: ' + POSTS_DIR);
        process.exit(1);
    }

    const posts = [];
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
    const itemTemplate = fs.readFileSync(ITEM_TEMPLATE_PATH, 'utf8');

    files.forEach(file => {
        const fullPath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        if (!match) return;

        const frontmatter = yaml.load(match[1]);
        const htmlContent = marked.parse(match[2]);
        const slug = frontmatter.slug || slugify(frontmatter.title);
        const dateObj = new Date(frontmatter.date);
        const date = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        const postHtml = itemTemplate
            .replace(/{{TITLE}}/g, frontmatter.title)
            .replace(/{{DATE}}/g, date)
            .replace(/{{SUMMARY}}/g, frontmatter.summary || '')
            .replace(/{{CONTENT}}/g, htmlContent);

        fs.writeFileSync(path.join(OUTPUT_DIR, slug + '.html'), postHtml);
        posts.push({ ...frontmatter, dateObj, formattedDate: date, slug });
    });

    posts.sort((a, b) => b.dateObj - a.dateObj);
    const indexTemplate = fs.readFileSync(INDEX_TEMPLATE_PATH, 'utf8');
    const listHtml = posts.map(post => {
        return '<li class="news-row">' +
               '<p class="news-row-date">' + post.formattedDate + '</p>' +
               '<h2><a href="' + post.slug + '.html">' + post.title + '</a></h2>' +
               '<p class="summary">' + post.summary + '</p>' +
               '<a class="read-more" href="' + post.slug + '.html">Read the full post →</a>' +
               '</li>';
    }).join('\n');

    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexTemplate.replace('{{CONTENT}}', listHtml));
    console.log('Done! Generated ' + posts.length + ' posts.');
}
build();
