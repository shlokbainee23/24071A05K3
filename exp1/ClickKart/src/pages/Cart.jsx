import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { calcDiscount, formatINR } from '../utils/discount.js';

export default function Cart() {
  const { items, subtotal, increment, decrement, removeFromCart } = useCart();
  const navigate = useNavigate();

  const discount = calcDiscount(subtotal);
  const discountAmount = Math.round((subtotal * discount.pct) / 100);
  const finalTotal = subtotal - discountAmount;

  if (items.length === 0) {
    return (
      <div className="page">
        <section className="empty">
          <div className="empty__art" aria-hidden="true">🛍️</div>
          <h1 className="empty__title">Your cart is feeling light</h1>
          <p className="empty__text">
            Looks like you haven't added anything yet. Let's fix that.
          </p>
          <Link to="/products" className="btn btn--primary btn--lg">Browse Products</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page__head">
        <span className="hero__eyebrow">Your bag</span>
        <h1 className="page__title">Shopping Cart</h1>
        <p className="page__subtitle">
          Review your selection — quantities and discounts update in real time.
        </p>
      </section>

      <section className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <article key={item.id} className="cart-row">
              <div className="cart-row__media" aria-hidden="true">{item.emoji}</div>
              <div className="cart-row__info">
                <h3 className="cart-row__title">{item.name}</h3>
                <p className="cart-row__price">{formatINR(item.price)} each</p>
              </div>
              <div className="qty">
                <button
                  type="button"
                  className="qty__btn"
                  onClick={() => decrement(item.id)}
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  −
                </button>
                <span className="qty__value" aria-live="polite">{item.qty}</span>
                <button
                  type="button"
                  className="qty__btn"
                  onClick={() => increment(item.id)}
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
              <div className="cart-row__total">{formatINR(item.price * item.qty)}</div>
              <button
                type="button"
                className="cart-row__remove"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                Remove
              </button>
            </article>
          ))}
        </div>

        <aside className="summary" aria-label="Order summary">
          <h2 className="summary__title">Order Summary</h2>
          <div className="summary__row">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="summary__row">
            <span>
              Discount
              <span className={'tier-pill ' + (discount.pct ? 'tier-pill--active' : '')}>
                {discount.label}
              </span>
            </span>
            <span className="summary__discount">
              {discount.pct ? `− ${formatINR(discountAmount)}` : '—'}
            </span>
          </div>
          <div className="summary__divider" />
          <div className="summary__row summary__row--total">
            <span>Final Total</span>
            <span>{formatINR(finalTotal)}</span>
          </div>
          <button
            type="button"
            className="btn btn--primary btn--lg summary__cta"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <Link to="/products" className="summary__back">← Continue shopping</Link>
        </aside>
      </section>
    </div>
  );
}
