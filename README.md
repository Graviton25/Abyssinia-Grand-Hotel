# 🏨 Abyssinia Grand Hotel

<p align="center">
  <strong>A modern full-stack hotel reservation and management platform.</strong>
</p>

<p align="center">
  <a href="https://abyssinia-grand-hotel.onrender.com">🌐 Live Demo</a> •
  <a href="https://github.com/Graviton25/Abyssinia-Grand-Hotel">💻 GitHub Repository</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/Authentication-JWT-000000?style=for-the-badge">
  <img src="https://img.shields.io/badge/Status-Live-2EA44F?style=for-the-badge">
</p>

---

## ✨ Overview

**Abyssinia Grand Hotel** is a full-stack hotel reservation and management platform designed to provide guests with a premium digital hotel experience while giving administrators practical tools for managing reservations, services, and guest communication.

The project combines a responsive frontend with a Node.js/Express REST API, JWT authentication, role-based authorization, reservation validation, hotel service requests, and an administrative dashboard.

It was built as a portfolio project to demonstrate practical full-stack development, API design, authentication, validation, testing, Git workflows, and deployment.

---

## 🌐 Live Demo

### 👉 [Visit Abyssinia Grand Hotel](https://abyssinia-grand-hotel.onrender.com)

**Source Code:**  
https://github.com/Graviton25/Abyssinia-Grand-Hotel

---

## 🎯 Project Goals

- Provide guests with a smooth online hotel experience
- Allow users to browse rooms and hotel services
- Enable authenticated reservations
- Prevent conflicting room bookings
- Provide guests with a personal stay dashboard
- Allow administrators to manage reservations
- Manage hotel service requests
- Demonstrate secure authentication and authorization
- Build a responsive cross-device experience
- Deploy a complete full-stack application

---

# 🚀 Features

## 🏨 Guest Experience

### Room Discovery

Guests can:

- Browse hotel rooms
- Filter room categories
- View room prices
- View room capacity
- Read room descriptions
- Explore premium accommodations

### 📅 Reservations

The booking system supports:

- Room selection
- Check-in and check-out dates
- Guest count
- Availability validation
- Automatic night calculation
- Automatic booking totals
- Double-booking prevention
- Reservation status tracking

### 👤 Guest Account

Authenticated users can:

- Create an account
- Sign in securely
- View their profile
- View reservations
- Cancel reservations
- View service requests

---

# 🍽️ Hotel Services

| Service | Description |
|---|---|
| 🍽️ Grand Restaurant | Dining and restaurant services |
| ☕ Abyssinia Café | Coffee and refreshments |
| 🥂 Royal Lounge | Premium lounge experience |
| 🛎️ Room Service | In-room dining and assistance |
| 🍳 Breakfast | Breakfast service |
| 🎉 Private Dining & Events | Events and private experiences |
| 👔 Laundry & Dry Cleaning | Guest laundry services |
| ✈️ Airport Transfer | Airport transportation |

Guests can submit service requests directly through the application.

---

# 👨‍💼 Admin Dashboard

The platform includes a protected administrative dashboard.

Administrators can:

- 📊 View hotel statistics
- 📅 Monitor reservations
- 👤 View guest information
- 🔄 Update reservation statuses
- 🛎️ Monitor service requests
- 🔄 Update service-request statuses
- 💬 Review guest messages
- 📈 Monitor hotel activity

Admin functionality is protected with authentication and role-based authorization.

---

# 🔐 Authentication & Security

Security was considered throughout the application.

### Authentication

- Secure registration
- Password hashing with **bcryptjs**
- JWT-based authentication
- Token expiration
- Protected API endpoints
- Role-based authorization
- Protected administrator routes

### Environment Configuration

The JWT signing secret is provided through an environment variable:

```env
JWT_SECRET=your-strong-secret
```

Production secrets should never be committed to GitHub.

---

# 🧠 Reservation Logic

Before creating a reservation, the backend validates:

```
Room exists
     ↓
Valid dates
     ↓
Guest count within capacity
     ↓
Room available
     ↓
Calculate nights
     ↓
Calculate total
     ↓
Create reservation
```

The backend also prevents overlapping reservations for the same room.

This ensures that conflicting reservations cannot be created for the same room.

---

# 🛠️ Technology Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Responsive design
- CSS animations
- Interactive UI components

### Backend

- Node.js
- Express.js
- REST API
- CORS
- JWT
- bcryptjs

### Storage

- JSON-based persistence
- File-based data storage

### Development

- Git
- GitHub
- npm
- Termux
- Android development environment

### Deployment

- Render
- GitHub

---

# 📡 REST API

## Public

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/rooms` | List all rooms |
| GET | `/api/rooms/:id` | Get room details |

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/me` | Current authenticated user |

## Guest

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/me` | Guest bookings |
| DELETE | `/api/bookings/:id` | Cancel booking |
| POST | `/api/service-requests` | Create service request |
| GET | `/api/service-requests/me` | Guest service requests |
| POST | `/api/contact` | Submit message |

## Administration

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/bookings` | Manage bookings |
| PATCH | `/api/admin/bookings/:id/status` | Update booking |
| GET | `/api/admin/service-requests` | Manage services |
| PATCH | `/api/admin/service-requests/:id/status` | Update service |
| GET | `/api/admin/messages` | View messages |
| PATCH | `/api/admin/messages/:id` | Update message |

---

# 📁 Project Structure

```text
Abyssinia-Grand-Hotel/
│
├── backend/
│   ├── create-admin.js
│   └── server.js
│
├── data/
│   └── db.json
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# ⚙️ Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/Graviton25/Abyssinia-Grand-Hotel.git
cd Abyssinia-Grand-Hotel
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure JWT Secret

For local development:

```bash
export JWT_SECRET="your-strong-secret"
```

For production, configure `JWT_SECRET` through your hosting provider.

## 4. Start the application

```bash
npm start
```

Open:

```
http://127.0.0.1:3000
```

---

# 👨‍💼 Administrator Setup

Create an administrator account with:

```bash
node backend/create-admin.js EMAIL PASSWORD NAME
```

Example:

```bash
node backend/create-admin.js admin@example.com StrongPassword "Hotel Administrator"
```

**Never commit administrator credentials or passwords to the repository.**

---

# ☁️ Deployment

The application is deployed as a Node.js web service.

### Build Command

```bash
npm install
```

### Start Command

```bash
npm start
```

### Environment Variable

```
JWT_SECRET
```

### Production Application

https://abyssinia-grand-hotel.onrender.com

> GitHub stores the source code while Render runs the Node.js/Express application.

---

# 💾 Data Persistence

The current version uses:

```
data/db.json
```

This lightweight approach was chosen because it:

- Avoids native database dependencies
- Works well in Termux/Android
- Keeps local development simple
- Makes the project portable
- Is suitable for a portfolio/demo application

For production-scale usage, the recommended upgrade is **PostgreSQL or another managed database**.

---

# 🧪 Testing & Validation

Major application workflows have been tested.

### API

- ✅ Health endpoint
- ✅ Room endpoints
- ✅ Registration
- ✅ Login and JWT authentication
- ✅ User profile

### Reservations

- ✅ Booking creation
- ✅ Date validation
- ✅ Guest capacity validation
- ✅ Availability validation
- ✅ Double-booking prevention
- ✅ Booking retrieval
- ✅ Booking cancellation

### Services

- ✅ Service catalogue
- ✅ Service requests
- ✅ Service request retrieval

### Administration

- ✅ Admin authentication
- ✅ Admin statistics
- ✅ Reservation management
- ✅ Service management
- ✅ Message management
- ✅ Role-based authorization

### Deployment

- ✅ GitHub repository
- ✅ Production environment
- ✅ Render deployment
- ✅ Live application

---

# 📸 Screenshots

Screenshots can be added to showcase the interface.

Recommended sections:

- Homepage
- Room Catalogue
- Booking Interface
- Guest Dashboard
- Service Requests
- Admin Dashboard

Example:

```md
![Homepage](screenshots/homepage.png)
```

---

# 🔮 Roadmap

- [ ] PostgreSQL database
- [ ] Online payment integration
- [ ] Email booking confirmations
- [ ] Password reset
- [ ] Advanced availability calendar
- [ ] Real-time notifications
- [ ] Cloud image storage
- [ ] Hotel analytics
- [ ] Multi-language support
- [ ] Custom domain
- [ ] Automated testing
- [ ] CI/CD pipeline
- [ ] Advanced admin controls

---

# 💡 Portfolio Highlights

This project demonstrates practical experience with:

### Frontend Development
- Responsive interfaces
- Interactive components
- UI state management
- Form handling

### Backend Development
- REST API design
- Express routing
- Authentication
- Authorization
- Data validation

### Security
- Password hashing
- JWT authentication
- Protected routes
- Role-based access control
- Environment-based secrets

### Software Engineering
- Git version control
- GitHub workflows
- Project organization
- API testing
- Production deployment

---

# 👨‍💻 Author

## Nathnael Andualem

**Civil Engineering Student & Developer**

I enjoy building practical software solutions and exploring the intersection between engineering, technology, and modern software development.

### GitHub

[@Graviton25](https://github.com/Graviton25)

---

# ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  <strong>🏨 Abyssinia Grand Hotel</strong>
  <br>
  Built with Node.js, Express, JavaScript and a passion for building real-world software.
</p>
