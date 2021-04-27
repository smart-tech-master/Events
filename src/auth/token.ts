type AuthToken = string

export function getToken(key: string): AuthToken | null {
  return window.localStorage.getItem(key)
}

export function saveToken(key: string, token: string) {
  return window.localStorage.setItem(key, token)
}

export function deleteToken(key: string) {
  return window.localStorage.removeItem(key)
}
