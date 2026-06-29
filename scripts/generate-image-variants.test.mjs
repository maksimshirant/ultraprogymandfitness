import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const PROJECT_ROOT = process.cwd();
const SCRIPT_PATH = path.join(PROJECT_ROOT, 'scripts', 'generate-image-variants.mjs');

async function ensureFile(filePath, { width = 1600, height = 900 } = {}) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: '#7a5c2e',
    },
  })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(filePath);
}

async function listRelativeFiles(rootDir) {
  const files = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const nextPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(nextPath);
        continue;
      }

      files.push(path.relative(rootDir, nextPath).split(path.sep).join('/'));
    }
  }

  await walk(rootDir);
  return files.sort();
}

async function runGenerator(cwd, cacheKey) {
  const previousCwd = process.cwd();

  process.chdir(cwd);

  try {
    const { runImageVariantGeneration } = await import(`${pathToFileURL(SCRIPT_PATH).href}?test=${cacheKey}`);
    await runImageVariantGeneration();
  } finally {
    process.chdir(previousCwd);
  }
}

async function testMinimalVariantSet() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ultrapro-images-'));
  const contentFile = path.join(tempDir, 'content', 'trainers', 'sample.jpg');
  const staleFiles = [
    'public/trainers/sample-preview.jpg',
    'public/trainers/sample-thumb.jpg',
    'public/trainers/sample-placeholder.jpg',
    'public/trainers/sample-w480.avif',
    'public/trainers/sample-w768.webp',
  ];

  await ensureFile(contentFile);

  for (const staleFile of staleFiles) {
    await ensureFile(path.join(tempDir, staleFile));
  }

  await runGenerator(tempDir, 'content-source');

  const actualFiles = await listRelativeFiles(path.join(tempDir, 'public', 'trainers'));

  assert.deepEqual(actualFiles, [
    'sample.avif',
    'sample.jpg',
    'sample.webp',
    'sample-placeholder.webp',
    'sample-preview.avif',
    'sample-preview-w1024.avif',
    'sample-preview-w1024.webp',
    'sample-preview-w480.avif',
    'sample-preview-w480.webp',
    'sample-preview-w768.avif',
    'sample-preview-w768.webp',
    'sample-preview.webp',
    'sample-thumb.avif',
    'sample-thumb-w160.avif',
    'sample-thumb-w160.webp',
    'sample-thumb-w320.avif',
    'sample-thumb-w320.webp',
    'sample-thumb-w480.avif',
    'sample-thumb-w480.webp',
    'sample-thumb.webp',
  ].sort());
}

async function testFallbackSourceDirectory() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ultrapro-images-'));
  const sourceFile = path.join(tempDir, '.assets-source', 'trainers', 'sample.jpg');

  await ensureFile(sourceFile);
  await runGenerator(tempDir, 'assets-source');

  await assert.doesNotReject(() => fs.access(path.join(tempDir, 'public', 'trainers', 'sample.jpg')));
  await assert.doesNotReject(() => fs.access(path.join(tempDir, 'public', 'trainers', 'sample-preview.avif')));
}

async function testPortraitWidthCandidatesMatchTheirDescriptors() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ultrapro-images-'));
  const contentFile = path.join(tempDir, 'content', 'trainers', 'portrait.jpg');

  await ensureFile(contentFile, { width: 900, height: 1600 });
  await runGenerator(tempDir, 'portrait-width');

  const metadata = await sharp(
    path.join(tempDir, 'public', 'trainers', 'portrait-preview-w480.avif')
  ).metadata();

  assert.equal(metadata.width, 480);
}

async function main() {
  await testMinimalVariantSet();
  await testFallbackSourceDirectory();
  await testPortraitWidthCandidatesMatchTheirDescriptors();
  console.log('generate-image-variants tests passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
