# Unity Hospital Management System

A comprehensive hospital management solution built with a microservices architecture using Spring Boot for the backend and React (with Vite and TypeScript) for the frontend.

## Architecture Overview

The application follows a distributed microservices pattern to ensure scalability, fault tolerance, and separation of concerns.

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling/UI:** (Add your UI library here, e.g., Tailwind CSS, Material UI)

### Backend
- **Core Framework:** Spring Boot 3.2
- **Language:** Java 21
- **Service Discovery:** Netflix Eureka (`eurekaserver`)
- **API Gateway:** Spring Cloud Gateway (`apigateway`)
- **Build Tool:** Maven

#### Microservices
The backend is divided into the following specialized microservices:
1.  **API Gateway (`apigateway`)**: The single entry point for all client requests, routing them to the appropriate backend services.
2.  **Eureka Server (`eurekaserver`)**: Service registry for dynamic discovery of all microservices.
3.  **Appointment Service (`appointmentservice`)**: Manages scheduling and tracking of patient appointments.
4.  **Auth Service (`authservice`)**: Handles user authentication and authorization (e.g., JWT).
5.  **Billing Service (`billingservice`)**: Manages invoices, payments, and financial records.
6.  **Doctor Service (`doctorservice`)**: Manages doctor profiles, schedules, and specialties.
7.  **Hospital Service (`hospitalservice`)**: Manages general hospital information, departments, and facilities.
8.  **Organization Service (`organizationservice`)**: Manages organizational hierarchies and administrative data.
9.  **Patient Service (`patientservice`)**: Manages patient records, medical history, and demographics.
10. **Pharmacy Service (`pharmacyservice`)**: Manages medication inventory, prescriptions, and dispensations.
11. **Pricing Service (`pricingservice`)**: Manages the pricing catalog for various hospital services and items.

## Prerequisites

Before running the application, ensure you have the following installed:
- **Java 21** or higher
- **Maven**
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- A running **Database** instance (e.g., PostgreSQL, MySQL, or MongoDB, depending on your services' configurations)

## Getting Started

### 1. Running the Backend Services

Due to the microservices architecture, services must be started in a specific order to ensure proper registration and routing.

1.  **Start the Eureka Server**:
    This must be running first so other services can register.
    ```bash
    cd backend/eurekaserver
    mvn spring-boot:run
    ```

2.  **Start the API Gateway**:
    Start the gateway to route external requests.
    ```bash
    cd ../apigateway
    mvn spring-boot:run
    ```

3.  **Start the remaining microservices**:
    You can now start any or all of the other services (e.g., `authservice`, `patientservice`, etc.) in separate terminal windows.
    ```bash
    cd ../[service-name]
    mvn spring-boot:run
    ```

### 2. Running the Frontend

Once the essential backend services (API Gateway, Eureka, and required data services) are running, start the React application.

```bash
cd frontend
npm install
npm run dev
```

The frontend will typically be available at `http://localhost:5173` (or the port specified by Vite in the terminal output).

## Project Structure

```text
unityhospital/
├── backend/                  # Spring Boot Microservices
│   ├── apigateway/           # Spring Cloud Gateway
│   ├── appointmentservice/   # Appointment Management
│   ├── authservice/          # Authentication & Security
│   ├── billingservice/       # Billing & Payments
│   ├── doctorservice/        # Doctor Management
│   ├── eurekaserver/         # Service Registry
│   ├── hospitalservice/      # Hospital Management
│   ├── organizationservice/  # Organization Management
│   ├── patientservice/       # Patient Management
│   ├── pharmacyservice/      # Pharmacy Management
│   └── pricingservice/       # Pricing Catalog
└── frontend/                 # React frontend application
    ├── public/               # Static assets
    ├── src/                  # React source code
    ├── package.json          # Node dependencies and scripts
    └── vite.config.ts        # Vite configuration
```
