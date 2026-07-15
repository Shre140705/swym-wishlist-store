import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return <p className="empty-state">No products to show.</p>
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
