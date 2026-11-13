package com.javamastery.dto;

import java.time.LocalDateTime;

public class PaymentVerifyResponse {
    private boolean verified;
    private String status;
    private boolean courseAccess;
    private String receiptNumber;
    private String transactionReference;
    private LocalDateTime verifiedAt;

    public PaymentVerifyResponse() {}

    public PaymentVerifyResponse(boolean verified, String status, boolean courseAccess,
                                 String receiptNumber, String transactionReference, LocalDateTime verifiedAt) {
        this.verified = verified;
        this.status = status;
        this.courseAccess = courseAccess;
        this.receiptNumber = receiptNumber;
        this.transactionReference = transactionReference;
        this.verifiedAt = verifiedAt;
    }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isCourseAccess() { return courseAccess; }
    public void setCourseAccess(boolean courseAccess) { this.courseAccess = courseAccess; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
}
