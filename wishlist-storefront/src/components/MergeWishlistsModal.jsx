import { useState, useMemo } from 'react'
import { useWishlists } from '../context/WishlistContext.jsx'

export default function MergeWishlistsModal({ onClose }) {
  const { wishlists, mergeWishlists } = useWishlists()
  const [idA, setIdA] = useState('')
  const [idB, setIdB] = useState('')
  const [name, setName] = useState('')

  const wishlistA = wishlists.find((w) => w.wishlistId === idA)
  const wishlistB = wishlists.find((w) => w.wishlistId === idB)

  const isSamePick = idA && idB && idA === idB
  const canMerge = idA && idB && !isSamePick

  const previewCount = useMemo(() => {
    if (!wishlistA || !wishlistB) return null
    return new Set([...wishlistA.items, ...wishlistB.items]).size
  }, [wishlistA, wishlistB])

  function handleMerge() {
    if (!canMerge) return
    mergeWishlists(idA, idB, name)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Merge two wishlists</h3>
        <p className="modal__hint">
          Creates a new wishlist with items from both, duplicates removed. The two originals are
          left exactly as they are.
        </p>

        {wishlists.length < 2 ? (
          <p className="empty-state empty-state--inline">
            You need at least two wishlists to merge.
          </p>
        ) : (
          <>
            <div className="modal__row">
              <label>
                First wishlist
                <select value={idA} onChange={(e) => setIdA(e.target.value)}>
                  <option value="">Select…</option>
                  {wishlists.map((w) => (
                    <option key={w.wishlistId} value={w.wishlistId}>
                      {w.wishlistName} ({w.items.length})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Second wishlist
                <select value={idB} onChange={(e) => setIdB(e.target.value)}>
                  <option value="">Select…</option>
                  {wishlists.map((w) => (
                    <option key={w.wishlistId} value={w.wishlistId}>
                      {w.wishlistName} ({w.items.length})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {isSamePick && (
              <p className="modal__warning">
                Pick two different wishlists — merging one with itself has nothing to add.
              </p>
            )}

            {canMerge && (
              <>
                <label className="modal__name-field">
                  New wishlist name
                  <input
                    type="text"
                    placeholder={`${wishlistA?.wishlistName} + ${wishlistB?.wishlistName}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <p className="modal__preview">
                  Result will have <strong>{previewCount}</strong> item{previewCount === 1 ? '' : 's'}.
                </p>
              </>
            )}

            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn--accent" disabled={!canMerge} onClick={handleMerge}>
                Merge
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
