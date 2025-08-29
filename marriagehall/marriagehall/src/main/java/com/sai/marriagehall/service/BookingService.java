package com.sai.marriagehall.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sai.marriagehall.entity.Booking;
import com.sai.marriagehall.entity.Hall;
import com.sai.marriagehall.repository.BookingRepository;
import com.sai.marriagehall.repository.HallRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HallRepository hallRepository;

    public BookingService(BookingRepository bookingRepository, HallRepository hallRepository) {
        this.bookingRepository = bookingRepository;
        this.hallRepository = hallRepository;
    }

    // Create a booking
    public ResponseEntity<?> createBooking(Booking req) {
        Optional<Hall> hallOpt = hallRepository.findById(req.getHall().getId());
        if (hallOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid hall id");
        }
        Hall hall = hallOpt.get();

        // Check for overlapping bookings
        List<Booking> overlaps = bookingRepository
                .findByHallAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        hall, req.getEndDate(), req.getStartDate());

        if (!overlaps.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Selected dates are already booked");
        }

        req.setStatus("CONFIRMED");
        req.setHall(hall);
        Booking saved = bookingRepository.save(req);
        return ResponseEntity.ok(saved);
    }

    // Get all bookings with hall details
    public List<Booking> getAllBookings() {
        return bookingRepository.findAllWithHall();
    }

    // Get a booking by id
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // Cancel/Delete a booking
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}