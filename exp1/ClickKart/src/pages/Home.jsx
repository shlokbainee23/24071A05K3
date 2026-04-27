import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS } from '../data/products.js';

export default function Home() {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <span className="hero__eyebrow">Curated · Crafted · Delivered</span>
            <h1 className="hero__title">
              Shop Smarter with <span className="text-gold">ClickKart</span>
            </h1>
            <p className="hero__subtext">
              Discover hand-picked everyday essentials with tier-based discounts that
              reward bigger carts. From audio gear to lifestyle picks — refined taste,
              honest prices.
            </p>
            <div className="hero__cta">
              <Link to="/products" className="btn btn--primary btn--lg">
                Shop the Collection
              </Link>
              <Link to="/contact" className="btn btn--ghost btn--lg">
                Talk to us
              </Link>
            </div>
            <ul className="hero__perks" aria-label="Shopping perks">
              <li><span className="dot" /> Free delivery over ₹999</li>
              <li><span className="dot" /> Up to 20% loyalty discount</li>
              <li><span className="dot" /> 7-day easy returns</li>
            </ul>
          </div>
          <div className="hero__art" aria-hidden="true">
            <div className="hero__tile hero__tile--1">🎧</div>
            <div className="hero__tile hero__tile--2">⌚</div>
            <div className="hero__tile hero__tile--3">👟</div>
            <div className="hero__tile hero__tile--4">☕</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">Featured Products</h2>
            <p className="section__subtitle">A peek into our most-loved picks this week.</p>
          </div>
          <Link to="/products" className="section__link">View all →</Link>
        </div>
        <div className="grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="section banner">
        <div className="banner__inner">
          <h2 className="banner__title">The more you cart, the more you save</h2>
          <p className="banner__text">
            Spend ₹500 to unlock 5% off · ₹2,000 for 10% · ₹5,000 for 15% · ₹10,000+ unlocks
            our Premium tier with a flat 20% discount applied automatically at checkout.
          </p>
          <Link to="/products" className="btn btn--primary">Start Saving</Link>
        </div>
      </section>
    </div>
  );
}
