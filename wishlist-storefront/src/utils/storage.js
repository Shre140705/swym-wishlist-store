// Thin wrapper around LocalStorage for wishlist persistence.
// Products are static and shipped in code, so only wishlists are persisted.

const WISHLISTS_KEY = 'wishlist-storefront:wishlists'

/**
 * Read wishlists from LocalStorage.
 * Returns an empty array if nothing is stored yet, or if the stored
 * value is corrupted / not valid JSON (fails safe rather than throwing).
 */
export function loadWishlists() {
  try {
    const raw = window.localStorage.getItem(WISHLISTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (err) {
    console.error('Failed to load wishlists from LocalStorage:', err)
    return []
  }
}

/**
 * Persist the full wishlists array to LocalStorage.
 * Called after every mutation so a browser refresh never loses data.
 */
export function saveWishlists(wishlists) {
  try {
    window.localStorage.setItem(WISHLISTS_KEY, JSON.stringify(wishlists))
  } catch (err) {
    console.error('Failed to save wishlists to LocalStorage:', err)
  }
}

export function generateId(prefix = 'w') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
