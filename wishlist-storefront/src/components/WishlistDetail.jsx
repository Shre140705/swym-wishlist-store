import { useWishlists } from '../context/WishlistContext.jsx'

export default function WishlistDetail({ wishlist, productsById, onDelete }) {
  const { removeProduct } = useWishlists()

  return (
    <div className="wishlist-detail">
      <div className="wishlist-detail__header">
        <h3>{wishlist.wishlistName}</h3>
        <button
          type="button"
          className="btn btn--ghost btn--small btn--danger"
          onClick={() => onDelete(wishlist.wishlistId)}
        >
          Delete
        </button>
      </div>

      {wishlist.items.length === 0 ? (
        <p className="empty-state empty-state--inline">
          No items yet. Add products from the storefront to see them here.
        </p>
      ) : (
        <ul className="wishlist-detail__items">
          {wishlist.items.map((productId) => {
            const product = productsById.get(productId)
            if (!product) {
              // Defensive: product id persisted but no longer in catalog.
              return null
            }
            return (
              <li key={productId} className="wishlist-item">
                <img src={product.image} alt={product.title} />
                <div className="wishlist-item__info">
                  <span className="wishlist-item__title">{product.title}</span>
                  <span className="wishlist-item__price">${product.price.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => removeProduct(wishlist.wishlistId, productId)}
                  aria-label={`Remove ${product.title} from ${wishlist.wishlistName}`}
                >
                  Remove
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
