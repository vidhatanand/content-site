#!/usr/bin/env node
/**
 * Validates frontmatter in all blog posts.
 * Run: node scripts/validate-frontmatter.mjs
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, '../src/content/blog');

const REQUIRED_FIELDS = ['title', 'description', 'pubDate', 'cluster', 'author'];
const VALID_CLUSTERS = [
  'ai-content-creation',
  'topical-authority-seo',
  'b2b-saas-content',
  'seo-content-production',
  'thought-leadership',
];

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    fm[key] = value;
  }
  return fm;
}

let errors = 0;

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

for (const file of files) {
  const content = readFileSync(join(BLOG_DIR, file), 'utf-8');
  const fm = parseFrontmatter(content);

  if (!fm) {
    console.error(`❌ ${file}: Missing frontmatter`);
    errors++;
    continue;
  }

  for (const field of REQUIRED_FIELDS) {
    if (!fm[field]) {
      console.error(`❌ ${file}: Missing required field "${field}"`);
      errors++;
    }
  }

  if (fm.cluster && !VALID_CLUSTERS.includes(fm.cluster)) {
    console.error(`❌ ${file}: Invalid cluster "${fm.cluster}". Must be one of: ${VALID_CLUSTERS.join(', ')}`);
    errors++;
  }

  if (fm.description && fm.description.length > 160) {
    console.warn(`⚠️  ${file}: Description is ${fm.description.length} chars (max 160)`);
  }
}

if (errors === 0) {
  console.log(`✅ All ${files.length} article(s) passed frontmatter validation`);
} else {
  console.error(`\n${errors} error(s) found across ${files.length} article(s)`);
  process.exit(1);
}
