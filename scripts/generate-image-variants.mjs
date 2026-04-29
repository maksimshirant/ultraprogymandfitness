import { promises as fs } from 'node:fs';
import path from 'node:path';

let sharp;

try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error('The script requires the "sharp" package in node_modules to generate image variants.');
  console.error('Install it locally and rerun: npm install --save-dev sharp');
  process.exit(1);
}

const PROJECT_ROOT = process.cwd();
const CONTENT_SOURCE_MAPPINGS = [
  { inputDir: 'content/trainers', outputDir: 'public/trainers' },
  { inputDir: 'content/floors', outputDir: 'public/floors' },
];
const TARGET_INPUT_FILES = [
  { inputPath: 'public/mainhero/card.png', outputPath: 'public/mainhero/card.png' },
  { inputPath: 'public/mainhero/hbg.png', outputPath: 'public/mainhero/hbg.png' },
];
const INPUT_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const GENERATED_STEM_PATTERN = /(?:-preview|-thumb|-placeholder)(?:-w\d+)?$|-w\d+$/i;

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

const RESPONSIVE_VARIANTS = [
  {
    key: 'default',
    masterWidth: null,
    masterSuffix: '',
    widthCandidates: [480, 768, 1024, 1280, 1536],
    masterOutputFormats: BASE_OUTPUT_FORMATS,
    responsiveOutputFormats: BASE_OUTPUT_FORMATS,
    qualityOverrides: {},
  },
  {
    key: 'preview',
    masterWidth: 1600,
    masterSuffix: 'preview',
    widthCandidates: [320, 480, 640, 768, 960, 1200, 1280],
    masterOutputFormats: [
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
    responsiveOutputFormats: [
      {
        extension: '.avif',
        encode: (image) => image.avif({ quality: 44, effort: 7 }),
      },
      {
        extension: '.webp',
        encode: (image) => image.webp({ quality: 60, effort: 6 }),
      },
    ],
    qualityOverrides: {},
  },
  {
    key: 'thumb',
    masterWidth: 640,
    masterSuffix: 'thumb',
    widthCandidates: [160, 240, 320, 480],
    masterOutputFormats: [
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
    responsiveOutputFormats: [
      {
        extension: '.avif',
        encode: (image) => image.avif({ quality: 34, effort: 7 }),
      },
      {
        extension: '.webp',
        encode: (image) => image.webp({ quality: 46, effort: 6 }),
      },
    ],
    qualityOverrides: {},
  },
  {
    key: 'placeholder',
    masterWidth: 48,
    masterSuffix: 'placeholder',
    widthCandidates: [],
    masterOutputFormats: [
      {
        extension: 'source',
        encode: (image, inputExtension) => encodeForExtension(image, inputExtension, 40),
      },
      {
        extension: '.avif',
        encode: (image) => image.avif({ quality: 28, effort: 7 }),
      },
      {
        extension: '.webp',
        encode: (image) => image.webp({ quality: 34, effort: 6 }),
      },
    ],
    responsiveOutputFormats: [],
    blurSigma: 0.8,
    qualityOverrides: {},
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

function getOutputStem(assetStem, suffix) {
  return suffix ? `${assetStem}-${suffix}` : assetStem;
}

function formatRelativePath(filePath) {
  return path.relative(PROJECT_ROOT, filePath).split(path.sep).join('/');
}

async function collectImageFiles(directoryPath) {
  const absoluteDirectoryPath = path.join(PROJECT_ROOT, directoryPath);
  let directoryEntries;

  try {
    directoryEntries = await fs.readdir(absoluteDirectoryPath, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
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

      if (!INPUT_EXTENSIONS.has(extension) || GENERATED_STEM_PATTERN.test(fileStem)) {
        return [];
      }

      return [entryRelativePath];
    })
  );

  return nestedFiles.flat();
}

async function ensureOriginalAsset(inputPath, outputPath, inputExtension) {
  if (inputPath === outputPath) {
    const metadata = await sharp(outputPath, { animated: false }).metadata();

    return {
      created: false,
      path: formatRelativePath(outputPath).replace(/^public\//, ''),
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
    };
  }

  return ensureEncodedAsset({
    inputPath,
    outputPath,
    width: null,
    encode: (image) => encodeForExtension(image, inputExtension, 86),
    inputExtension,
  });
}

function createPipeline(inputPath, width, blurSigma) {
  let image = sharp(inputPath, { animated: false }).rotate();

  if (typeof width === 'number') {
    image = image.resize({
      width,
      height: width,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  if (typeof blurSigma === 'number') {
    image = image.blur(blurSigma);
  }

  return image;
}

async function ensureEncodedAsset({
  inputPath,
  outputPath,
  width,
  blurSigma,
  encode,
  inputExtension,
}) {
  const inputStats = await fs.stat(inputPath);
  let created = false;

  try {
    const outputStats = await fs.stat(outputPath);

    if (outputStats.mtimeMs >= inputStats.mtimeMs) {
      const metadata = await sharp(outputPath, { animated: false }).metadata();

      return {
        created: false,
        path: formatRelativePath(outputPath).replace(/^public\//, ''),
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
      };
    }
  } catch {
    created = true;
  }

  if (!created) {
    created = true;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await encode(createPipeline(inputPath, width, blurSigma), inputExtension).toFile(outputPath);

  const metadata = await sharp(outputPath, { animated: false }).metadata();

  return {
    created,
    path: formatRelativePath(outputPath).replace(/^public\//, ''),
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}

async function ensureVariantsForFile({ inputPath, outputPath }) {
  const absoluteInputPath = path.join(PROJECT_ROOT, inputPath);
  const absoluteOutputPath = path.join(PROJECT_ROOT, outputPath);
  const inputExtension = path.extname(inputPath).toLowerCase();
  const normalizedOutputPath = formatRelativePath(absoluteOutputPath);
  const absoluteAssetStem = absoluteOutputPath.slice(0, -path.extname(outputPath).length);
  const inputMetadata = await sharp(absoluteInputPath, { animated: false }).metadata();
  const originalWidth = inputMetadata.width ?? 0;
  const generatedFiles = [];

  const originalAsset = await ensureOriginalAsset(absoluteInputPath, absoluteOutputPath, inputExtension);

  if (originalAsset.created && originalAsset.path !== normalizedOutputPath.replace(/^public\//, '')) {
    generatedFiles.push(originalAsset.path);
  }

  for (const outputFormat of BASE_OUTPUT_FORMATS) {
    const outputPath = `${absoluteAssetStem}${outputFormat.extension}`;
    const encodedAsset = await ensureEncodedAsset({
      inputPath: absoluteInputPath,
      outputPath,
      width: null,
      encode: outputFormat.encode,
      inputExtension,
    });

    if (encodedAsset.created && encodedAsset.path !== normalizedOutputPath.replace(/^public\//, '')) {
      generatedFiles.push(encodedAsset.path);
    }
  }

  for (const variant of RESPONSIVE_VARIANTS) {
    const effectiveMasterWidth =
      typeof variant.masterWidth === 'number'
        ? Math.min(variant.masterWidth, originalWidth || variant.masterWidth)
        : originalWidth;
    const absoluteOutputStem = getOutputStem(absoluteAssetStem, variant.masterSuffix);

    if (variant.key !== 'default') {
      for (const outputFormat of variant.masterOutputFormats) {
        const outputExtension = outputFormat.extension === 'source' ? inputExtension : outputFormat.extension;
        const outputPath = `${absoluteOutputStem}${outputExtension}`;
        const encodedAsset = await ensureEncodedAsset({
          inputPath: absoluteInputPath,
          outputPath,
          width: effectiveMasterWidth || undefined,
          blurSigma: variant.blurSigma,
          encode: outputFormat.encode,
          inputExtension,
        });

        if (encodedAsset.created) {
          generatedFiles.push(encodedAsset.path);
        }
      }
    }

    for (const widthCandidate of variant.widthCandidates) {
      if (!effectiveMasterWidth || widthCandidate >= effectiveMasterWidth) {
        continue;
      }

      for (const outputFormat of variant.responsiveOutputFormats) {
        const outputPath = `${absoluteOutputStem}-w${widthCandidate}${outputFormat.extension}`;
        const encodedAsset = await ensureEncodedAsset({
          inputPath: absoluteInputPath,
          outputPath,
          width: widthCandidate,
          blurSigma: variant.blurSigma,
          encode: outputFormat.encode,
          inputExtension,
        });
        if (encodedAsset.created) {
          generatedFiles.push(encodedAsset.path);
        }
      }
    }
  }
  return [...new Set(generatedFiles)];
}

async function main() {
  const discoveredFiles = (
    await Promise.all(
      CONTENT_SOURCE_MAPPINGS.map(async ({ inputDir, outputDir }) => {
        const files = await collectImageFiles(inputDir);

        return files.map((inputPath) => ({
          inputPath,
          outputPath: path.join(outputDir, path.relative(inputDir, inputPath)),
        }));
      })
    )
  ).flat();
  const relativeInputPaths = [...discoveredFiles, ...TARGET_INPUT_FILES].sort((left, right) =>
    left.outputPath.localeCompare(right.outputPath)
  );
  const generatedFiles = [];

  for (const relativeInputPath of relativeInputPaths) {
    const createdForInput = await ensureVariantsForFile(relativeInputPath);
    generatedFiles.push(...createdForInput);
  }

  if (generatedFiles.length === 0) {
    console.log('No new variants were generated.');
    return;
  }

  console.log(`Generated ${generatedFiles.length} responsive files:`);
  for (const generatedFile of [...new Set(generatedFiles)].sort()) {
    console.log(generatedFile);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
