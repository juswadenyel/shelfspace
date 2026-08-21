package com.shelfspace.shelfspace.borrower;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BorrowerService {

    @Autowired
    private BorrowerRepository borrowerRepository;

    public List<Borrower> getAllBorrowers() {
        return borrowerRepository.findAll();
    }

    public Optional<Borrower> getBorrowerById(Integer id) {
        return borrowerRepository.findById(id);
    }

    public Borrower createBorrower(Borrower borrower) {
        return borrowerRepository.save(borrower);
    }

    public Borrower updateBorrower(Integer id, Borrower updatedBorrower) {
        return borrowerRepository.findById(id).map(borrower -> {
            borrower.setName(updatedBorrower.getName());
            borrower.setEmail(updatedBorrower.getEmail());
            borrower.setStudentId(updatedBorrower.getStudentId());
            return borrowerRepository.save(borrower);
        }).orElse(null);
    }

    public void deleteBorrower(Integer id) {
        borrowerRepository.deleteById(id);
    }
}