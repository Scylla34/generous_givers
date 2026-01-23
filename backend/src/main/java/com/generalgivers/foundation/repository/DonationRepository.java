package com.generalgivers.foundation.repository;

import com.generalgivers.foundation.entity.Donation;
import com.generalgivers.foundation.entity.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DonationRepository extends JpaRepository<Donation, UUID> {

    List<Donation> findByDonorUserId(UUID donorUserId);

    // M-Pesa related queries
    Optional<Donation> findByCheckoutRequestId(String checkoutRequestId);

    Optional<Donation> findByMerchantRequestId(String merchantRequestId);

    List<Donation> findByPhoneNumber(String phoneNumber);

    List<Donation> findByProjectId(UUID projectId);

    List<Donation> findByStatus(DonationStatus status);

    List<Donation> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.status = 'COMPLETED'")
    BigDecimal getTotalDonationAmount();

    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.date BETWEEN :startDate AND :endDate AND d.status = 'COMPLETED'")
    BigDecimal getTotalDonationAmountBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.project.id = :projectId AND d.status = 'COMPLETED'")
    BigDecimal getTotalDonationsByProject(@Param("projectId") UUID projectId);

    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.date BETWEEN :startDate AND :endDate AND d.status = 'COMPLETED'")
    BigDecimal getTotalDonationsByDateRange(@Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT d FROM Donation d ORDER BY d.date DESC")
    List<Donation> findAllOrderByDateDesc();

    @Query("SELECT FUNCTION('DATE_TRUNC', 'month', d.date) as month, SUM(d.amount) as total " +
           "FROM Donation d WHERE EXTRACT(YEAR FROM d.date) = :year AND d.status = 'COMPLETED' " +
           "GROUP BY FUNCTION('DATE_TRUNC', 'month', d.date) " +
           "ORDER BY month")
    List<Object[]> getMonthlyDonationsForYear(@Param("year") int year);
}
