import { useState } from 'react'
import { useWishlists } from '../context/WishlistContext.jsx'

function HeartIcon({ filled }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  )
}

export default function ProductCard({ product }) {
  const { wishlists, addProduct, createWishlist } = useWishlists()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [newListName, setNewListName] = useState('')

  const memberOf = wishlists.filter((w) => w.items.includes(product.id))
  const isSaved = memberOf.length > 0

  function handleAdd(wishlistId) {
    addProduct(wishlistId, product.id)
    setPickerOpen(false)
  }

  function handleCreateAndAdd(e) {
    e.preventDefault()
    const name = newListName.trim()
    if (!name) return
    const newId = createWishlist(name)
    if (newId) addProduct(newId, product.id)
    setNewListName('')
    setPickerOpen(false)
  }

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.image} alt={product.title} loading="lazy" />
        <span className="product-card__category">{product.category}</span>

        <div className="product-card__heart-wrap">
          <button
            type="button"
            className={`heart-btn${isSaved ? ' heart-btn--active' : ''}`}
            onClick={() => setPickerOpen((v) => !v)}
            aria-expanded={pickerOpen}
            aria-label={isSaved ? `Saved to ${memberOf.length} wishlist(s)` : 'Add to wishlist'}
            title={isSaved ? `Saved to ${memberOf.length} wishlist(s)` : 'Add to wishlist'}
          >
            <HeartIcon filled={isSaved} />
          </button>

          {pickerOpen && (
            <div className="picker picker--from-heart">
              {wishlists.length === 0 && (
                <p className="picker__empty">No wishlists yet — create one below.</p>
              )}
              {wishlists.map((w) => {
                const already = w.items.includes(product.id)
                return (
                  <button
                    key={w.wishlistId}
                    type="button"
                    className="picker__option"
                    disabled={already}
                    onClick={() => handleAdd(w.wishlistId)}
                  >
                    {w.wishlistName} {already && <span className="picker__check">✓ added</span>}
                  </button>
                )
              })}
              <form className="picker__new" onSubmit={handleCreateAndAdd}>
                <input
                  type="text"
                  placeholder="New wishlist name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <button type="submit" className="btn btn--ghost btn--small">
                  Create
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__footer">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          {isSaved && (
            <span className="product-card__saved-note">
              In {memberOf.length} wishlist{memberOf.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
