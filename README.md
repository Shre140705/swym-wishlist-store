# Field & Found — Wishlist Storefront

A React + Vite storefront with multi-wishlist support, persisted to LocalStorage. No backend, no auth — matches the V1 spec agreed before build.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL. For a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  data/products.js            static Product[] catalog (read-only at runtime)
  utils/storage.js            LocalStorage read/write + id generator
  context/WishlistContext.jsx reducer + provider — single source of truth for wishlists
  components/
    ProductGrid.jsx           browse view
    ProductCard.jsx           single product, "add to wishlist" picker
    WishlistPanel.jsx         sidebar: create form, merge trigger, list of wishlists
    CreateWishlistForm.jsx    name input -> new wishlist
    WishlistDetail.jsx        one wishlist's items, remove/delete
    MergeWishlistsModal.jsx   pick two wishlists -> preview -> merge
  App.jsx / main.jsx / index.css
```

## Data model

```ts
Product   { id, title, price, category, image, description }
Wishlist  { wishlistId, wishlistName, items: Product['id'][] }
```

`items` stores product **IDs**, not embedded objects — this is what makes de-duplication a one-line `Set` operation and keeps LocalStorage lean.

## Feature → implementation map

| Feature | Where |
|---|---|
| Browse products | `ProductGrid` + `ProductCard`, reads static `PRODUCTS` |
| Create wishlist | `CreateWishlistForm`, also inline from the product picker |
| Add product | `ProductCard` picker → `ADD_PRODUCT` |
| Remove product | `WishlistDetail` → `REMOVE_PRODUCT` |
| Merge two wishlists | `MergeWishlistsModal` → `MERGE_WISHLISTS` |

## Edge cases — how each is handled

- **Empty wishlist** — `WishlistDetail` renders an explicit empty-state message instead of a blank list.
- **Merge same wishlist** — the modal disables the merge action and shows a warning the moment both dropdowns match; the reducer also no-ops on `sourceIdA === sourceIdB` as a second line of defense.
- **Duplicate products** — `ADD_PRODUCT` checks `items.includes(productId)` before inserting; the UI shows "✓ added" and disables that option. On merge, `[...new Set([...a.items, ...b.items])]` collapses overlaps.
- **Refresh browser** — wishlists are re-hydrated from LocalStorage via `useReducer`'s lazy-init (`loadWishlists`) on mount, and every mutation is written back in a `useEffect`. Products are static so they don't need persisting.
- **Delete after merge** — merge creates a brand-new wishlist object with its own `wishlistId` and a copied items array (not a reference). Deleting either source wishlist afterward has zero effect on the merged result, and vice versa.

## Known simplifications (V1 scope, per the agreed spec)

- No wishlist rename (delete + recreate covers it for now).
- No product search/filter/sort.
- No auth — all data is local to the browser it's created in.
- Product images are hotlinked from Unsplash; swap `src/data/products.js` for your own asset paths if you need it to work fully offline.
