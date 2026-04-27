# ClickKart — exp2 (Tomcat Servlet Backend)

**Project:** ClickKart Shopping Portal
**Roll No:** 24071A05K3
**Location:** `C:\Users\thimm\OneDrive\Desktop\internal\exp2`
**Linked React App:** `C:\Users\thimm\OneDrive\Desktop\internal\exp1`

---

## Servlet Endpoints

| Servlet           | URL                              | Method | Description                     |
|-------------------|----------------------------------|--------|---------------------------------|
| DiscountServlet   | `/exp2/discount?purchaseAmount=X`| GET    | Returns discount HTML page      |
| CheckoutServlet   | `/exp2/checkout`                 | POST   | Returns order JSON confirmation |

---

## Discount Rules (same as React frontend)

| Purchase Amount     | Discount |
|---------------------|----------|
| Less than ₹500      | 0%       |
| ₹500 – ₹1,999       | 5%       |
| ₹2,000 – ₹4,999     | 10%      |
| ₹5,000 – ₹9,999     | 15%      |
| ₹10,000 and above   | 20%      |

---

## Project Layout

```
exp2/
├── src/main/java/com/clickkart/
│   ├── DiscountServlet.java   ← GET /discount  → HTML
│   ├── CheckoutServlet.java   ← POST /checkout → JSON
│   └── CORSFilter.java        ← Allows React (3000) to call Tomcat (8080)
├── WebContent/WEB-INF/
│   ├── web.xml
│   └── lib/                   (place servlet-api.jar here for non-Maven IDE builds)
├── pom.xml                    Maven build (produces target/exp2.war)
└── README.md
```

---

## How to Deploy

1. Install **Apache Tomcat 10+** from <https://tomcat.apache.org>
2. Install **JDK 17** from <https://adoptium.net>
3. Install **Maven** from <https://maven.apache.org>

4. Open a terminal in the `exp2` folder:

   ```bat
   cd C:\Users\thimm\OneDrive\Desktop\internal\exp2
   ```

5. Build the WAR file:

   ```bat
   mvn clean package
   ```

6. Copy the WAR to Tomcat:

   ```bat
   copy target\exp2.war C:\tomcat\webapps\
   ```

7. Start Tomcat:

   ```bat
   C:\tomcat\bin\startup.bat
   ```

8. Test in browser:

   <http://localhost:8080/exp2/discount?purchaseAmount=3500>

9. Start React app (exp1):

   ```bat
   cd C:\Users\thimm\OneDrive\Desktop\internal\exp1\ClickKart
   npm start
   ```

Both apps now talk to each other. React runs on **localhost:3000**, Tomcat runs on **localhost:8080**.

---

## Manually Test the Checkout Endpoint

```bat
curl -X POST http://localhost:8080/exp2/checkout ^
     -d "name=Jane&email=jane@example.com&totalAmount=3500"
```

Expected JSON response:

```json
{
  "status": "success",
  "message": "Order confirmed for Jane",
  "email": "jane@example.com",
  "originalAmount": 3500.0,
  "discountPercent": 10.0,
  "discountAmount": 350.0,
  "finalAmount": 3150.0,
  "project": "ClickKart",
  "rollNo": "24071A05K3"
}
```
