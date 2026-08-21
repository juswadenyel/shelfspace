package com.shelfspace.shelfspace.borrower;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowers")
@CrossOrigin(origins = "http://localhost:5173")
public class BorrowerController {

    @Autowired
    private BorrowerService borrowerService;

    @GetMapping
    public List<Borrower> getAllBorrowers() {
        return borrowerService.getAllBorrowers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Borrower> getBorrowerById(@PathVariable Integer id) {
        return borrowerService.getBorrowerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Borrower createBorrower(@RequestBody Borrower borrower) {
        return borrowerService.createBorrower(borrower);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Borrower> updateBorrower(@PathVariable Integer id, @RequestBody Borrower borrower) {
        Borrower updated = borrowerService.updateBorrower(id, borrower);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrower(@PathVariable Integer id) {
        borrowerService.deleteBorrower(id);
        return ResponseEntity.noContent().build();
    }
}