export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function savePassword(password: string) {
  const hashed = await hashPassword(password)
  localStorage.setItem('diary-password', hashed)
}

export function getSavedPassword() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('diary-password')
  }
  return null
}

export async function isAuthenticated(password: string): Promise<boolean> {
  const hashed = await hashPassword(password)
  const stored = getSavedPassword()
  return hashed === stored
}

export function logout() {
  localStorage.removeItem('diary-password')
}
