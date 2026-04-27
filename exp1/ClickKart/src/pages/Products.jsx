import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS } from '../data/products.js';

export default function Products() {
  return (
    <div className="page">
      <section className="page__head">
        <span className="hero__eyebrow">All products</span>
        <h1 className="page__title">The ClickKart Collection</h1>
        <p className="page__subtitle">
          {PRODUCTS.length} curated products — every one of them comes with a transparent
          discount and free delivery on orders above ₹999.
        </p>
      </section>

      <section className="section">
        <div className="grid">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
