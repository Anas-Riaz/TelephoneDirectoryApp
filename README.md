<div align="center">

# 📇 Employee Directory App



[![React](https://img.shields.io/badge/Frontend-ReactJS-61DBFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQL Server](https://img.shields.io/badge/Database-Microsoft_SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)](https://learn.microsoft.com/en-us/sql/sql-server/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Thunder Client](https://img.shields.io/badge/API_Testing-Thunder_Client-2B9FD6?style=for-the-badge&logo=thunderclient&logoColor=white)](https://www.thunderclient.com/)

> A full-stack **Employee Management System** built during my internship to handle employee data, departments, designations, and IP extensions with a clean, scalable backend and a responsive React frontend.

</div>

---

## 🧠 Project Overview

The **Employee Directory App** provides an efficient way to manage organization-wide employee records.  
Admins can register, log in securely, and perform CRUD operations on employees, departments, and designations.  
The app follows clean architecture and uses SQL Server as a robust relational database.


---

## 🚀 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React.js, React Router DOM, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | Microsoft SQL Server (SQL Server Express) |
| **Authentication** | JSON Web Tokens (JWT) + bcrypt |
| **Environment Management** | dotenv |
| **API Testing** | Thunder Client / Postman |

---

## 🧩 Features

✅ **Employee Management** — Add, edit, delete, and view employees  
✅ **Department & Location Tables** — Separate normalized tables for data consistency  
✅ **Admin Authentication** — Secure registration and login using JWT  
✅ **Search & Filter** — Find employees by name, department, or location  
✅ **Clean Modular Architecture** — Structured Express routes and controllers  
✅ **Environment Configurable** — Manage all secrets through `.env`  

---

## 🗃️ Database Schema Overview

### 🧑‍💼 `Admins`
| Column | Type | Description |
|---------|------|-------------|
| AdminID | INT (PK, IDENTITY) | Unique ID |
| Username | NVARCHAR(100) | Admin name |
| PasswordHash | NVARCHAR(255) | Hashed password |

### 👨‍💻 `Employee`
| Column | Type | Description |
|---------|------|-------------|
| EmpNo | INT (PK, IDENTITY) | Employee Number |
| Name | NVARCHAR(100) | Employee Name |
| DepartmentID | INT (FK) | References Department |
| DesignationID | INT (FK) | References Designation |
| LocationID | INT (FK) | References Location |
| Email | NVARCHAR(255) UNIQUE | Employee Email |
| Source | NVARCHAR(100) | Data Source |

Other supporting tables:  
`Department`, `Designation`, `Location`, `EmployeeIP`, and `IPExtension`.

---
### API Endpoints:

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/api/admin/register` | Register new admin  |
| POST   | `/api/admin/login`    | Admin login         |
| GET    | `/api/employees`      | Fetch all employees |
| POST   | `/api/employees`      | Add new employee    |
| PUT    | `/api/employees/:id`  | Update employee     |
| DELETE | `/api/employees/:id`  | Delete employee     |


---

### ⚙️ Setup Instructions

## 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/EmployeeDirectoryApp.git
cd EmployeeDirectoryApp
```

---
### 2️⃣ Install Dependencies
## Backend
```bash
cd backend
npm install
npm install express
npm install dotenv bcrypt jsonwebtoken
```

---
## Frontend
```bash
cd frontend
npm install
npm install axios
npm install react-router-dom
```

---
### 3️⃣ Create Environment File
In /backend directory, create a .env file:

```bash
DB_USER=sa
DB_PASSWORD=YourPasswordHere
DB_NAME=EmployeeDirectory
DB_SERVER=YOUR-PC\SQLEXPRESS
DB_PORT=1433
DB_ENCRYPT=false
JWT_SECRET=EMPDIRKEY1888
```
⚠️ If using SQL Server Express, ensure TCP/IP is enabled via
SQL Server Configuration Manager → Protocols for SQLEXPRESS → Enable TCP/IP,
then restart the SQL service.

---

### 4️⃣ Run the App
Backend
```bash
cd server
npm start
```

Frontend
```bash
cd client
npm run dev
```

Then open your browser at 👉 http://localhost:3000

---


🧑‍💻 Developer

👤 Anas-Riaz
Frontend Developer | MERN Stack Enthusiast
💼 Internship Project

📧 anasriazf@example.com

---

### 🏗️ Future Enhancements

🔐 Role-based access control (Admin/User)

🌗 Dark mode toggle

🧾 Employee profile pictures

☁️ Cloud deployment (Render / Azure / Vercel)

📨 Email notifications for employees


<div align="center">
🏁 Thank you for checking out my project! 🙌

Designed, built, and optimized with ❤️ by Anas Riaz

</div>

