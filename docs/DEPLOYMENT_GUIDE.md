# Deployment Guide

## 🚀 Overview

This guide covers deployment strategies for the Business AI Assistant:
1.  **Local Development**: For coding and testing.
2.  **Render (Testing)**: Free tier hosting for live previews.
3.  **Hostinger VPS (Production)**: Full production setup with Nginx and PM2.

---

## 💻 1. Local Development Setup

### Prerequisites
- Node.js >= 20.0.0
- MongoDB installed locally or MongoDB Atlas URI
- Git

### Steps
1.  **Clone Repository**
    ```bash
    git clone https://github.com/g3k0ch4mps-dotcom/Pam_Ai_Final.git
    cd Pam_Ai_Final
    ```

2.  **Install Dependencies**
    ```bash
    npm run install:all
    ```

3.  **Configure Environment**
    - Copy `.env.example` to `.env` in `backend/` and `frontend/`.
    - Fill in `MONGODB_URI`, `OPENAI_API_KEY`, etc.

4.  **Run Application**
    ```bash
    npm run dev
    ```
    This command starts both Backend (`localhost:3000`) and Frontend (`localhost:5173`) concurrently.

---

## ☁️ 2. Render Deployment (Testing)

The project includes a `render.yaml` file for Infrastructure-as-Code deployment on Render.

### Steps
1.  Connect your GitHub repository to Render.
2.  Select "Blueprints" and choose the repository.
3.  Render will detect `render.yaml` and prompt to create:
    - **Web Service** (Backend)
    - **Static Site** (Frontend)
4.  **Environment Variables**:
    - You must manually override sensitive variables in the Render Dashboard:
    - `MONGODB_URI`
    - `OPENAI_API_KEY`
    - `JWT_SECRET`
    - `FRONTEND_URL` (after frontend is deployed)

---

## 🏢 3. Hostinger VPS Deployment (Production)

### Server Requirements
- OS: Ubuntu 22.04 LTS (recommended)
- RAM: 1GB minimum
- Node.js v20.x installed
- Nginx installed
- MongoDB (if local) or Atlas (cloud)

### Step 3.1: Server Preparation
SSH into your VPS:
```bash
ssh user@your-ip
```

Install Node.js & Nginx:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
npm install -g pm2
```

### Step 3.2: Application Setup
Clone and install:
```bash
git clone https://github.com/g3k0ch4mps-dotcom/Pam_Ai_Final.git
cd Pam_Ai_Final
npm run install:all
```

Build Frontend:
```bash
cd frontend
npm run build
# Dist folder is now at frontend/dist
```

### Step 3.3: PM2 Configuration (Backend)
Create `ecosystem.config.js` in root (if not present):
```javascript
module.exports = {
  apps: [{
    name: "business-ai-api",
    script: "./backend/src/server.js",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};
```

Start Backend:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 3.4: Nginx Configuration
Create `/etc/nginx/sites-available/business-ai`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend (Static Files)
    location / {
        root /var/www/business-ai/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend (API Proxy)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/business-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 3.5: SSL Setup (Certbot)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 🔄 Monitoring & Maintenance
- **Logs**: `pm2 logs business-ai-api`
- **Uptime**: UptimeRobot checking `/api/health`
