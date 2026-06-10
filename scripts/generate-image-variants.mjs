import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

let sharp;

try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.error('The script requires the "sharp" package in node_modules to generate image variants.');
  console.error('Install it locally and rerun: npm install --save-dev sharp');
  process.exit(1);
}

const PROJECT_ROOT = process.cwd();
const SOURCE_ROOT_CANDIDATES = ['content', '.assets-source'];
const SOURCE_SUBDIRECTORIES = ['trainers', 'floors', 'sections'];
const TARGET_INPUT_FILES = [
  {
    inputPath: 'public/mainhero/card.png',
    outputPath: 'public/mainhero/card.png',
    profile: {
      defaultWidthCandidates: [480, 768, 1024],
      variants: [],
    },
  },
  {
    inputPath: 'public/mainhero/hbg.png',
    outputPath: 'public/mainhero/hbg.png',
    profile: {
      defaultWidthCandidates: [480, 768, 1024, 1280],
      variants: [],
    },
  },
];
const INPUT_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const GENERATED_BASE_EXTENSIONS = new Set(['.avif', '.webp']);
const GENERATED_STEM_PATTERN = /(?:-preview|-thumb|-placeholder)(?:-w\d+)?$|-w\d+$/i;
const VARIANT_STEM_PATTERN = /^(.*?)(?:-(preview|thumb|placeholder))?(?:-w(\d+))?$/;

const AVIF_OUTPUT = {
  extension: '.avif',
  encode: (image) => image.avif({ quality: 55, effort: 7 }),
};
const WEBP_OUTPUT = {
  extension: '.webp',
  encode: (image) => image.webp({ quality: 72, effort: 6 }),
};

const BASE_OUTPUT_FORMATS = [AVIF_OUTPUT, WEBP_OUTPUT];

const RESPONSIVE_VARIANTS = [
  {
    key: 'preview',
    masterWidth: 1280,
    masterSuffix: 'preview',
    widthCandidates: [480, 768, 1024],
    masterOutputFormats: BASE_OUTPUT_FORMATS,
    responsiveOutputFormats: BASE_OUTPUT_FORMATS,
  },
  {
    key: 'thumb',
    masterWidth: 640,
    masterSuffix: 'thumb',
    widthCandidates: [160, 320, 480],
    masterOutputFormats: BASE_OUTPUT_FORMATS,
    responsiveOutputFormats: BASE_OUTPUT_FORMATS,
  },
  {
    key: 'placeholder',
    masterWidth: 48,
    masterSuffix: 'placeholder',
    widthCandidates: [],
    masterOutputFormats: [WEBP_OUTPUT],
    responsiveOutputFormats: [],
    blurSigma: 0.8,
  },
];

const STANDARD_ASSET_PROFILE = {
  defaultWidthCandidates: [],
  variants: RESPONSIVE_VARIANTS,
};

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

function toPublicRelativePath(filePath) {
  return formatRelativePath(filePath).replace(/^public\//, '');
}

async function pathExists(relativePath) {
  try {
    await fs.access(path.join(PROJECT_ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function resolveSourceMappings() {
  const mappings = [];

  for (const subdirectory of SOURCE_SUBDIRECTORIES) {
    let inputDir = null;

    for (const sourceRoot of SOURCE_ROOT_CANDIDATES) {
      const candidate = path.join(sourceRoot, subdirectory);

      if (await pathExists(candidate)) {
        inputDir = candidate;
        break;
      }
    }

    if (!inputDir) {
      continue;
    }

    mappings.push({
      inputDir,
      outputDir: path.join('public', subdirectory),
    });
  }

  return mappings;
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
      path: toPublicRelativePath(outputPath),
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
        path: toPublicRelativePath(outputPath),
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
    path: toPublicRelativePath(outputPath),
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}

function buildManagedOutputSpecs({
  absoluteInputPath,
  absoluteOutputPath,
  inputExtension,
  originalWidth,
  profile,
}) {
  const absoluteAssetStem = absoluteOutputPath.slice(0, -path.extname(absoluteOutputPath).length);
  const specs = [];

  for (const outputFormat of BASE_OUTPUT_FORMATS) {
    const outputPath = `${absoluteAssetStem}${outputFormat.extension}`;

    if (outputPath === absoluteOutputPath) {
      continue;
    }

    specs.push({
      inputPath: absoluteInputPath,
      outputPath,
      width: null,
      encode: outputFormat.encode,
      inputExtension,
    });
  }

  for (const widthCandidate of profile.defaultWidthCandidates) {
    if (!originalWidth || widthCandidate >= originalWidth) {
      continue;
    }

    for (const outputFormat of BASE_OUTPUT_FORMATS) {
      specs.push({
        inputPath: absoluteInputPath,
        outputPath: `${absoluteAssetStem}-w${widthCandidate}${outputFormat.extension}`,
        width: widthCandidate,
        encode: outputFormat.encode,
        inputExtension,
      });
    }
  }

  for (const variant of profile.variants) {
    const effectiveMasterWidth = Math.min(variant.masterWidth, originalWidth || variant.masterWidth);
    const absoluteOutputStem = getOutputStem(absoluteAssetStem, variant.masterSuffix);

    for (const outputFormat of variant.masterOutputFormats) {
      specs.push({
        inputPath: absoluteInputPath,
        outputPath: `${absoluteOutputStem}${outputFormat.extension}`,
        width: effectiveMasterWidth || undefined,
        blurSigma: variant.blurSigma,
        encode: outputFormat.encode,
        inputExtension,
      });
    }

    for (const widthCandidate of variant.widthCandidates) {
      if (!effectiveMasterWidth || widthCandidate >= effectiveMasterWidth) {
        continue;
      }

      for (const outputFormat of variant.responsiveOutputFormats) {
        specs.push({
          inputPath: absoluteInputPath,
          outputPath: `${absoluteOutputStem}-w${widthCandidate}${outputFormat.extension}`,
          width: widthCandidate,
          blurSigma: variant.blurSigma,
          encode: outputFormat.encode,
          inputExtension,
        });
      }
    }
  }

  return specs;
}

function isManagedVariantFile({ baseStem, fileName, originalRelativePath, relativePath }) {
  const extension = path.extname(fileName).toLowerCase();

  if (!INPUT_EXTENSIONS.has(extension) && !GENERATED_BASE_EXTENSIONS.has(extension)) {
    return false;
  }

  const stemWithoutExtension = fileName.slice(0, -extension.length);
  const match = stemWithoutExtension.match(VARIANT_STEM_PATTERN);

  if (!match) {
    return false;
  }

  const [, assetStem, variantSuffix, widthToken] = match;

  if (assetStem !== baseStem) {
    return false;
  }

  if (variantSuffix || widthToken) {
    return true;
  }

  return GENERATED_BASE_EXTENSIONS.has(extension) && relativePath !== originalRelativePath;
}

async function removeObsoleteVariants({ absoluteOutputPath, expectedRelativePaths }) {
  const baseStem = path.basename(absoluteOutputPath, path.extname(absoluteOutputPath));
  const outputDir = path.dirname(absoluteOutputPath);
  const originalRelativePath = toPublicRelativePath(absoluteOutputPath);
  let directoryEntries;

  try {
    directoryEntries = await fs.readdir(outputDir, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }

  const removedPaths = [];

  for (const entry of directoryEntries) {
    if (!entry.isFile()) {
      continue;
    }

    const absoluteFilePath = path.join(outputDir, entry.name);
    const relativePath = toPublicRelativePath(absoluteFilePath);

    if (expectedRelativePaths.has(relativePath)) {
      continue;
    }

    if (!isManagedVariantFile({ baseStem, fileName: entry.name, originalRelativePath, relativePath })) {
      continue;
    }

    await fs.unlink(absoluteFilePath);
    removedPaths.push(relativePath);
  }

  return removedPaths;
}

async function ensureVariantsForFile({ inputPath, outputPath, profile = STANDARD_ASSET_PROFILE }) {
  const absoluteInputPath = path.join(PROJECT_ROOT, inputPath);
  const absoluteOutputPath = path.join(PROJECT_ROOT, outputPath);
  const inputExtension = path.extname(inputPath).toLowerCase();
  const normalizedOutputPath = toPublicRelativePath(absoluteOutputPath);
  const inputMetadata = await sharp(absoluteInputPath, { animated: false }).metadata();
  const originalWidth = inputMetadata.width ?? 0;
  const managedOutputSpecs = buildManagedOutputSpecs({
    absoluteInputPath,
    absoluteOutputPath,
    inputExtension,
    originalWidth,
    profile,
  });
  const expectedRelativePaths = new Set([
    normalizedOutputPath,
    ...managedOutputSpecs.map(({ outputPath: candidateOutputPath }) => toPublicRelativePath(candidateOutputPath)),
  ]);
  const generatedFiles = [];

  const originalAsset = await ensureOriginalAsset(absoluteInputPath, absoluteOutputPath, inputExtension);

  if (originalAsset.created && originalAsset.path !== normalizedOutputPath) {
    generatedFiles.push(originalAsset.path);
  }

  for (const spec of managedOutputSpecs) {
    const encodedAsset = await ensureEncodedAsset(spec);

    if (encodedAsset.created && encodedAsset.path !== normalizedOutputPath) {
      generatedFiles.push(encodedAsset.path);
    }
  }

  const removedFiles = await removeObsoleteVariants({
    absoluteOutputPath,
    expectedRelativePaths,
  });

  return {
    generatedFiles: [...new Set(generatedFiles)],
    removedFiles,
  };
}

async function collectManagedInputs() {
  const mappings = await resolveSourceMappings();
  const discoveredFiles = (
    await Promise.all(
      mappings.map(async ({ inputDir, outputDir }) => {
        const files = await collectImageFiles(inputDir);

        return files.map((inputPath) => ({
          inputPath,
          outputPath: path.join(outputDir, path.relative(inputDir, inputPath)),
          profile: STANDARD_ASSET_PROFILE,
        }));
      })
    )
  ).flat();
  const targetFiles = [];

  for (const targetFile of TARGET_INPUT_FILES) {
    if (await pathExists(targetFile.inputPath)) {
      targetFiles.push(targetFile);
    }
  }

  return [...discoveredFiles, ...targetFiles].sort((left, right) => left.outputPath.localeCompare(right.outputPath));
}

export async function runImageVariantGeneration() {
  const relativeInputPaths = await collectManagedInputs();
  const generatedFiles = [];
  const removedFiles = [];

  for (const relativeInputPath of relativeInputPaths) {
    const result = await ensureVariantsForFile(relativeInputPath);
    generatedFiles.push(...result.generatedFiles);
    removedFiles.push(...result.removedFiles);
  }

  if (generatedFiles.length === 0 && removedFiles.length === 0) {
    console.log('No asset changes were required.');
    return;
  }

  if (generatedFiles.length > 0) {
    console.log(`Generated ${generatedFiles.length} responsive files:`);
    for (const generatedFile of [...new Set(generatedFiles)].sort()) {
      console.log(generatedFile);
    }
  }

  if (removedFiles.length > 0) {
    console.log(`Removed ${removedFiles.length} obsolete files:`);
    for (const removedFile of [...new Set(removedFiles)].sort()) {
      console.log(removedFile);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runImageVariantGeneration().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
