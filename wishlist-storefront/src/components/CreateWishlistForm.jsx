import { useState } from 'react'
import { useWishlists } from '../context/WishlistContext.jsx'

export default function CreateWishlistForm() {
  const { createWishlist } = useWishlists()
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    createWishlist(trimmed)
    setName('')
  }

  return (
    <form className="create-wishlist-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name a new wishlist…"
        aria-label="New wishlist name"
      />
      <button type="submit" className="btn btn--accent" disabled={!name.trim()}>
        Create
      </button>
    </form>
  )
}
