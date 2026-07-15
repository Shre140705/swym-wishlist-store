import { useState, useMemo } from 'react'
import { useWishlists } from '../context/WishlistContext.jsx'
import { PRODUCTS } from '../data/products.js'
import CreateWishlistForm from './CreateWishlistForm.jsx'
import WishlistDetail from './WishlistDetail.jsx'
import MergeWishlistsModal from './MergeWishlistsModal.jsx'

export default function WishlistPanel() {
  const { wishlists, deleteWishlist } = useWishlists()
  const [mergeOpen, setMergeOpen] = useState(false)

  const productsById = useMemo(() => {
    return new Map(PRODUCTS.map((p) => [p.id, p]))
  }, [])

  function handleDelete(wishlistId) {
    const target = wishlists.find((w) => w.wishlistId === wishlistId)
    const confirmed = window.confirm(
      `Delete "${target?.wishlistName}"? This can't be undone.`
    )
    if (confirmed) deleteWishlist(wishlistId)
  }

  return (
    <aside className="wishlist-panel">
      <div className="wishlist-panel__header">
        <h2>Your wishlists</h2>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => setMergeOpen(true)}
          disabled={wishlists.length < 2}
        >
          Merge…
        </button>
      </div>

      <CreateWishlistForm />

      {wishlists.length === 0 ? (
        <p className="empty-state empty-state--inline">
          Create your first wishlist to start saving products.
        </p>
      ) : (
        <div className="wishlist-panel__list">
          {wishlists.map((w) => (
            <WishlistDetail
              key={w.wishlistId}
              wishlist={w}
              productsById={productsById}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {mergeOpen && <MergeWishlistsModal onClose={() => setMergeOpen(false)} />}
    </aside>
  )
}
