import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Saves the generated website HTML into a zip file and returns its public URL.
 * @param {string} projectId - The ID of the project to create a unique folder.
 * @param {object} files - An object containing file data, e.g., { htmlContent: '...' }.
 * @returns {Promise<object>} - A promise that resolves to an object with the public URL of the zip file.
 */
export async function saveFilesLocally(projectId, files) {
  // Create a dedicated directory for this project's assets
  const projectDir = path.join(__dirname, '..', 'public', 'uploads', projectId.toString());
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // --- FIX #1: REMOVED ALL LOGIC FOR SAVING AN SVG FILE ---
  // This function no longer handles logos, as they are remote URLs.
  // This prevents the "Received undefined" crash.

  // Create and save the website zip
  const zipFileName = 'website.zip';
  const zipPath = path.join(projectDir, zipFileName);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Zip file created: ${archive.pointer()} total bytes`);
      const zipUrl = `/uploads/${projectId}/${zipFileName}`;
      
      // --- FIX #2: Only return the zipUrl ---
      // This function no longer creates a local logoUrl to return.
      resolve({ zipUrl });
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    
    // Add the generated HTML to the zip file.
    archive.append(files.htmlContent, { name: 'index.html' });
    
    archive.finalize();
  });
}