package com.shelfspace.shelfspace.servicerequest;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Integer> {

    List<ServiceRequest> findByCreatedByOrderByDateCreatedDesc(String createdBy);

    Optional<ServiceRequest> findByIdAndCreatedBy(Integer id, String createdBy);
}