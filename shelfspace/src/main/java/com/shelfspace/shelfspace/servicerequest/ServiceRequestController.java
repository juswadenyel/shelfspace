package com.shelfspace.shelfspace.servicerequest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @GetMapping
    public List<ServiceRequest> getMyRequests(Authentication authentication) {
        return serviceRequestService.getAllForUser(authentication.getName());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable Integer id, Authentication authentication) {
        return serviceRequestService.getByIdForUser(id, authentication.getName())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(ServiceRequestController::notFound);
    }

    @PostMapping
    public ServiceRequest createRequest(@RequestBody ServiceRequest request, Authentication authentication) {
        return serviceRequestService.create(request, authentication.getName());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequest(
            @PathVariable Integer id,
            @RequestBody ServiceRequest request,
            Authentication authentication) {

        return serviceRequestService.updateForUser(id, request, authentication.getName())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(ServiceRequestController::notFound);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Integer id, Authentication authentication) {
        boolean deleted = serviceRequestService.deleteForUser(id, authentication.getName());

        if (!deleted) {
            return notFound();
        }

        return ResponseEntity.noContent().build();
    }

    private static ResponseEntity<?> notFound() {
        // Same response whether the request doesn't exist or belongs to
        // someone else — this avoids leaking which service requests exist.
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Service request not found"));
    }
}