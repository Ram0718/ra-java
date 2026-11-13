package com.javamastery.repository;

import com.javamastery.entity.Payment;
import com.javamastery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByReceiptNumber(String receiptNumber);

    List<Payment> findByUserOrderByCreatedAtDesc(User user);

    List<Payment> findAllByOrderByCreatedAtDesc();

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'VERIFIED'")
    BigDecimal calculateTotalVerifiedRevenue();
}
