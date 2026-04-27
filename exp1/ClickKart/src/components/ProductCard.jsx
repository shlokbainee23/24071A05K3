import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { formatINR } from '../utils/discount.js';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="card">
      <div className="card__media" aria-hidden="true">
        <span className="card__emoji">{product.emoji}</span>
        <span className="card__badge">{product.tag}</span>
      </div>
      <div className="card__body">
        <h3 className="card__title">{product.name}</h3>
        <div className="card__prices">
          <span className="card__price">{formatINR(product.price)}</span>
          <span className="card__original">{formatINR(product.original)}</span>
        </div>
        <button
          type="button"
          className={'btn btn--primary card__cta' + (added ? ' btn--success' : '')}
          onClick={handleAdd}
          disabled={added}
        >
          {added ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}
