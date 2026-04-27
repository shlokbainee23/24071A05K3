// ClickKart - Servlet API Bridge
// Links exp1 (React) -> exp2 (Tomcat Servlet)
// Roll No: 24071A05K3 | Project: ClickKart

const SERVLET_BASE = 'http://localhost:8080/exp2';

// Fetch discount from DiscountServlet
// Usage: const data = await fetchDiscount(3500)
export async function fetchDiscount(purchaseAmount) {
  try {
    const res = await fetch(
      `${SERVLET_BASE}/discount?purchaseAmount=${purchaseAmount}`
    );
    const text = await res.text();
    return { ok: true, html: text };
  } catch (err) {
    console.error('Servlet not reachable:', err);
    return { ok: false, html: null };
  }
}

// POST order to CheckoutServlet
// Usage: const result = await submitOrder({ name, email, totalAmount })
export async function submitOrder({ name, email, totalAmount }) {
  try {
    const body = new URLSearchParams({ name, email, totalAmount });
    const res = await fetch(`${SERVLET_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const json = await res.json();
    return { ok: true, data: json };
  } catch (err) {
    console.error('Servlet not reachable:', err);
    return { ok: false, data: null };
  }
}

// Build a direct URL to the Discount HTML view (for iframe/new-tab use)
export function discountPageUrl(purchaseAmount) {
  return `${SERVLET_BASE}/discount?purchaseAmount=${purchaseAmount}`;
}
