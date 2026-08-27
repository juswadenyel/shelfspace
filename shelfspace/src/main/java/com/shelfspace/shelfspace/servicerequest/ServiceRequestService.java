package com.shelfspace.shelfspace.servicerequest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    public List<ServiceRequest> getAllForUser(String email) {
        return serviceRequestRepository.findByCreatedByOrderByDateCreatedDesc(email);
    }

    public Optional<ServiceRequest> getByIdForUser(Integer id, String email) {
        return serviceRequestRepository.findByIdAndCreatedBy(id, email);
    }

    public ServiceRequest create(ServiceRequest request, String email) {
        request.setId(null);
        request.setCreatedBy(email);
        request.setDateCreated(null); // let @PrePersist stamp it
        return serviceRequestRepository.save(request);
    }

    /**
     * Returns the updated request, or empty if it doesn't exist OR doesn't
     * belong to the given user — callers should treat both cases as 404.
     */
    public Optional<ServiceRequest> updateForUser(Integer id, ServiceRequest updated, String email) {
        return serviceRequestRepository.findByIdAndCreatedBy(id, email).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setCategory(updated.getCategory());
            return serviceRequestRepository.save(existing);
        });
    }

    /**
     * Returns true if a request owned by this user was deleted; false if no
     * such (owned) request existed.
     */
    public boolean deleteForUser(Integer id, String email) {
        return serviceRequestRepository.findByIdAndCreatedBy(id, email).map(existing -> {
            serviceRequestRepository.delete(existing);
            return true;
        }).orElse(false);
    }
}