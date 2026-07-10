// Simple browser-side encryption helpers to avoid storing sensitive values in clear text.
// This uses the Web Crypto API with a key derived via PBKDF2. In a more complete design,
// key management would be externalized, but we keep it local to this module.

const OAUTH_LOCAL_ENC_SALT = "oauth-state-salt";
const OAUTH_LOCAL_ENC_PASSWORD = "oauth-state-password";

async function deriveEncryptionKey () {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(OAUTH_LOCAL_ENC_PASSWORD),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(OAUTH_LOCAL_ENC_SALT),
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptValue (plainText) {
  if (plainText == null) {
    return plainText;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const key = await deriveEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  const combined = new Uint8Array(iv.byteLength + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.byteLength);
  return btoa(String.fromCharCode.apply(null, combined));
}

async function decryptValue (cipherText) {
  if (cipherText == null) {
    return cipherText;
  }
  const binary = atob(cipherText);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const iv = bytes.slice(0, 12);
  const data = bytes.slice(12);
  const key = await deriveEncryptionKey();
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  const decoder = new TextDecoder();
  return decoder.decode(plainBuffer);
}

export { encryptValue, decryptValue };