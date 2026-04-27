import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const linkClass = ({ isActive }) =>
    'nav-link' + (isActive ? ' nav-link--active' : '');

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand-group">
          <Link to="/" className="brand" aria-label="ClickKart home">
            <span className="brand__mark">CK</span>
            <span className="brand__name">
              Click<span className="brand__name--accent">Kart</span>
            </span>
          </Link>
          <span className="roll-badge" aria-label="Roll Number 24071A05K3">
            <span className="roll-badge__label">Roll No</span>
            <span className="roll-badge__value">24071A05K3</span>
          </span>
        </div>

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          <NavLink to="/cart" className={linkClass}>
            <span className="nav-link__cart">
              <span aria-hidden="true">🛒</span>
              <span>Cart</span>
              {count > 0 && (
                <span className="cart-badge" aria-label={`${count} items in cart`}>
                  {count}
                </span>
              )}
            </span>
          </NavLink>
          <NavLink to="/checkout" className={linkClass}>Checkout</NavLink>
          {user ? (
            <button type="button" className="nav-link nav-link--button" onClick={handleLogout}>
              Hi, {user.name.split(' ')[0]} · Logout
            </button>
          ) : (
            <NavLink to="/login" className={linkClass}>Login</NavLink>
          )}
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
