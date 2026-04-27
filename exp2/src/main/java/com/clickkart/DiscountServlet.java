/*
 * Project  : ClickKart Shopping Portal
 * Roll No  : 24071A05K3
 * Servlet  : DiscountServlet
 * URL      : http://localhost:8080/exp2/discount
 * Method   : GET
 * Param    : purchaseAmount (double, optional)
 *
 * Plain-text/HTML output. No CSS. Just a form + a result line.
 */
package com.clickkart;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "DiscountServlet", urlPatterns = "/discount")
public class DiscountServlet extends HttpServlet {

    private double getDiscountPercent(double amount) {
        if (amount >= 10000) return 20.0;
        if (amount >= 5000)  return 15.0;
        if (amount >= 2000)  return 10.0;
        if (amount >= 500)   return 5.0;
        return 0.0;
    }

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setContentType("text/html;charset=UTF-8");

        PrintWriter out = response.getWriter();
        String param = request.getParameter("purchaseAmount");

        out.println("<!DOCTYPE html>");
        out.println("<html><head><title>ClickKart Discount</title></head><body>");
        out.println("<h2>ClickKart - Discount Calculator</h2>");

        // Simple form
        out.println("<form method='get' action='discount'>");
        out.println("Purchase Amount: ");
        out.println("<input type='number' name='purchaseAmount' step='0.01' min='0' "
                  + "value='" + (param == null ? "" : param) + "' required>");
        out.println("<button type='submit'>Calculate</button>");
        out.println("</form>");

        // Result section
        if (param != null && !param.trim().isEmpty()) {
            try {
                double amount = Double.parseDouble(param.trim());
                if (amount < 0) throw new NumberFormatException("Negative");

                double pct         = getDiscountPercent(amount);
                double discountAmt = Math.round(amount * pct) / 100.0;
                double finalPrice  = amount - discountAmt;

                out.println("<hr>");
                out.println("<p>Purchase Amount : " + amount + "</p>");
                out.println("<p>Discount Percent: " + pct + "%</p>");
                out.println("<p>Discount Amount : " + discountAmt + "</p>");
                out.println("<p>Final Price     : " + finalPrice + "</p>");
            } catch (NumberFormatException e) {
                out.println("<p>Invalid amount.</p>");
            }
        }

        out.println("<hr>");
        out.println("<p>Discount tiers:</p>");
        out.println("<ul>");
        out.println("<li>Less than 500     : 0%</li>");
        out.println("<li>500 to 1999       : 5%</li>");
        out.println("<li>2000 to 4999      : 10%</li>");
        out.println("<li>5000 to 9999      : 15%</li>");
        out.println("<li>10000 and above   : 20%</li>");
        out.println("</ul>");

        out.println("<p>Project: ClickKart | Roll No: 24071A05K3</p>");
        out.println("</body></html>");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setStatus(HttpServletResponse.SC_OK);
    }
}
