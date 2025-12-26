# Corporate Travel Platform – Backend & Cloud Architecture

## 1. Architecture Overview
The system follows a modular, cloud-native architecture designed for scalability, security, and independent feature evolution.

Frontend:
- Angular Shell App (Login, Menu, Admin Portal)
- Travel Micro-Frontend (Travel booking, expenses, notifications)

Backend:
- Microservices-based backend
- API Gateway as single entry point
- Event-driven for notifications and sync

Cloud:
- Containerized services
- Managed databases and messaging
- Global delivery via CDN

---

## 2. Backend Services

| Service | Responsibility |
|------|----------------|
| Auth Service | Login, JWT, role-based access |
| User Service | User profiles, roles, policies |
| Travel Service | Flight/hotel bookings |
| Expense Service | Expense CRUD, approvals |
| Notification Service | Email, in-app, push |
| Admin Service | Configuration, reports |

Each service owns its data and exposes REST APIs.

---

## 3. API Gateway
- Authentication & authorization
- Rate limiting
- Request routing
- API versioning

All frontend traffic flows through `/api/*`.

---

## 4. Data Layer
- Relational DB: transactions, expenses
- NoSQL DB: notifications, logs
- Cache: sessions, configs

Database-per-service pattern is used.

---

## 5. Event & Messaging
- Pub/Sub model
- Used for notifications and cross-service sync
- Eventually consistent workflows

---

## 6. Cloud Architecture
- Load Balancer
- API Gateway
- Container Orchestrator (Kubernetes)
- Managed Databases
- Message Broker
- CDN

---

## 7. Security
- JWT-based authentication
- Role-based authorization
- Secrets in vault
- HTTPS everywhere

---

## 8. Scalability & Reliability
- Horizontal scaling
- Stateless services
- Health checks & auto-recovery
- Centralized logging & monitoring

---

## 9. Design Rationale
- Independent scaling
- Clear ownership
- Reduced blast radius
- Enterprise-ready
