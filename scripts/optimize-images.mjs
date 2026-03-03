import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, '../public/images/menu');

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const entries = await readdir(inputDir);
  const pngs = entries.filter((f) => f.toLowerCase().endsWith('.png'));

  if (pngs.length === 0) {
    process.stdout.write('No PNG files found.\n');
    return;
  }

  for (const file of pngs) {
    const inputPath = path.join(inputDir, file);
    const base = file.replace(/\.png$/i, '');
    const webpPath = path.join(inputDir, `${base}.webp`);
    const avifPath = path.join(inputDir, `${base}.avif`);

    const webpExists = await fileExists(webpPath);
    const avifExists = await fileExists(avifPath);

    process.stdout.write(`Processing ${path.relative(process.cwd(), inputPath)}\n`);

    try {
      if (!webpExists) {
        await sharp(inputPath)
          .webp({ quality: 72, effort: 5 })
          .toFile(webpPath);
        process.stdout.write(`Generated ${path.relative(process.cwd(), webpPath)}\n`);
      }

      if (!avifExists) {
        await sharp(inputPath)
          .avif({ quality: 55, effort: 5 })
          .toFile(avifPath);
        process.stdout.write(`Generated ${path.relative(process.cwd(), avifPath)}\n`);
      }
    } catch (err) {
      process.stderr.write(`Skipped ${file}: ${err?.message || err}\n`);
    }
  }
}

main().catch((err) => {
  process.stderr.write(`${err?.stack || err}\n`);
  process.exit(1);
});
