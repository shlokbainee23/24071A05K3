/*
 * Project  : ClickKart Shopping Portal
 * Roll No  : 24071A05K3
 * Servlet  : CheckoutServlet
 * URL      : http://localhost:8080/exp2/checkout
 * Method   : POST (called from React checkout page)
 */
package com.clickkart;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "CheckoutServlet", urlPatterns = "/checkout")
public class CheckoutServlet extends HttpServlet {

    private double getDiscount(double amount) {
        if (amount >= 10000) return 20.0;
        if (amount >= 5000)  return 15.0;
        if (amount >= 2000)  return 10.0;
        if (amount >= 500)   return 5.0;
        return 0.0;
    }

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json;charset=UTF-8");

        String name      = request.getParameter("name");
        String email     = request.getParameter("email");
        String amountStr = request.getParameter("totalAmount");

        PrintWriter out = response.getWriter();

        try {
            double amount      = Double.parseDouble(amountStr);
            double pct         = getDiscount(amount);
            double discountAmt = Math.round(amount * pct) / 100.0;
            double finalPrice  = amount - discountAmt;

            out.println("{");
            out.println("  \"status\": \"success\",");
            out.println("  \"message\": \"Order confirmed for " + name + "\",");
            out.println("  \"email\": \"" + email + "\",");
            out.println("  \"originalAmount\": " + amount + ",");
            out.println("  \"discountPercent\": " + pct + ",");
            out.println("  \"discountAmount\": " + discountAmt + ",");
            out.println("  \"finalAmount\": " + finalPrice + ",");
            out.println("  \"project\": \"ClickKart\",");
            out.println("  \"rollNo\": \"24071A05K3\"");
            out.println("}");
        } catch (Exception e) {
            response.setStatus(400);
            out.println("{ \"status\": \"error\", \"message\": \"Invalid parameters\" }");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setStatus(HttpServletResponse.SC_OK);
    }
}
