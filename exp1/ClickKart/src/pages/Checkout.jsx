import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { calcDiscount, formatINR } from '../utils/discount.js';
import { submitOrder } from '../utils/servletApi.js';

const PAYMENT_METHODS = [
  'UPI',
  'Credit/Debit Card',
  'Net Banking',
  'Cash on Delivery',
];

const TIERS = [
  { range: '₹500 – ₹1,999', discount: '5%' },
  { range: '₹2,000 – ₹4,999', discount: '10%' },
  { range: '₹5,000 – ₹9,999', discount: '15%' },
  { range: '₹10,000+', discount: '20%' },
];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    pin: '',
    phone: '',
    payment: 'UPI',
  });
  const [placed, setPlaced] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const discount = calcDiscount(subtotal);
  const discountAmount = Math.round((subtotal * discount.pct) / 100);
  const finalTotal = subtotal - discountAmount;

  useEffect(() => {
    if (items.length === 0 && !placed) {
      const timer = window.setTimeout(() => navigate('/products'), 2200);
      return () => window.clearTimeout(timer);
    }
  }, [items.length, placed, navigate]);

  useEffect(() => {
    if (!placed) return;
    const timer = window.setTimeout(() => {
      clearCart();
      navigate('/');
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [placed, clearCart, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setSubmitting(true);
    setServerError(null);
    setServerInfo(null);

    // Talk to the Java Servlet backend (exp2) running on Tomcat.
    const result = await submitOrder({
      name: form.fullName || 'Guest',
      email: form.phone ? `${form.phone}@clickkart.local` : 'guest@clickkart.local',
      totalAmount: finalTotal,
    });

    if (result.ok && result.data && result.data.status === 'success') {
      setServerInfo(result.data);
    } else {
      setServerError(
        'Tomcat servlet (exp2) is not reachable on http://localhost:8080. ' +
          'Order will be confirmed locally only.'
      );
    }

    setSubmitting(false);
    setPlaced(true);
  }

  if (placed) {
    return (
      <div className="page">
        <section className="success">
          <div className="success__art" aria-hidden="true">✓</div>
          <h1 className="success__title">Order Placed Successfully!</h1>
          <p className="success__text">
            Thanks {form.fullName || 'shopper'} — your order of {formatINR(finalTotal)} via{' '}
            <strong>{form.payment}</strong> has been confirmed.
          </p>

          {serverInfo && (
            <div
              className="panel"
              style={{
                marginTop: '1.5rem',
                padding: '1rem 1.25rem',
                textAlign: 'left',
                maxWidth: 520,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <strong>Servlet response (exp2):</strong>
              <ul style={{ margin: '.5rem 0 0', paddingLeft: '1.1rem', fontSize: '.9rem' }}>
                <li>{serverInfo.message}</li>
                <li>Original: {formatINR(serverInfo.originalAmount)}</li>
                <li>
                  Discount: {serverInfo.discountPercent}% (− {formatINR(serverInfo.discountAmount)})
                </li>
                <li>Final: {formatINR(serverInfo.finalAmount)}</li>
                <li>
                  Project: {serverInfo.project} · Roll No: {serverInfo.rollNo}
                </li>
              </ul>
            </div>
          )}

          {serverError && (
            <p
              className="success__hint"
              style={{ color: '#991b1b', fontWeight: 600, marginTop: '1rem' }}
            >
              {serverError}
            </p>
          )}

          <p className="success__hint">Redirecting to home in a moment…</p>
        </section>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <section className="empty">
          <div className="empty__art" aria-hidden="true">🧺</div>
          <h1 className="empty__title">Nothing to checkout yet</h1>
          <p className="empty__text">Your cart is empty — taking you to the catalog.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page__head">
        <span className="hero__eyebrow">Almost there</span>
        <h1 className="page__title">Checkout</h1>
        <p className="page__subtitle">
          Confirm your details below — your tier-based discount has already been applied.
        </p>
      </section>

      <section className="checkout-layout">
        <form className="panel" onSubmit={handlePlaceOrder} noValidate>
          <h2 className="panel__title">Shipping Details</h2>
          <div className="field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              required
              placeholder="Jane Doe"
            />
          </div>
          <div className="field">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows="3"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="House no, street, locality"
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="Hyderabad"
              />
            </div>
            <div className="field">
              <label htmlFor="pin">PIN Code</label>
              <input
                id="pin"
                name="pin"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                value={form.pin}
                onChange={handleChange}
                required
                placeholder="500001"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="+91 98765 43210"
            />
          </div>

          <h2 className="panel__title panel__title--mt">Payment Method</h2>
          <div className="field">
            <label htmlFor="payment">Choose a payment option</label>
            <select
              id="payment"
              name="payment"
              value={form.payment}
              onChange={handleChange}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--lg panel__cta"
            disabled={submitting}
          >
            {submitting
              ? 'Contacting Servlet…'
              : `Place Order · ${formatINR(finalTotal)}`}
          </button>
        </form>

        <aside className="panel summary" aria-label="Order summary">
          <h2 className="panel__title">Order Summary</h2>
          <ul className="summary__items">
            {items.map((item) => (
              <li key={item.id} className="summary__item">
                <span className="summary__item-emoji" aria-hidden="true">{item.emoji}</span>
                <span className="summary__item-name">
                  {item.name}
                  <small> × {item.qty}</small>
                </span>
                <span className="summary__item-total">
                  {formatINR(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="summary__divider" />
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

          <h3 className="panel__subtitle">Discount Tiers</h3>
          <table className="tiers">
            <thead>
              <tr>
                <th>Purchase Range</th>
                <th>Discount</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((t) => (
                <tr key={t.range}>
                  <td>{t.range}</td>
                  <td>{t.discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </section>
    </div>
  );
}
