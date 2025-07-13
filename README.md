# WebScan Pro – Website Crawler Dashboard

**WebScan Pro** is a modern full-stack web application designed to crawl and analyze websites. It provides a clean dashboard to:

- ✅ Submit URLs for scanning  
- 🔍 Detect internal, external, and broken links  
- 🌐 Identify HTML version and presence of login forms  
- 📊 Track crawling status in real time  
- 📑 View detailed reports and analytics  

---

## ⚙️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Material UI (MUI), Recoil  
- **Backend**: Go (Gin, GORM), RESTful API  
- **Database**: MySQL 8 via Docker  
- **Deployment**: Docker & Docker Compose  

---

## 📁 Project Structure

```bash
.
├── backend/                # Go backend
├── frontend/               # React frontend
├── docker-compose.yml      # MySQL container
├── README.md
```

---

## 🧠 Features

- 📤 URL submission with queueing and tracking  
- 🧮 Internal / External / Broken link stats  
- 🔐 Login form detection  
- 🧹 Filtering, search, and bulk actions (re-analyze, cancel, delete)  
- 📈 Link breakdown via pie chart  
- 🖥️ Fully responsive & accessible UI  

---

## 🔧 Backend Setup (Go)

### 1. Prerequisites

- **Go ≥ 1.21**  
  Install from: https://go.dev/dl  
- **Docker & Docker Compose**  
  Install from: https://www.docker.com/products/docker-desktop  

### 2. Clone the Repository

```bash
git clone https://github.com/Abishek2/website-crawler-dashboard.git
cd website-crawler-dashboard
```

### 3. Start MySQL with Docker

```bash
docker-compose up -d
```

- MySQL root password: `root`  
- Database name: `crawler`  
- MySQL exposed on port: `3306`  

To check if container is running:

```bash
docker ps
```

### 4. Start the Backend Server

```bash
cd backend
go mod tidy        # Installs all necessary Go dependencies
go run main.go     # Starts server on http://localhost:8080
```

### 5. API Endpoints

| Method | Endpoint              | Description              |
|--------|------------------------|--------------------------|
| GET    | `/health`             | Health check             |
| GET    | `/urls`               | Get all submitted URLs   |
| POST   | `/urls`               | Submit a new URL         |
| GET    | `/urls/:id`           | Get details of a URL     |
| POST   | `/urls/:id/reanalyze` | Re-analyze a URL         |
| POST   | `/urls/:id/cancel`    | Cancel a URL analysis    |
| DELETE | `/urls/:id`           | Delete a URL             |

---

## 🌐 Frontend Setup (React + Vite)

### 1. Prerequisites

- **Node.js ≥ 18**  
  Download from: https://nodejs.org/en/download  

- **Package Manager**: `npm` or `yarn`

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)  
Ensure the backend is running on: `http://localhost:8080`

---


```
## 🖼️ Screenshots

### Dashboard View  
![Dashboard](https://raw.githubusercontent.com/Abishek2/website-crawler-dashboard/main/docs/screenshots/dashboard.png)


```

---

## 🧪 Health Check

Check backend health:

```bash
curl http://localhost:8080/health
```

Expected output:

```json
{"status": "ok"}
```

---

## 💡 Notes for All OS Users

- ✅ **Linux/macOS**: Use terminal commands as provided.
- 🪟 **Windows**: Use PowerShell or Git Bash.
- 🧰 **Docker Desktop users**: Ensure container ports do not conflict with existing services.

---

## 🧼 Cleanup

Stop and remove MySQL container:

```bash
docker-compose down
```

Remove volume data:

```bash
docker-compose down -v
```

---

## 📚 License

This project is for educational and demonstration purposes.  
Feel free to fork, modify, and extend it.

---

## ✍️ Author

**Abishek Anilkumar**  
Developed as part of the Full Stack Developer assessment at **Sykell**.

