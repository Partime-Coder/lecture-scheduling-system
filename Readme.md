# Lecture Scheduling System

A full-stack **Lecture Scheduling System** built as a MERN stack assignment project.

The application provides role-based authentication and lecture management, with separate frontend and backend deployments. The architecture follows a **product-oriented, modular approach** so that new modules and features can be added without restructuring the entire application.

---

## Live Application

**Frontend:**
https://lecture-scheduling-system-silk.vercel.app

**Backend API:**
https://lecture-scheduling-system.onrender.com

> The backend is hosted on a free Render instance and may take some time to wake up after a period of inactivity.

---

## Project Overview

The Lecture Scheduling System manages:

- User authentication (Admin / Instructor)
- Instructor management
- Course management (with image upload)
- Lecture scheduling with clash prevention
- Instructor-specific lecture views
- Protected, role-based routes
- REST API communication
- MongoDB data persistence

The frontend and backend are kept separate so both can be developed, scaled, and deployed independently.

---

## Technology Stack

### Frontend

| Technology | Role in this project |
|---|---|
| **React.js** | Builds the UI — Login, Dashboard, Courses, Instructors, Lectures, My Lectures — as reusable components and page-level modules. |
| **Vite** | Frontend build tool and dev server. Fast HMR, fast production builds, modern ES module support. |
| **React Router DOM** | Client-side routing and protected routes (`/login`, `/admin/courses`, `/admin/instructors`, `/admin/lectures`). |
| **Redux Toolkit** | Manages shared application state (e.g. auth state) predictably across the app. |
| **RTK Query** | Used specifically for **production-level API management with minimal boilerplate**, which was necessary to move fast within the assignment timeline. Instead of hand-writing `axios` calls + `useState`/`useEffect` for loading, error, and cache handling on every page, RTK Query auto-generates hooks (`useLoginMutation`, `useGetAllLecturesQuery`, etc.) and handles caching, tag-based invalidation, and refetching out of the box. This kept API logic centralized in `api/` files instead of scattered across components. |
| **React Hook Form** | Form state and validation with minimal re-renders. |
| **Tailwind CSS** | Utility-first, responsive styling without writing large custom CSS files. |
| **React Icons** | Interface icons. |

### Backend

| Technology | Role in this project |
|---|---|
| **Node.js** | JavaScript runtime that executes the backend server. |
| **Express.js** | Runs on top of Node.js and provides the HTTP/REST API layer — routing, middleware, request/response handling, centralized error handling. |
| **MongoDB (Atlas)** | Cloud-hosted database storing users, courses, and lectures. |
| **Mongoose** | ODM providing schemas, validation, and relationships (`ObjectId` references + `populate()`) between User, Course, and Lecture models. |
| **JWT (jsonwebtoken)** | Used for stateless authentication via **access tokens** (short-lived, sent on every request) and **refresh tokens** (long-lived, used to silently re-issue access tokens). |
| **HTTP-only Cookies / Session Handling** | Access and refresh tokens are set as **secure, HTTP-only cookies** rather than being stored in `localStorage`. This prevents client-side JavaScript from reading the tokens (mitigating XSS-based token theft). In production, cookies are configured with `secure: true` and an appropriate `sameSite` policy so they work correctly across the Vercel (frontend) → Render (backend) cross-origin setup. The refresh token is also persisted against the user document in MongoDB, so the backend can validate that a refresh token is still a valid, active session before issuing a new access token — effectively giving session-like control (a session can be invalidated server-side on logout) on top of stateless JWTs. |
| **bcrypt** | Hashes passwords before saving to MongoDB and verifies passwords on login. Plain-text passwords are never stored. |
| **Cloudinary** | Used for **course image storage**. Instead of storing image files on the backend server's disk (which doesn't persist on platforms like Render), uploaded images are pushed to Cloudinary. Cloudinary returns a **secure URL** and a **public ID** — both are saved in the Course document in MongoDB. The URL is used to render the image on the frontend. The **public ID is what makes update/delete possible**: when an admin replaces or removes a course image, the backend uses the stored public ID to tell Cloudinary exactly which asset to overwrite or destroy, instead of leaving orphaned files in storage. |
| **Multer** | Middleware that parses incoming `multipart/form-data` (the image file) from the request before it's forwarded to Cloudinary. |
| **CORS** | Explicitly allows the deployed Vercel frontend origin to make credentialed requests (cookies included) to the Render backend. |
| **dotenv** | Loads environment variables (Mongo URI, JWT secrets, Cloudinary keys) so secrets never live in source code. |

---

## Architecture

The project follows a **product-oriented, modular architecture** — each domain (Auth, Course, Instructor, Lecture) is a self-contained module (model + controller + routes + frontend API slice), rather than one large undifferentiated codebase.

```
Authentication
  ├── Login
  ├── Logout
  ├── Refresh Token
  └── Current User

Course Management
  ├── Create Course (+ image)
  ├── List / Get Course
  ├── Update Course / Update Image
  └── Delete Course

Instructor Management
  └── List Instructors

Lecture Management
  ├── Create Lecture (with clash validation)
  ├── Get All Lectures
  └── Get My Lectures (instructor-scoped)
```

This makes it straightforward to add future modules — Students, Attendance, Timetable, Notifications, Reports — without heavily modifying existing ones.

---

## Folder Structure & Reusable Code

Good separation of concerns was a deliberate goal, not an afterthought — this is what keeps the codebase maintainable as it grows.

### Backend

```
Backend/
└── src/
    ├── controllers/
    │   ├── user.controller.js
    │   ├── course.controller.js
    │   └── lecture.controller.js
    │
    ├── models/
    │   ├── users.model.js
    │   ├── courses.model.js
    │   └── lectures.model.js
    │
    ├── routes/
    │   ├── user.routes.js
    │   ├── course.routes.js
    │   └── lecture.routes.js
    │
    ├── middlewares/
    │   ├── authentication.middleware.js   → verifyJWT (validates access token, attaches req.user)
    │   ├── authorisation.middleware.js    → authorizeRoles("admin"/"instructor")
    │   └── multer.middleware.js           → handles incoming file uploads
    │
    ├── utils/
    │   ├── apiError.js       → standardized error shape thrown across controllers
    │   ├── apiResponse.js    → standardized success response shape
    │   ├── asyncHandler.js   → wraps async controllers, forwards errors to Express error handler
    │   └── cloudinary.js     → upload/destroy helpers used by any module needing image storage
    │
    ├── db/
    │   └── database connection config
    │
    ├── app.js
    └── index.js
```

**Why this matters:**
- **Routes** only wire up endpoints + middleware — no business logic.
- **Controllers** hold request validation and business rules (e.g. instructor date-clash check).
- **Models** own schema/validation, kept out of controllers.
- **Middlewares** (`verifyJWT`, `authorizeRoles`) are written once and reused across every protected route in every module — auth logic isn't duplicated per route file.
- **Utils** (`apiError`, `apiResponse`, `asyncHandler`, Cloudinary helpers) are generic and reused across User, Course, and Lecture controllers instead of being rewritten per module.

### Frontend

```
Frontend/
└── src/
    ├── api/
    │   ├── baseApi.js      → RTK Query base configuration (baseUrl, credentials: 'include', tag types)
    │   ├── userApi.js
    │   ├── courseApi.js
    │   └── lectureApi.js
    │
    ├── components/
    │   ├── Header, Sidebar, LogoutBtn, Loader
    │   └── other reusable UI components
    │
    ├── pages/
    │   ├── Login
    │   ├── Courses
    │   ├── Instructors
    │   ├── Lectures
    │   └── MyLectures
    │
    ├── routes/
    │   └── ProtectedRoute.jsx
    │
    ├── store/
    │   └── Redux store setup
    │
    ├── hooks/
    ├── utils/
    ├── App.jsx
    └── main.jsx
```

- **`api/`** isolates all server communication behind RTK Query slices — UI components call a hook (`useGetAllLecturesQuery()`), they never touch `fetch`/`axios` directly.
- **`components/`** holds presentation pieces (buttons, loaders, layout chrome) reused across every page instead of duplicated per page.
- **`routes/ProtectedRoute`** is one reusable gate that every private route passes through, instead of re-checking auth state on every page.

---

## Authentication & Authorization Flow

### Login (issuing a session)

```
User
  ↓
POST /api/v1/users/login
  ↓
Validate credentials
  ↓
Compare password (bcrypt)
  ↓
Generate access token (short-lived) + refresh token (long-lived)
  ↓
Persist refresh token against user document (server-side session control)
  ↓
Set both tokens as secure, HTTP-only cookies on the response
```

### Authenticated Request

```
Frontend (RTK Query, credentials: 'include')
  ↓
Request hits backend with cookies attached automatically
  ↓
verifyJWT middleware reads + verifies access token from cookie
  ↓
Attaches req.user
  ↓
authorizeRoles("admin" | "instructor") checks role, if required
  ↓
Controller executes
```

### Refresh Token Flow

If the access token has expired, `POST /users/refresh-token` reads the refresh token cookie, verifies it against the one stored on the user document in MongoDB, and issues a new access token — without forcing the user to log in again.

### Logout

Clears both cookies and removes the stored refresh token from the user document, effectively invalidating that session server-side (not just deleting a client-side token).

### Role-based Authorization Examples

```
GET /users/instructors
  → verifyJWT → authorizeRoles("admin") → getAllInstructors

POST /lectures
  → verifyJWT → authorizeRoles("admin") → createLecture

GET /lectures/my-lectures
  → verifyJWT → authorizeRoles("instructor") → getMyLectures
```

Being authenticated is not enough on its own — `authorizeRoles` ensures only the correct role can hit role-specific endpoints.

---

## Image Upload Flow (Cloudinary)

```
Admin selects course image
  ↓
Multer parses multipart/form-data on the backend
  ↓
File is uploaded to Cloudinary
  ↓
Cloudinary returns { secure_url, public_id }
  ↓
Course document stores both fields in MongoDB
```

- **`secure_url`** → used directly by the frontend to render the image.
- **`public_id`** → used on **update** (destroy old asset on Cloudinary, upload new one, overwrite both fields) and on **delete** (remove the asset from Cloudinary, not just the DB reference) — preventing orphaned files sitting in Cloudinary storage.

---

## API Routes

Base URL: `https://lecture-scheduling-system.onrender.com/api/v1`

### Users / Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/users/login` | Public | Login, issues cookies |
| POST | `/users/refresh-token` | Public (valid refresh cookie) | Issue new access token |
| GET | `/users/current-user` | Authenticated | Get logged-in user |
| POST | `/users/logout` | Authenticated | Clear session |
| GET | `/users/instructors` | Admin | List all instructors |

### Courses

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/courses` | Admin | Create course (+ image) |
| GET | `/courses` | Admin | List all courses |
| GET | `/courses/:courseId` | Admin | Get course by ID |
| PATCH | `/courses/:courseId` | Admin | Update course details |
| PATCH | `/courses/:courseId/image` | Admin | Replace course image |
| DELETE | `/courses/:courseId` | Admin | Delete course |

### Lectures

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/lectures` | Admin | Create lecture (with clash validation) |
| GET | `/lectures` | Admin | List all lectures |
| GET | `/lectures/my-lectures` | Instructor | List lectures assigned to logged-in instructor |

---

## Lecture Scheduling Business Logic

When a lecture is created, the backend validates:

- Required fields (title, course, instructor, date)
- Course exists
- Instructor exists
- **The instructor is not already booked on that date**

```
Instructor A already has a lecture on 2026-08-08
  ↓
Admin tries to assign Instructor A another lecture on 2026-08-08
  ↓
Rejected by the backend
```

This check is enforced **server-side**, so it can't be bypassed by the frontend.

---

## API State Management (RTK Query)

```
lectureApi
├── createLecture   (mutation)
├── getAllLectures  (query)
└── getMyLectures   (query)
```

Mutations invalidate related cache tags so lists automatically refetch after a create/update — this was chosen specifically to avoid hand-rolling loading/error/refetch logic for every single endpoint given the assignment's fixed timeline, while still keeping the API layer production-shaped (typed hooks, centralized base config, cache invalidation) rather than ad-hoc.

---

## Error Handling

Backend uses shared utilities across all controllers:

- `apiError` — consistent error shape
- `apiResponse` — consistent success shape
- `asyncHandler` — wraps controllers so thrown errors reach Express's centralized error handler instead of needing try/catch in every controller

Frontend surfaces RTK Query's `isLoading` / `isError` / `error` states consistently across pages.

---

## Environment Variables

### Backend `.env`

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=your_frontend_url

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=...
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=...

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> `.env` files and credentials are not committed to the repository.

### Frontend

The API base URL is configured per environment. In production it points to:

```
https://lecture-scheduling-system.onrender.com/api/v1
```

---

## Running Locally

### Backend

```bash
cd Backend
npm install
npm run dev      # development (nodemon)
npm start        # production
```

### Frontend

```bash
cd Frontend
npm install
npm run dev       # development
npm run build     # production build
```

---

## Deployment

```
Vercel (Frontend)
      ↓
Render (Backend API)
      ↓
MongoDB Atlas
```

- **Frontend:** Vercel — https://lecture-scheduling-system-silk.vercel.app
- **Backend:** Render — https://lecture-scheduling-system.onrender.com
- **Database:** MongoDB Atlas

---

## Security Considerations

- Password hashing with bcrypt
- JWT-based authentication (access + refresh tokens)
- HTTP-only, secure cookies (not `localStorage`) to mitigate XSS token theft
- Server-side refresh-token session validation on logout/refresh
- Role-based route authorization (admin / instructor)
- CORS restricted to the deployed frontend origin
- Environment variables for all secrets — nothing hardcoded
- Server-side + Mongoose schema validation on all writes

---

## Database

**Database:** `lecture_scheduler_db`

**Collections:** `users`, `courses`, `lectures`

**Relationships:**

```
Lecture
  ├── course      → Course (ObjectId ref)
  └── instructor  → User (ObjectId ref)
```

`Mongoose.populate()` is used to resolve course and instructor details on lecture reads.

---

## Scalability Approach

Because the codebase is modular (each domain has its own model/controller/routes/API-slice), new modules can be added independently:

```
Backend/
├── attendance.controller.js
├── attendance.model.js
└── attendance.routes.js

Frontend/
└── Attendance pages + attendanceApi.js
```

...without touching the existing Auth, Course, or Lecture modules. Frontend and backend can also be scaled/redeployed independently since they're fully decoupled services communicating over REST.

---

## Source Code

GitHub Repository: https://github.com/Partime-Coder/lecture-scheduling-system

---

## Project Submission

This package includes:

- Live frontend URL
- Live backend URL
- Source code repository
- Admin/instructor login credentials
- Screen recording
- Database dump
- This README

---

## Author

**Sujal Bhagat**
MERN Stack Developer

GitHub: https://github.com/Partime-Coder
Portfolio: https://partime-coder.github.io/DeveloperPortfolioWebsite/

---

## Development Note

AI tools were used during this project for UI code to save time

Due to the fixed assignment timeline, some secondary functionality — particularly certain **update/edit flows** — was not completed to the same depth as the core features (authentication, role-based access, course/lecture creation, and clash-validated scheduling), which were prioritized to meet the submission deadline.