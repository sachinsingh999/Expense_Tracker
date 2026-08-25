# 💎 Finora — Smart Personal Finance & Expense Tracker

> **Your finances, simplified.**  
> Finora is a full-stack, real-time personal finance tracker designed for tracking daily expenses, logging income streams, analyzing spending breakdown, setting savings goals, and exporting financial data.

---

## 🌟 Key Features

- **📊 Comprehensive Financial Dashboard**: Real-time total expenses, monthly spending caps, net cashflow indicators, and recent transaction feeds.
- **💳 Expense & Income Logging**: Categorized transaction tagging (Food, Bills, Transport, Freelance, Salary, Investments) with quick payment mode badges (UPI, Cash, Credit Card, Bank Transfer).
- **🎯 Financial Savings Goals**: Track progress toward custom savings goals with progress bars and instant deposit fund modals.
- **📈 Spending Analytics & CSV Export**: Category breakdown metrics with one-click CSV export for tax filing and personal backup.
- **🌓 Dynamic Light & Dark Theme**: Sleek slate dark mode and clean light theme support with zero layout shift.
- **📱 Overlapping Mobile Menu Overlay**: Floating navigation drawer optimized for mobile viewports.
- **🔒 Enterprise Security**: JWT (JSON Web Token) authentication, bcrypt password hashing, and git-ignored secret environments.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router DOM v7, Framer Motion, Lucide Icons, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Deployment**: Vercel ready with custom `vercel.json` SPA rewrite configuration

---

## 📁 Repository Structure

```text
Expense_Tracker/
├── client/                 # React Vite Frontend Application
│   ├── public/             # Static Assets & Finora Logos
│   ├── src/
│   │   ├── components/     # Reusable Components (Navbar, Modals, Toast)
│   │   ├── context/        # React Context (AuthContext, ThemeContext, ExpenseContext)
│   │   ├── pages/          # Pages (Dashboard, AddExpense, MyExpense, Income, Analytics, Goals, Settings)
│   │   └── config.js       # Dynamic API Endpoint Configuration
│   ├── package.json
│   └── vercel.json         # Vercel SPA Routing Configuration
├── server/                 # Express Node.js Backend REST API
│   ├── controllers/        # Route Handlers (auth, expenses, income, goals)
│   ├── middleware/         # JWT Auth Middleware
│   ├── models/             # Mongoose Schemas (User, Expense, Income, Goal)
│   ├── routes/             # Express API Routers
│   ├── server.js           # Server Entry Point & MongoDB Connection
│   └── package.json
├── vercel.json             # Root Vercel Build Trigger Configuration
└── README.md
```

---

## 🔒 Security & Environment Setup

Environment variables contain sensitive database credentials and JWT keys. **Never commit `.env` files to public repositories.**

### 1. Server Environment (`server/.env`)
Create a `.env` file inside the `server/` directory:

```env
PORT=4000
MONGO_DB_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### 2. Client Environment (`client/.env`)
Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:4000
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database account or local MongoDB instance.

### 1. Clone Repository
```bash
git clone https://github.com/sachinsingh999/Expense_Tracker.git
cd Expense_Tracker
```

### 2. Start Backend Server
```bash
cd server
npm install
npm run dev
```
*Server will start running on `http://localhost:4000`.*

### 3. Start Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*Client will start running on `http://localhost:5173`.*

---

## 📑 API Endpoints Reference

| Method | Endpoint Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | ❌ No | Register new user account |
| `POST` | `/api/auth/login` | ❌ No | Authenticate user & return JWT token |
| `GET` | `/api/auth/profile` | 🔒 Yes | Fetch current user profile |
| `PUT` | `/api/auth/budget` | 🔒 Yes | Update monthly spending budget cap |
| `GET` | `/api/expenses/` | 🔒 Yes | Retrieve all logged expenses |
| `POST` | `/api/expenses/` | 🔒 Yes | Add a new expense record |
| `DELETE` | `/api/expenses/:id` | 🔒 Yes | Delete expense record |
| `GET` | `/api/income/` | 🔒 Yes | Retrieve all income records |
| `POST` | `/api/income/` | 🔒 Yes | Log new income entry |
| `GET` | `/api/goals/` | 🔒 Yes | Retrieve user savings goals |
| `PUT` | `/api/goals/:id/contribute` | 🔒 Yes | Deposit funds into savings goal |

---

## ☁️ Deployment Guide

### Deploying Client to Vercel
1. Import the `Expense_Tracker` repository on [Vercel](https://vercel.com).
2. Set Root Directory to `client`.
3. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend server URL.
4. Deploy! Single-page app routing is handled automatically by `client/vercel.json`.

---

## 📜 License & Copyright

© 2026 **Finora** — All rights reserved. Built with React, Node.js & Express.
