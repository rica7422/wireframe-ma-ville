/** Simulation hors téléphone — droits dans le phone seulement */

export const ROLE_HABITANT = 'habitant'
export const ROLE_ADMIN_KAPAN = 'admin-kapan'

const STORAGE_KEY = 'ma-ville-sim-role'

export function getRole() {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY)
    if (v === ROLE_ADMIN_KAPAN || v === ROLE_HABITANT) return v
  } catch {
    /* ignore */
  }
  return ROLE_HABITANT
}

export function setRole(role) {
  const next = role === ROLE_ADMIN_KAPAN ? ROLE_ADMIN_KAPAN : ROLE_HABITANT
  try {
    sessionStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* ignore */
  }
  return next
}

export function isAdminRole(role = getRole()) {
  return role === ROLE_ADMIN_KAPAN
}

export function roleLabel(role = getRole()) {
  return isAdminRole(role) ? 'Administrateur de Kapan' : 'Habitant'
}
