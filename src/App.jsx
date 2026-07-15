import { PRODUCTS } from './data/products.js'
import { WishlistProvider } from './context/WishlistContext.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import WishlistPanel from './components/WishlistPanel.jsx'

export default function App() {
  return (
    <WishlistProvider>
      <div className="app-shell">
        <header className="site-header">
          <div className="site-header__mark">FF</div>
          <div>
            <h1>Field &amp; Found</h1>
            <p>A small catalog. Save what you like, merge lists when plans combine.</p>
          </div>
        </header>

        <main className="layout">
          <section className="layout__catalog">
            <div className="section-heading">
              <span className="section-heading__eyebrow">Catalog</span>
              <h2>Browse products</h2>
            </div>
            <ProductGrid products={PRODUCTS} />
          </section>

          <WishlistPanel />
        </main>
      </div>
    </WishlistProvider>
  )
}
