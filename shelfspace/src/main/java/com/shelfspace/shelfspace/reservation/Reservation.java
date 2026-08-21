package com.shelfspace.shelfspace.reservation;

import com.shelfspace.shelfspace.resource.Resource;
import com.shelfspace.shelfspace.borrower.Borrower;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @ManyToOne
    @JoinColumn(name = "borrower_id", nullable = false)
    private Borrower borrower;

    @Column(nullable = false)
    private String status = "reserved"; // reserved, active, returned

    @Column(name = "reserved_date", nullable = false)
    private LocalDate reservedDate = LocalDate.now();

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "returned_date")
    private LocalDate returnedDate;

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }

    public Borrower getBorrower() { return borrower; }
    public void setBorrower(Borrower borrower) { this.borrower = borrower; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getReservedDate() { return reservedDate; }
    public void setReservedDate(LocalDate reservedDate) { this.reservedDate = reservedDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getReturnedDate() { return returnedDate; }
    public void setReturnedDate(LocalDate returnedDate) { this.returnedDate = returnedDate; }
}