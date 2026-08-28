# ShelfSpace

ShelfSpace is a library resource management system developed using ReactJS and Spring Boot. The system allows users to manage library resources, borrowers, reservations, and authenticated service requests.

## Features

- User registration and login
- JWT-based authentication
- Resource management
- Borrower management
- Reservation management
- Service Request management
- Create, view, update, and delete Service Requests
- User ownership protection for Service Requests
- PostgreSQL database integration
- ReactJS frontend
- Spring Boot REST API

## Technologies Used

### Frontend
- ReactJS
- Vite
- React Router
- JavaScript
- CSS
- Framer Motion
- Lucide React

### Backend
- Java 17
- Spring Boot
- Spring Security
- JWT Authentication
- Maven
- REST API

### Database
- PostgreSQL
- Supabase

## Project Structure

The project is divided into two main parts:

```text
shelfspace/
│
├── shelfspace-frontend/     # ReactJS frontend
│
└── shelfspace/              # Spring Boot backend
Frontend

The ReactJS frontend contains the user interface of the application, including:

Login
Registration
Dashboard
Resources
Borrowers
Reservations
Service Requests
Backend

The Spring Boot backend provides the REST API and handles:

Authentication
Database operations
Resource management
Borrower management
Reservations
Service Requests
User authorization and ownership
Service Request API

The Service Request module is protected using Spring Security and JWT authentication.

Method	Endpoint	Description
POST	/api/requests	Create a Service Request
GET	/api/requests	View the authenticated user's requests
GET	/api/requests/{id}	View a specific Service Request
PUT	/api/requests/{id}	Update a Service Request
DELETE	/api/requests/{id}	Delete a Service Request
Authentication

ShelfSpace uses JWT authentication to protect the API.

After logging in, the frontend receives an authentication token. The token is sent to protected backend endpoints using:

Authorization: Bearer <token>

The Spring Boot backend validates the JWT before allowing access to protected endpoints.

Service Request Ownership

Service Requests are linked to the authenticated user.

The backend determines the owner using the user's authenticated email from the JWT rather than relying on a userId sent by the frontend.

This prevents users from accessing or modifying another user's Service Requests.

For example:

User A
   │
   └── Creates Service Request
           │
           └── Request belongs to User A

User B
   │
   └── Attempts to access User A's request
           │
           └── Access denied

If a Service Request does not belong to the authenticated user, the backend returns:

404 Not Found

with:

{
  "error": "Service request not found"
}

This prevents the API from revealing whether another user's Service Request exists.

Requirements

Before running the project, make sure you have:

Java 17 or later
Node.js and npm
PostgreSQL database
Supabase account/database
Git
Running the Backend

Navigate to the backend folder:

cd shelfspace

Create your local application properties file using the example:

src/main/resources/application.properties.example

Create:

src/main/resources/application.properties

and add your own PostgreSQL/Supabase database credentials.

Then run the Spring Boot application:

Windows
mvnw.cmd spring-boot:run
Linux/macOS
./mvnw spring-boot:run

The backend API will run at:

http://localhost:8080
Running the Frontend

Open another terminal and navigate to the frontend:

cd shelfspace-frontend

Install the required dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173
Testing the Application
Start the Spring Boot backend.
Start the ReactJS frontend.
Open the frontend in a browser.
Register a new account.
Log in using the registered account.
Create a Service Request.
View the Service Request.
Update the Service Request.
Delete the Service Request.
Create or use a second account.
Verify that the second user cannot access, update, or delete the first user's Service Request.
Security

The Service Request API requires authentication.

Spring Security protects the API endpoints, while the JWT authentication filter:

Reads the Authorization header.
Extracts the JWT.
Validates the token.
Identifies the authenticated user.
Allows the request to continue only when authentication is valid.

Ownership is enforced by the backend rather than the ReactJS interface.

API Base URL
http://localhost:8080/api
Author

Joshua Daniel

CIT-U
BS Information Technology
