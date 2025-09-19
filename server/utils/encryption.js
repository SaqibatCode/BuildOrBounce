import crypto from 'crypto-js';

// We create an async function to load the module.
async function loadCrypto() {
  if (!crypto) {
    // The dynamic import() is async and returns a promise
    const module = await import('crypto-js');
    crypto = module.default; // Access the default export
  }
}

// Make sure to set this in your .env file! It's your master encryption key.
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
if (!ENCRYPTION_SECRET) throw new Error("FATAL: ENCRYPTION_SECRET is not defined.");

// Encrypts text
export const encrypt = (text) => {
  if (!text) return null;
  // We don't need to await the load here, as it will be loaded when needed.
  return crypto.AES.encrypt(text, ENCRYPTION_SECRET).toString();
};

// Decrypts text
export const decrypt = (ciphertext) => {
  if (!ciphertext) return null;
  const bytes = crypto.AES.decrypt(ciphertext, ENCRYPTION_SECRET);
  return bytes.toString(crypto.enc.Utf8);
};

