# 🎮 VideogameStoreACG

A **videogame e-commerce system** developed as a **full-stack portfolio project**, focused on clean architecture, security, role-based access, and cloud deployment.

📅 **December 2025 – Present**

🔗 **Live Demo:**  
👉 https://videogamestoreacg.web.app/

---

## 📸 Screenshots

### Home / Product Catalog
![Home Screen](./screenshots/home.png)

## 🚀 Tech Stack

### Backend
- ASP.NET Web API  
- Entity Framework Core  
- SQL Server  
- JWT Authentication  
- Role-based Authorization (User / Admin)

### Frontend
- React  
- TypeScript  
- Vite  
- Axios  

### Third-Party Services
- **RAWG API** – Videogame data autocomplete  
- **Stripe** – Payment flow simulation and order creation  

### Deployment
- **Azure Web Apps** – Backend  
- **Firebase Hosting** – Frontend  

---

## 🔐 Authentication & Authorization

- User registration and login using JWT
- Session persistence
- Role-based UI rendering
- Protected routes
- Admin-only features

---

## 🛒 Core Features

- Videogame catalog with pagination
- Shopping cart with **sidebar** and **fullscreen** modes
- Add, remove, and update cart items
- Simulated checkout using Stripe
- Automatic order creation
- User purchase history
- CRUD operations for videogames (admin only)
- CRUD operations for users (admin only)
- Search, filter, and sort videogames

---

## 🔍 Search & Filtering

- Search by videogame name
- Sorting options:
  - Alphabetical
  - Price (ascending / descending)
- Filters:
  - Genres
  - Platforms

---

## 🔗 Integrations

### RAWG API
- Autocomplete videogame data when creating a new product
- Fetches:
  - Description
  - Cover image
  - Genres
  - Platforms

### Stripe
- Payment process simulation
- Payment confirmation
- Order creation
- Cart cleanup after successful checkout

---

## 🧭 Navigation

The navigation bar allows access to:

- Home
- My Orders
- Cart
- My Account
- User Management *(admin only)*
- Sales Reports *(in progress)*
- Promotions Management *(in progress)*

---

## 🖥️ Screens Overview

### 🏠 Home
- Videogames displayed as cards
- Displayed information:
  - Cover image
  - Title
  - Price and currency
- Actions:
  - Add / remove from cart
  - Disabled button when out of stock
- Admin-only actions:
  - Create
  - Edit
  - Delete videogames
- Paginated results

---

### 📦 My Orders
- User order history
- Sorting options:
  - Date (newest / oldest)
  - Total price (highest / lowest)
- Paginated list

---

### 🛒 Cart
- Fullscreen cart view
- Features:
  - Increase / decrease quantity
  - Remove items
  - Dynamic total calculation

---

### 👤 My Account
- View account details:
  - Email
  - Username
  - Assigned roles
- Change password functionality

---

### 🛠️ User Management (Admin Only)
- Full list of registered users
- Displayed information:
  - Username
  - Email
  - Roles
- Actions:
  - Enable or disable admin role

---

## 🧪 Project Status

🚧 **Actively under development**

Planned features:
- Sales reports
- Promotions and discounts system
- UX/UI improvements
- Performance optimization
- Unit and integration testing

---

## 🎯 Project Purpose

This project was built for **educational and portfolio purposes**, aiming to demonstrate skills in:

- Backend development with .NET
- RESTful API design
- JWT-based security
- Frontend development with React
- External API integrations
- Cloud deployment
