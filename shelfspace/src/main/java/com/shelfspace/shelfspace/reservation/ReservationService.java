package com.shelfspace.shelfspace.reservation;

import com.shelfspace.shelfspace.resource.Resource;
import com.shelfspace.shelfspace.resource.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Optional<Reservation> getReservationById(Integer id) {
        return reservationRepository.findById(id);
    }

    public Reservation createReservation(Reservation reservation) {
        // Decrease available copies when a reservation is made
        Resource resource = reservation.getResource();
        if (resource.getAvailableCopies() > 0) {
            resource.setAvailableCopies(resource.getAvailableCopies() - 1);
            resourceRepository.save(resource);
            return reservationRepository.save(reservation);
        } else {
            throw new IllegalStateException("No available copies for this resource");
        }
    }

    public Reservation returnReservation(Integer id) {
        return reservationRepository.findById(id).map(reservation -> {
            reservation.setStatus("returned");
            reservation.setReturnedDate(LocalDate.now());

            // Increase available copies back when returned
            Resource resource = reservation.getResource();
            resource.setAvailableCopies(resource.getAvailableCopies() + 1);
            resourceRepository.save(resource);

            return reservationRepository.save(reservation);
        }).orElse(null);
    }

    public void deleteReservation(Integer id) {
        reservationRepository.deleteById(id);
    }
}