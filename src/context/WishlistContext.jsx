import { createContext, useContext, useEffect, useReducer } from 'react'
import { loadWishlists, saveWishlists, generateId } from '../utils/storage.js'

const WishlistContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_WISHLIST': {
      const name = action.name.trim()
      if (!name) return state
      const newWishlist = {
        wishlistId: action.wishlistId,
        wishlistName: name,
        items: [],
      }
      return [...state, newWishlist]
    }

    case 'DELETE_WISHLIST': {
      return state.filter((w) => w.wishlistId !== action.wishlistId)
    }

    case 'ADD_PRODUCT': {
      return state.map((w) => {
        if (w.wishlistId !== action.wishlistId) return w
        // Duplicate guard: never insert a product id already present.
        if (w.items.includes(action.productId)) return w
        return { ...w, items: [...w.items, action.productId] }
      })
    }

    case 'REMOVE_PRODUCT': {
      return state.map((w) => {
        if (w.wishlistId !== action.wishlistId) return w
        return { ...w, items: w.items.filter((id) => id !== action.productId) }
      })
    }

    case 'MERGE_WISHLISTS': {
      const { sourceIdA, sourceIdB, newName } = action
      // Guard: merging a wishlist with itself is a no-op.
      if (sourceIdA === sourceIdB) return state

      const a = state.find((w) => w.wishlistId === sourceIdA)
      const b = state.find((w) => w.wishlistId === sourceIdB)
      if (!a || !b) return state

      // Union with de-duplication via Set — this is where "duplicate
      // products across two wishlists" gets collapsed to one entry.
      const mergedItems = [...new Set([...a.items, ...b.items])]

      const merged = {
        wishlistId: generateId('wl'),
        wishlistName: newName?.trim() || `${a.wishlistName} + ${b.wishlistName}`,
        items: mergedItems,
      }

      // Both source wishlists remain untouched in state — merge is
      // additive, it appends a new wishlist rather than mutating.
      return [...state, merged]
    }

    case 'LOAD': {
      return action.wishlists
    }

    default:
      return state
  }
}

export function WishlistProvider({ children }) {
  const [wishlists, dispatch] = useReducer(reducer, [], loadWishlists)

  // Persist on every change. Runs after LOAD too, which is harmless
  // (writes back the same data it just read).
  useEffect(() => {
    saveWishlists(wishlists)
  }, [wishlists])

  const api = {
    wishlists,
    createWishlist: (name) => {
      const trimmed = name.trim()
      if (!trimmed) return null
      const wishlistId = generateId('wl')
      dispatch({ type: 'CREATE_WISHLIST', name: trimmed, wishlistId })
      return wishlistId
    },
    deleteWishlist: (wishlistId) => dispatch({ type: 'DELETE_WISHLIST', wishlistId }),
    addProduct: (wishlistId, productId) => dispatch({ type: 'ADD_PRODUCT', wishlistId, productId }),
    removeProduct: (wishlistId, productId) => dispatch({ type: 'REMOVE_PRODUCT', wishlistId, productId }),
    mergeWishlists: (sourceIdA, sourceIdB, newName) =>
      dispatch({ type: 'MERGE_WISHLISTS', sourceIdA, sourceIdB, newName }),
  }

  return <WishlistContext.Provider value={api}>{children}</WishlistContext.Provider>
}

export function useWishlists() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlists must be used within a WishlistProvider')
  return ctx
}
