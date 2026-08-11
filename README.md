# 🔐 Secure API Governance Platform

A full-stack **API Governance and Security Management Platform** built using **React.js, Spring Boot, Spring Security, and MySQL**.

The platform provides centralized management of users, roles, permissions, protected API resources, and security audit logs using **Role-Based Access Control (RBAC)**.

## 📌 Project Overview

The **Secure API Governance Platform** is designed to manage and monitor API security within an organization.

The application allows authorized users to:

- Manage platform users
- Manage roles and permissions
- Configure protected API resources
- Monitor API access
- Track granted and denied requests
- Maintain security audit logs
- Enforce role-based authorization

The project follows a full-stack architecture where the React frontend communicates with a Spring Boot REST API backend connected to a MySQL database.

## 🚀 Features

### 🔑 Authentication & Security

- User login and logout
- Spring Security authentication
- BCrypt password encryption
- Protected frontend routes
- Backend API authorization
- Role-Based Access Control
- Unauthorized access handling
- HTTP 403 Forbidden handling

### 👥 User Management

- View registered users
- Add users
- Edit users
- Delete users
- Search users
- Display assigned roles

### 🛡️ Role & Permission Management

- Manage application roles
- View role permissions
- Configure access permissions
- Control API access according to user roles

### 🌐 API Resource Management

Manage protected API resources such as:

- User Management API
- Document API
- Reports API
- Role Management API
- Audit Log API

## 🛠️ Tech Stack

**Frontend:** React.js, JavaScript, Vite, CSS  
**Backend:** Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate  
**Database:** MySQL  
**Build Tools:** Maven, npm

## 📂 Project Structure

```text
SECURE API GOVERNANCE APPLICATION
│
├── secure-api-governance-backend
│   │
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com.secureapi.governance
│   │   │   │
│   │   │   │       ├── config
│   │   │   │       │   ├── AuditLogFilter.java
│   │   │   │       │   ├── PasswordGenerator.java
│   │   │   │       │   └── SecurityConfig.java
│   │   │   │       │
│   │   │   │       ├── controller
│   │   │   │       │   ├── ApiResourceController.java
│   │   │   │       │   ├── AuditLogController.java
│   │   │   │       │   ├── AuthController.java
│   │   │   │       │   ├── RoleController.java
│   │   │   │       │   └── UserController.java
│   │   │   │       │
│   │   │   │       ├── entity
│   │   │   │       │   ├── ApiResource.java
│   │   │   │       │   ├── AuditLog.java
│   │   │   │       │   ├── Role.java
│   │   │   │       │   └── User.java
│   │   │   │       │
│   │   │   │       ├── repository
│   │   │   │       │   ├── ApiResourceRepository.java
│   │   │   │       │   ├── AuditLogRepository.java
│   │   │   │       │   ├── RoleRepository.java
│   │   │   │       │   └── UserRepository.java
│   │   │   │       │
│   │   │   │       ├── service
│   │   │   │       │   ├── ApiResourceService.java
│   │   │   │       │   ├── AuditLogService.java
│   │   │   │       │   ├── CustomUserDetailsService.java
│   │   │   │       │   ├── RoleService.java
│   │   │   │       │   └── UserService.java
│   │   │   │       │
│   │   │   │       └── SecureApiGovernanceBackendApplication.java
│   │   │   │
│   │   │   └── resources
│   │   │       └── application.properties
│   │   │
│   │   └── test
│   │
│   └── pom.xml
│
├── secure-api-governance-frontend
│   │
│   ├── src
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatCard.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── ApiResources.jsx
│   │   │   ├── AuditLogs.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Roles.jsx
│   │   │   └── Users.jsx
│   │   │
│   │   ├── services
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

## 📚 Learning Objectives

This project demonstrates practical implementation of:

- React.js application development
- REST API integration
- Spring Boot REST APIs
- Spring Security
- Authentication and authorization
- Role-Based Access Control
- BCrypt password hashing
- Spring Data JPA
- Hibernate ORM
- MySQL database integration
- Layered backend architecture
- Protected frontend routes
- API security
- Security audit logging

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/sounak-dev03/Secure-API-Governance-Application.git
cd "SECURE API GOVERNANCE APPLICATION"
```

## 2. Backend Setup

Navigate to the backend:

```bash
cd secure-api-governance-backend
```

Configure the MySQL database in:

```text
src/main/resources/application.properties
```

Run the Spring Boot backend:

```bash
mvnw.cmd spring-boot:run
```

## 3. Frontend Setup

Open another terminal:

```bash
cd secure-api-governance-frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the URL provided by Vite.

## 4. Run the Application

Run both applications simultaneously:

- **Backend:** Spring Boot
- **Frontend:** React + Vite

Make sure MySQL is running before starting the backend.

## 👨‍💻 Author

**Sounak Hazra**

B.Tech — Computer Science & Engineering
- GitHub: https://github.com/sounak-dev03
- LinkedIn: https://www.linkedin.com/in/sounak-hazra-52a6302b6