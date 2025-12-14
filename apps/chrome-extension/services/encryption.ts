// Encryption Service using Web Crypto API (AES-GCM)

const ALGORITHM = 'AES-GCM';
const KEY_STORAGE_KEY = 'encryption_key_jwk';

// Helper to get or create a master key
async function getMasterKey(): Promise<CryptoKey> {
  const stored = await chrome.storage.local.get(KEY_STORAGE_KEY);
  if (stored[KEY_STORAGE_KEY]) {
    // Import valid JWK
    return crypto.subtle.importKey(
      'jwk',
      stored[KEY_STORAGE_KEY],
      { name: ALGORITHM },
      false, // not extractable
      ['encrypt', 'decrypt']
    );
  }

  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: ALGORITHM, length: 256 },
    true, // extractable for storage
    ['encrypt', 'decrypt']
  );

  // Export and store
  const jwk = await crypto.subtle.exportKey('jwk', key);
  await chrome.storage.local.set({ [KEY_STORAGE_KEY]: jwk });
  
  // Re-import as non-extractable (best practice for usage, though we just extracted it)
  // Actually, we can just return the generated key.
  return key;
}

export async function encrypt(data: string): Promise<string> {
  const key = await getMasterKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const encodedData = new TextEncoder().encode(data);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encodedData
  );

  // Combine IV and Ciphertext for storage: IV + Ciphertext
  // We'll base64 encode the final result
  const combined = new Uint8Array(iv.length + new Uint8Array(encryptedBuffer).length);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decrypt(encryptedBase64: string): Promise<string | null> {
  try {
    const key = await getMasterKey();
    
    // Decode base64
    const binaryString = atob(encryptedBase64);
    const combined = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      combined[i] = binaryString.charCodeAt(i);
    }

    // Extract IV and Ciphertext
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}
