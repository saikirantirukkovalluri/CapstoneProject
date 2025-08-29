package com.sai.marriagehall.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.sai.marriagehall.entity.Booking;
import com.sai.marriagehall.entity.Hall;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByHallAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Hall hall, LocalDate endDate, LocalDate startDate);
    
    @Query("select b from Booking b join fetch b.hall")
    List<Booking> findAllWithHall();
}