/** Open ⋯ menu context — cleared on role switch */

const KEY = 'ma-ville-menu-ctx'

export function setMenuContext(ctx) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(ctx))
  } catch {
    /* ignore */
  }
}

export function getMenuContext() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearMenuContext() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
