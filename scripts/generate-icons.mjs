import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = join(__dirname, '../public/logo.svg');
const outputDir = join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('📱 Generating PWA icons...\n');

  const svgBuffer = readFileSync(inputSvg);

  for (const size of sizes) {
    const outputPath = join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 106, b: 78, alpha: 1 } // Primary color background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`❌ Failed to generate ${size}x${size} icon:`, error.message);
    }
  }

  console.log('\n✨ Icon generation complete!');
}

generateIcons().catch(console.error);
