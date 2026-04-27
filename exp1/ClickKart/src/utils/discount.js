// Mirrors the Java Servlet discount calculation that runs on Apache Tomcat.
// Keep the tier values here in sync with DiscountServlet.java.
export function calcDiscount(subtotal) {
  if (subtotal >= 10000) return { pct: 20, label: 'Premium (₹10k+)' };
  if (subtotal >= 5000)  return { pct: 15, label: 'Gold (₹5k–₹9.9k)' };
  if (subtotal >= 2000)  return { pct: 10, label: 'Silver (₹2k–₹4.9k)' };
  if (subtotal >= 500)   return { pct: 5,  label: 'Basic (₹500–₹1.9k)' };
  return { pct: 0, label: 'No discount' };
}

export function formatINR(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}
