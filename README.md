# ClinicFlow - Healthcare Visit Management System

> A full-stack healthcare application for managing patient visits, doctor appointments, and financial tracking.


**🌐 Live Demo:** https://clinic-flow-frontend.vercel.app

**🌐 API DOC:(Just simple sample)** https://documenter.getpostman.com/view/27338446/2sBXVhDB7H


---

## 📋 Project Overview

The system provides a healthcare management platform that supports Patient, Doctor, and Finance user roles.

### **Requirements Met**
✅ Patient can login and book visits with doctors  
✅ Doctor can start visits and add medical information  
✅ Finance can review visits and billing information  
✅ Doctors limited to 1 active visit at a time  
✅ Multiple treatments per visit with automatic total calculation  
✅ Multi-field search (doctor name, patient name, visit ID)  
✅ Analytics dashboard with system statistics  

---

## 🛠️ Tech Stack

**Frontend:** React 19, React Router, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas (cloud)
**Authentication:** JWT with HttpOnly Cookies  
**Api Testing:** Postman
**Deployment:** Vercel 


---

## 🏗️ Development Approach

### **Planning & Setup**

* Defined user roles and database schema
* Structured the project using MVC
* Initialized version control
* Used a Trello board for task tracking and time management
(https://trello.com/b/4avJYsqF/clinicflow)

### **Backend**

* Implemented role-based authentication and authorization
* Built RESTful APIs with core business rules
* Added JWT authentication and visit logic

### **Frontend**

* Developed role-based dashboards with React
* Implemented authentication and visit workflows
* Added doctor and finance-specific features

### **Polish & Deployment**

* Improved UI/UX and added analytics
* Tested user flows and handled errors
* Deployed to Vercel with MongoDB Atlas


---

## 💾 Database Schema

### **Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "patient" | "doctor" | "finance"
}
```

### **Visits Collection**
```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: User),
  status: "pending" | "in-progress" | "completed",
  treatments: [
    { name: String, cost: Number, notes: String }
  ],
  totalAmount: Number,
  medicalNotes: String,
  completedAt: Date
}
```

---


## 👥 Demo Accounts

| Role | Email | Password | Username |
|------|-------|----------|----------|
| Doctor | yanal@gmail.com | 123456 | Yanal |
| Doctor | yara@gmail.com | 123456 | Yara |
| Finance | abbas@gmail.com | 123456 | abbas |
| Patient | bahaa@gmail.com | 123456 | bahaa |
| Patient | john@gmail.com | 123456 | John |
| Patient | abd@gmail.com | 123456 | Abd |

---

## 📡 Core API Endpoints

### **Authentication**
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login (sets HttpOnly cookie)
POST /api/auth/logout    - Logout
GET  /api/auth/check     - Verify authentication
```

### **Visits (Patient)**
```
GET  /api/visits/doctors      - Get all doctors
POST /api/visits              - Book a visit
GET  /api/visits/my-visits    - Get patient's visits
```

### **Visits (Doctor)**
```
GET /api/visits/active            - Get current active visit
GET /api/visits/pending           - Get pending visits queue
PUT /api/visits/:id/start         - Start a visit
PUT /api/visits/:id/add-treatment - Add treatment
PUT /api/visits/:id/notes         - Update medical notes
PUT /api/visits/:id/complete      - Complete visit
```

### **Visits (Finance)**
```
GET /api/visits                    - Get all visits
GET /api/visits/search             - Search  visits
GET /api/dashboard/stats           - Analytics data
```

---

## ✨ Key Features

### **Patient Features**
- Book visits with available doctors
- View visit history and status
- See treatment details and costs
- View completed visit summaries

### **Doctor Features**
- View pending visits 
- Manage one active visit at a time
- Add multiple treatments with costs
- Write medical notes
- Complete visits

### **Finance Features**
- Search visits by multiple criteria
- View all visit details and billing
- Access analytics dashboard
- Track revenue and statistics

### **Business Rules Implemented**
1. ✅ Doctor can have only 1 active (in-progress) visit
2. ✅ Patient can have multiple pending visits but only 1 in-progress
3. ✅ Patient cannot book same doctor twice if pending/in-progress
4. ✅ Auto-calculation of visit totals (sum of treatments)
5. ✅ Multi-field search with AND logic

---

## 🔒 Security Features

- **JWT Authentication** with 7-day expiration
- **HttpOnly Cookies** (XSS protection)
- **bcrypt Password Hashing** 
- **Role-Based Access Control** (RBAC middleware)
- **CORS** configured for specific origins
- **Environment Variables** for sensitive data

---


## 🚀 Deployment

**Live URLs:**
- Frontend: https://clinic-flow-frontend.vercel.app
- Backend: https://clinic-flow-backend.vercel.app


---

## 📝 Future Enhancements

- Payment integration
- Appointment scheduling with calendar
- Medical reports

---

## 👨‍💻 Developer

**Bahaa Abbas**  
GitHub: [@BahaaAbbas](https://github.com/BahaaAbbas)
