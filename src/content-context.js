/** Bound overlays: comments / reactions scoped to a contentId */

const COMMENT_KEY = 'ma-ville-comment-ctx'
const REACT_KEY = 'ma-ville-react-ctx'

export function setCommentContext(ctx) {
  try {
    sessionStorage.setItem(COMMENT_KEY, JSON.stringify(ctx))
  } catch {
    /* ignore */
  }
}

export function getCommentContext() {
  try {
    const raw = sessionStorage.getItem(COMMENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearCommentContext() {
  try {
    sessionStorage.removeItem(COMMENT_KEY)
  } catch {
    /* ignore */
  }
}

export function setReactContext(ctx) {
  try {
    sessionStorage.setItem(REACT_KEY, JSON.stringify(ctx))
  } catch {
    /* ignore */
  }
}

export function getReactContext() {
  try {
    const raw = sessionStorage.getItem(REACT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearReactContext() {
  try {
    sessionStorage.removeItem(REACT_KEY)
  } catch {
    /* ignore */
  }
}
