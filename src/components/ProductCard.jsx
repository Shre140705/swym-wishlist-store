import { useState } from 'react'
import { useWishlists } from '../context/WishlistContext.jsx'

export default function ProductCard({ product }) {
  const { wishlists, addProduct, createWishlist } = useWishlists()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [newListName, setNewListName] = useState('')

  const memberOf = wishlists.filter((w) => w.items.includes(product.id))

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
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__footer">
          <span className="product-card__price">${product.price.toFixed(2)}</span>

          <div className="product-card__add">
            <button
              type="button"
              className="btn btn--accent"
              onClick={() => setPickerOpen((v) => !v)}
              aria-expanded={pickerOpen}
            >
              {memberOf.length > 0 ? `Saved (${memberOf.length})` : 'Add to wishlist'}
            </button>

            {pickerOpen && (
              <div className="picker">
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
      </div>
    </article>
  )
}
