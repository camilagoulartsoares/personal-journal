export function savePassword(password: string) {
  localStorage.setItem('diary-password', password)
}

export function getSavedPassword() {
  return localStorage.getItem('diary-password')
}

export function isAuthenticated(password: string) {
  return password === getSavedPassword()
}

export function logout() {
  localStorage.removeItem('diary-password')
}
