package com.javamastery.controller;

import com.javamastery.dto.ApiResponse;
import com.javamastery.dto.PaymentOrderResponse;
import com.javamastery.dto.PaymentVerifyRequest;
import com.javamastery.dto.PaymentVerifyResponse;
import com.javamastery.entity.Payment;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/order")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createOrder(@AuthenticationPrincipal UserPrincipal principal) {
        PaymentOrderResponse response = paymentService.createOrder(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Payment order created", response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<PaymentVerifyResponse>> verifyPayment(@AuthenticationPrincipal UserPrincipal principal,
                                                                           @RequestBody PaymentVerifyRequest request) {
        PaymentVerifyResponse response = paymentService.verifyPayment(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Payment verified successfully. Course access activated!", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentHistory(@AuthenticationPrincipal UserPrincipal principal) {
        List<Payment> history = paymentService.getStudentPaymentHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @GetMapping("/receipt/{paymentId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentReceipt(@PathVariable UUID paymentId) {
        Payment receipt = paymentService.getPaymentReceipt(paymentId);
        return ResponseEntity.ok(ApiResponse.ok(receipt));
    }
}
