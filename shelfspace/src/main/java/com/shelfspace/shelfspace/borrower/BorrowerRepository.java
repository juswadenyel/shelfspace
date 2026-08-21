package com.shelfspace.shelfspace.borrower;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowerRepository extends JpaRepository<Borrower, Integer> {
  
}