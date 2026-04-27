# ClickKart — Shop Smarter

> © 2025 ClickKart — All Rights Reserved &nbsp;|&nbsp; Roll No: **24071A05K3** &nbsp;|&nbsp; Project: **ClickKart Shopping Portal**

A polished React shopping website built with Vite + React Router v6, with a
matching Java Servlet that performs the same tier-based discount calculation
on Apache Tomcat.

## Tech stack

- **Vite + React 18** (single-page app)
- **React Router DOM v6** for client routing
- **React Context API** for cart and auth state
- **Pure CSS** — no Tailwind, no MUI, no UI frameworks
- **localStorage** persistence for cart and user
- **Java Servlet** (Tomcat 9 / `javax.servlet`) for the discount endpoint

## Getting started

```bash
npm install
npm run dev          # start dev server (Vite)
npm run build        # production build
npm run preview      # preview production build locally
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Project structure

```
ClickKart/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/
│   │   ├── CartContext.jsx
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   └── Contact.jsx
│   ├── data/
│   │   └── products.js
│   └── utils/
│       └── discount.js
└── server/
    ├── src/com/clickkart/DiscountServlet.java
    ├── WEB-INF/web.xml
    └── README.md
```

## Routes

| Path        | Page         | Notes                                              |
| ----------- | ------------ | -------------------------------------------------- |
| `/`         | Home         | Hero + 4 featured products + savings banner       |
| `/products` | Products     | All 8 products in a responsive grid               |
| `/cart`     | Cart         | Quantity controls, live discount, summary         |
| `/checkout` | Checkout     | Shipping + payment, summary, tier table          |
| `/login`    | Login        | Toggleable Login / Register form                  |
| `/contact`  | Contact      | Contact info + message form                       |

The **Navbar** is sticky with a live cart-count badge. The **Footer** appears
on every page with the project + roll number details.

## Discount tiers (shared with the Servlet)

| Purchase Range     | Discount |
|--------------------|----------|
| ₹500 – ₹1,999      | 5%       |
| ₹2,000 – ₹4,999    | 10%      |
| ₹5,000 – ₹9,999    | 15%      |
| ₹10,000+           | 20%      |

The function lives in `src/utils/discount.js` and is used in:

- `src/pages/Cart.jsx`
- `src/pages/Checkout.jsx`
- `server/src/com/clickkart/DiscountServlet.java` (mirrored in Java)

## Java Servlet

See [`server/README.md`](./server/README.md) for build & Tomcat deployment
instructions. The servlet reads `purchaseAmount` from the query string and
returns an HTML page with the original amount, discount percent, discount
amount and final price.

```
GET /discount?purchaseAmount=2500
```
