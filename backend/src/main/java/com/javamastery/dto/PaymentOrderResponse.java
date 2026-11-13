package com.javamastery.dto;

import java.math.BigDecimal;

public class PaymentOrderResponse {
    private String orderId;
    private BigDecimal amount;
    private String currency;
    private String keyId;
    private String receiptNumber;
    private String businessName = "Java Mastery Platform";
    private String description = "Lifetime Access to Core Java Learning & Coding Suite (₹99)";

    public PaymentOrderResponse() {}

    public PaymentOrderResponse(String orderId, BigDecimal amount, String currency, String keyId, String receiptNumber) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.keyId = keyId;
        this.receiptNumber = receiptNumber;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
