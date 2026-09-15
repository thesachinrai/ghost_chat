/**
 * End-to-End Encryption utilities using Web Crypto API
 * Uses AES-GCM with key derived from passcode via PBKDF2
 */

// Convert string to Uint8Array
function stringToBuffer(str: string): any {
  return new TextEncoder().encode(str)
}

// Convert ArrayBuffer to base64 string
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Convert base64 string to ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  // Important: return the underlying buffer, not the view
  return bytes.buffer
}

/**
 * Derive an AES-GCM key from passcode and roomId (as salt)
 */
export async function deriveKey(passcode: string, roomId: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    stringToBuffer(passcode),
    "PBKDF2",
    false,
    ["deriveKey"]
  )

  // Derive AES key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: stringToBuffer(roomId),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )
}

/**
 * Encrypt a message using AES-GCM
 * Returns base64 encoded string: iv:ciphertext
 */
export async function encryptMessage(plaintext: string, key: CryptoKey): Promise<string> {
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Encrypt
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    stringToBuffer(plaintext)
  )

  // Return as base64: iv:ciphertext
  return `${bufferToBase64(iv.buffer)}:${bufferToBase64(ciphertext)}`
}

/**
 * Decrypt a message using AES-GCM
 * Expects base64 encoded string: iv:ciphertext
 */
export async function decryptMessage(encrypted: string, key: CryptoKey): Promise<string> {
  try {
    const [ivBase64, ciphertextBase64] = encrypted.split(":")
    if (!ivBase64 || !ciphertextBase64) {
      throw new Error("Invalid encrypted format")
    }

    const iv = base64ToBuffer(ivBase64)
    const ciphertext = base64ToBuffer(ciphertextBase64)

    // Decrypt
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    )

    return new TextDecoder().decode(plaintext)
  } catch {
    // Return original if decryption fails (for backwards compatibility with unencrypted messages)
    return encrypted
  }
}
