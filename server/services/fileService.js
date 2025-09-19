// server/services/fileService.js
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Saves generated files locally and returns their public-facing URLs.
 * @param {string} projectId - The ID of the project to create a unique folder.
 * @param {object} files - An object containing file data, e.g., { logoSvg: '...', htmlContent: '...' }.
 * @returns {Promise<object>} - A promise that resolves to an object with the public URLs of the saved files.
 */
export async function saveFilesLocally(projectId, files) {
  // Create a dedicated directory for this project's assets
  const projectDir = path.join(__dirname, '..', 'public', 'uploads', projectId.toString());
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // 1. Save the SVG logo
  const logoFileName = 'logo.svg';
  const logoPath = path.join(projectDir, logoFileName);
  fs.writeFileSync(logoPath, files.logoSvg);
  const logoUrl = `/uploads/${projectId}/${logoFileName}`;

  // 2. Create and save the website zip
  const zipFileName = 'website.zip';
  const zipPath = path.join(projectDir, zipFileName);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Zip file created: ${archive.pointer()} total bytes`);
      const zipUrl = `/uploads/${projectId}/${zipFileName}`;
      resolve({ logoUrl, zipUrl });
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.append(files.htmlContent, { name: 'index.html' });
    archive.finalize();
  });
}

