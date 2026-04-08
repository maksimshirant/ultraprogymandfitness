import { promises as fs } from 'node:fs';
import path from 'node:path';

let sharp;

try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error('The script requires the "sharp" package in node_modules to generate AVIF/WebP variants.');
  console.error('Install it locally and rerun: npm install --save-dev sharp');
  process.exit(1);
}

const PROJECT_ROOT = process.cwd();
const TARGET_DIRECTORIES = ['public/trainers', 'public/floors'];
const INPUT_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const BASE_OUTPUT_FORMATS = [
  {
    extension: '.avif',
    encode: (image) => image.avif({ quality: 55, effort: 7 }),
  },
  {
    extension: '.webp',
    encode: (image) => image.webp({ quality: 72, effort: 6 }),
  },
];

const DERIVED_VARIANTS = [
  {
    suffix: 'preview',
    resizeTo: 1200,
    outputFormats: [
      {
        extension: 'source',
        encode: (image, inputExtension) => encodeForExtension(image, inputExtension, 72),
      },
      {
        extension: '.avif',
        encode: (image) => image.avif({ quality: 48, effort: 7 }),
      },
      {
        extension: '.webp',
        encode: (image) => image.webp({ quality: 64, effort: 6 }),
      },
    ],
  },
  {
    suffix: 'thumb',
    resizeTo: 640,
    outputFormats: [
      {
        extension: 'source',
        encode: (image, inputExtension) => encodeForExtension(image, inputExtension, 58),
      },
      {
        extension: '.avif',
        encode: (image) => image.avif({ quality: 38, effort: 7 }),
      },
      {
        extension: '.webp',
        encode: (image) => image.webp({ quality: 52, effort: 6 }),
      },
    ],
  },
];

function encodeForExtension(image, extension, quality) {
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return image.jpeg({ quality, mozjpeg: true });
    case '.png':
      return image.png({ compressionLevel: 9, palette: true });
    case '.webp':
      return image.webp({ quality, effort: 6 });
    default:
      return image;
  }
}

async function collectImageFiles(directoryPath) {
  const absoluteDirectoryPath = path.join(PROJECT_ROOT, directoryPath);
  const directoryEntries = await fs.readdir(absoluteDirectoryPath, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    directoryEntries.map(async (entry) => {
      const entryRelativePath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectImageFiles(entryRelativePath);
      }

      if (!entry.isFile()) {
        return [];
      }

      const extension = path.extname(entry.name).toLowerCase();
      const fileStem = entry.name.slice(0, -path.extname(entry.name).length);

      if (!INPUT_EXTENSIONS.has(extension) || fileStem.endsWith('-preview') || fileStem.endsWith('-thumb')) {
        return [];
      }

      return [entryRelativePath];
    })
  );

  return nestedFiles.flat();
}

function formatRelativePath(filePath) {
  return path.relative(PROJECT_ROOT, filePath);
}

async function ensureVariantsForFile(relativeInputPath) {
  const absoluteInputPath = path.join(PROJECT_ROOT, relativeInputPath);
  const inputExtension = path.extname(relativeInputPath).toLowerCase();
  const assetStem = absoluteInputPath.slice(0, -inputExtension.length);
  const generatedFiles = [];

  for (const outputFormat of BASE_OUTPUT_FORMATS) {
    if (outputFormat.extension === inputExtension) {
      continue;
    }

    const absoluteOutputPath = `${assetStem}${outputFormat.extension}`;

    try {
      await fs.access(absoluteOutputPath);
      continue;
    } catch {
      // File does not exist yet.
    }

    const pipeline = sharp(absoluteInputPath, { animated: false }).rotate();
    await outputFormat.encode(pipeline).toFile(absoluteOutputPath);
    generatedFiles.push(formatRelativePath(absoluteOutputPath));
  }

  for (const derivedVariant of DERIVED_VARIANTS) {
    const resizedPipeline = sharp(absoluteInputPath, { animated: false })
      .rotate()
      .resize({
        width: derivedVariant.resizeTo,
        height: derivedVariant.resizeTo,
        fit: 'inside',
        withoutEnlargement: true,
      });

    for (const outputFormat of derivedVariant.outputFormats) {
      const outputExtension = outputFormat.extension === 'source' ? inputExtension : outputFormat.extension;
      const absoluteOutputPath = `${assetStem}-${derivedVariant.suffix}${outputExtension}`;

      try {
        await fs.access(absoluteOutputPath);
        continue;
      } catch {
        // File does not exist yet.
      }

      await outputFormat.encode(resizedPipeline.clone(), inputExtension).toFile(absoluteOutputPath);
      generatedFiles.push(formatRelativePath(absoluteOutputPath));
    }
  }

  return generatedFiles;
}

async function main() {
  const relativeInputPaths = (
    await Promise.all(TARGET_DIRECTORIES.map((directoryPath) => collectImageFiles(directoryPath)))
  ).flat();

  const generatedFiles = [];

  for (const relativeInputPath of relativeInputPaths) {
    const createdForInput = await ensureVariantsForFile(relativeInputPath);
    generatedFiles.push(...createdForInput);
  }

  if (generatedFiles.length === 0) {
    console.log('No new variants were generated.');
    return;
  }

  console.log(`Generated ${generatedFiles.length} files:`);
  for (const generatedFile of generatedFiles) {
    console.log(generatedFile);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
