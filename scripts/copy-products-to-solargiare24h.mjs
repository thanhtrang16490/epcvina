import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const SRC = '/Users/thanhtrang/Documents/epcvina.com/epcvinasolar/src/content/products';
const DEST = '/Users/thanhtrang/Documents/epcvina.com/solargiare24h/src/content/products';

const CATEGORY_MAP = {
  'panel': 'panel',
  'on-grid-inverter': 'inverter',
  'hybrid-inverter': 'inverter',
  'lv-battery': 'battery',
  'hv-battery': 'battery',
  'mounting': 'accessories',
  'wiring': 'accessories',
  'cabinet': 'accessories',
};

async function copyProducts() {
  const categories = await readdir(SRC);
  let totalCopied = 0;

  for (const category of categories) {
    const srcDir = join(SRC, category);
    let files;
    try { files = await readdir(srcDir); } catch { continue; }
    const mdFiles = files.filter(f => f.endsWith('.md'));
    if (mdFiles.length === 0) continue;

    const mappedCategory = CATEGORY_MAP[category] || 'accessories';
    const destDir = join(DEST, mappedCategory);
    await mkdir(destDir, { recursive: true });

    for (const file of mdFiles) {
      const srcPath = join(srcDir, file);
      const destPath = join(destDir, file);
      const content = await readFile(srcPath, 'utf-8');
      
      // Replace category in frontmatter
      const updatedContent = content.replace(
        /^category:\s*["']?[^"'\n]+["']?/m,
        `category: "${mappedCategory}"`
      );
      await writeFile(destPath, updatedContent);
      totalCopied++;
    }
    console.log(`  ${category} -> ${mappedCategory}: ${mdFiles.length} files`);
  }
  console.log(`\nTotal: ${totalCopied} products copied`);
}

copyProducts().catch(console.error);
