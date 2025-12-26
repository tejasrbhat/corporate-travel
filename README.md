# Corporate Travel Platform – Angular Frontend Architecture

## 1. Overview
The frontend uses a hybrid micro-frontend architecture:

- **Shell Application**: The host application that manages layout, authentication, and routing.
- **Travel Micro-Frontend (MFE)**: A remote application handling travel bookings and expenses.
- **Shared Auth Library**: A shared library for authentication state and guards.

Only fast-evolving business domains are implemented as MFEs.

---

## 2. Shell Application

### Responsibilities
- Authentication (Login / Logout)
- Global layout (Header, Menu)
- Admin Portal (User Management)
- Authorization guards (`authGuard`, `roleGuard`)
- Theme & design system
- Global user state

### Excludes
- No travel or expense business logic

---

## 3. Travel Micro-Frontend

### Responsibilities
- Travel booking
- Expense management (Create, Edit, Approve)
- Notifications UI

### Characteristics
- Independent Angular app
- Separate CI/CD capabilities
- Lazy loaded via Module Federation
- Shares auth context with shell via `auth-lib`

---

## 4. Routing Strategy

Shell routes:
- `/login`
- `/settings` (Admin only)
- `/travel/**` (Loads Travel MFE)

Travel MFE internal routes:
- `/travel/list`
- `/travel/create`
- `/travel/edit/:id`
- `/travel/book/:id`
- `/travel/expenses` (Child routes: list, create, edit)
- `/travel/profile`

---

## 5. Communication & State
- **REST APIs**: Angular `HttpClient` via proxy to a Mock Node.js server.
- **Shared State**: `auth-lib` exposes a singleton `AuthService` signal for user state.
- **Module Federation**: Used to share libraries (`@angular/*`, `rxjs`) and load the remote MFE.

---

## 6. Directory Structure

```
/
├── mock-server/        # Node.js Express Mock API
├── projects/
│   ├── shell/          # Host Application
│   ├── travel/         # Remote MFE
│   └── auth-lib/       # Shared Authentication Library
├── package.json        # Workspace dependencies and scripts
└── README.md           # Project Documentation
```

---

## 7. Setup & Installation

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```

---

## 8. Development

### Running the Platform
To run the entire platform (Shell, Travel MFE, and Mock Server) concurrently:

```bash
npm run run:all
```

This command starts:
- **Mock Server** on port `3000`
- **Shell** on port `4200`
- **Travel MFE** on port `4201`

### Running Individual Services
- **Mock Server**: `npm run mock`
- **Shell**: `npm start` (or `ng serve shell`)
- **Travel**: `ng serve travel`

---

## 9. Deployment

### Build Architecture
The project uses **Module Federation**. Deployment requires building both the Shell and the Remote (Travel) and serving them so they can communicate over HTTP.

### Build Commands
1.  **Build Shared Lib**:
    ```bash
    ng build auth-lib
    ```
2.  **Build Travel MFE**:
    ```bash
    ng build travel --configuration production
    ```
3.  **Build Shell**:
    ```bash
    ng build shell --configuration production
    ```

### Deployment Steps
1.  **Host the artifacts**:
    - Deploy `dist/shell` to your main domain (e.g., `app.corporate.com`).
    - Deploy `dist/travel` to a separate location (e.g., `travel.corporate.com` or `app.corporate.com/travel-mfe`).
2.  **Configure Module Federation**:
    - Update the `remoteEntry` URL in `projects/shell/src/app/app.routes.ts` (or use a dynamic manifest) to point to the deployed Travel MFE location.
    - Example: `remoteEntry: 'https://travel.corporate.com/remoteEntry.js'`

---

## 10. Key Technologies
- **Angular 18+**
- **Module Federation** (Angular Architects)
- **RxJS & Signals**
- **Node.js & Express** (Mock Backend)
