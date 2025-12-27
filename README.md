# 🎓 Edugate-Portal
### 🚀 University Management System Backend

A robust Node.js backend for managing educational institutions, featuring real-time notifications, admin dashboards, and secure authentication.

---

## 🛠 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose)
* **Real-time:** Socket.io
* **Authentication:** JWT & Bcrypt

---

## 🌟 Key Features
* **Admin Dashboard:** Comprehensive control over admissions, course management, and fee structures.
* **Real-time Updates:** Socket.io integration for instant admin notifications.
* **Academic Management:** Manage courses, sessions, notices, and college events.
* **Student Portal:** Specialized routes for student-specific data and profile management.
* **Inquiry System:** Handle potential student enquiries directly through the platform.

---

## 📂 Project Structure
```text
├── src/
│   ├── config/      # Database connection & configurations
│   ├── middleware/  # Auth guards, validation & Error handling
│   ├── models/      # Mongoose schemas (Data structure)
│   ├── routes/      # API Endpoints definition
│   └── controllers/ # Business logic for routes
├── .env             # Environment variables (Private)
└── server.js        # Server entry point & Socket.io setup
