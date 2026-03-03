/**
 * Simple AES-256-GCM encryption for sensitive fields (e.g. meeting passwords).
 *
 * Uses the Web Crypto API (available in both Node.js and browsers).
 * The encryption key should come from an environment variable.
 *
 * Usage:
 *   const encrypted = await encrypt(plaintext)
 *   const decrypted = await decrypt(encrypted)
 */

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12 // 96 bits recommended for GCM
const TAG_LENGTH = 128

function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is required for encryption. ' +
      'Generate one with: openssl rand -base64 32'
    )
  }
  return key
}

async function deriveKey(keyString: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(keyString.padEnd(32, '0').slice(0, 32))
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt'],
  )
}

/**
 * Encrypt a plaintext string.
 * Returns a base64 string containing IV + ciphertext.
 */
export async function encrypt(plaintext: string): Promise<string> {
  const key = await deriveKey(getEncryptionKey())
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const encoder = new TextEncoder()
  const data = encoder.encode(plaintext)

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
    key,
    data,
  )

  // Combine IV + ciphertext into a single buffer
  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(ciphertext), iv.length)

  return btoa(String.fromCharCode(...combined))
}

/**
 * Decrypt a previously encrypted string.
 * Expects a base64 string containing IV + ciphertext.
 */
export async function decrypt(encrypted: string): Promise<string> {
  const key = await deriveKey(getEncryptionKey())
  const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0))

  const iv = combined.slice(0, IV_LENGTH)
  const ciphertext = combined.slice(IV_LENGTH)

  const plaintext = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
    key,
    ciphertext,
  )

  return new TextDecoder().decode(plaintext)
}
