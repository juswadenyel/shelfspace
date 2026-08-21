# ShelfSpace

A backend system for managing library-style resource borrowing — track resources (books, equipment, etc.), borrowers, and reservations, with automatic tracking of available copies.

## Tech Stack

- **Backend:** Spring Boot (Java 17)
- **Database:** PostgreSQL via Supabase
- **Build Tool:** Maven

## Project Structure

This project follows a **feature-based modular architecture** — each domain (resource, borrower, reservation) contains its own Entity, Repository, Service, and Controller.


## Setup Instructions

1. Clone this repository
```bash
   git clone https://github.com/juswadenyel/shelfspace.git
```
2. Copy `application.properties.example` to `application.properties`:
```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
```
3. Fill in your own Supabase database credentials in `application.properties`
4. Run the application in VS Code or via terminal:
```bash
   ./mvnw spring-boot:run
```
5. The API will be available at `http://localhost:8080`

## API Endpoints

### Resources
| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/resources` | Get all resources |
| GET | `/api/resources/{id}` | Get a resource by ID |
| POST | `/api/resources` | Create a new resource |
| PUT | `/api/resources/{id}` | Update a resource |
| DELETE | `/api/resources/{id}` | Delete a resource |

### Borrowers
| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/borrowers` | Get all borrowers |
| GET | `/api/borrowers/{id}` | Get a borrower by ID |
| POST | `/api/borrowers` | Register a new borrower |
| PUT | `/api/borrowers/{id}` | Update a borrower |
| DELETE | `/api/borrowers/{id}` | Delete a borrower |

### Reservations
| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/reservations` | Get all reservations |
| GET | `/api/reservations/{id}` | Get a reservation by ID |
| POST | `/api/reservations` | Create a reservation (borrows a resource, decreases available copies) |
| PUT | `/api/reservations/{id}/return` | Return a reservation (increases available copies) |
| DELETE | `/api/reservations/{id}` | Delete a reservation |

## Author

Joshua Daniel — CIT-U, BS Information Technology