# MongoDB Atlas Setup Guide

## Quick Setup (5 minutes)

MongoDB Atlas is a free cloud-hosted MongoDB service. No local installation needed!

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Choose **FREE** tier (M0 Sandbox - 512MB storage)

### Step 2: Create a Cluster

1. After login, click **"Build a Database"**
2. Choose **FREE** tier (Shared - M0)
3. Select a cloud provider and region (choose closest to you)
4. Cluster Name: `business-ai-cluster` (or any name)
5. Click **"Create"** (takes 1-3 minutes)

### Step 3: Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `business-ai-admin` (or any username)
5. Password: Click **"Autogenerate Secure Password"** and **COPY IT**
6. Database User Privileges: **Atlas admin**
7. Click **"Add User"**

### Step 4: Whitelist Your IP Address

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` to whitelist
   - For production, use specific IP addresses
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string, it looks like:
   ```
   mongodb+srv://business-ai-admin:<password>@business-ai-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env File

1. Open your `.env` file
2. Replace the `MONGODB_URI` line with your connection string
3. **IMPORTANT:** Replace `<password>` with the actual password you copied in Step 3
4. Add database name to the connection string:

```bash
# Before:
MONGODB_URI=mongodb://localhost:27017/business-ai

# After (replace with your actual connection string):
MONGODB_URI=mongodb+srv://business-ai-admin:YOUR_PASSWORD_HERE@business-ai-cluster.xxxxx.mongodb.net/business-ai?retryWrites=true&w=majority
```

**Example:**
```bash
MONGODB_URI=mongodb+srv://business-ai-admin:MySecurePass123@business-ai-cluster.abc123.mongodb.net/business-ai?retryWrites=true&w=majority
```

### Step 7: Restart Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
✓ ChromaDB initialized successfully
✓ Server running on port 3000
```

---

## Alternative: Use Local MongoDB (Optional)

If you prefer to run MongoDB locally:

### Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows service automatically
4. Use connection string: `mongodb://localhost:27017/business-ai`

### macOS (with Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

---

## Troubleshooting

### Error: "MongoServerError: bad auth"
- Your password is incorrect
- Make sure you replaced `<password>` with your actual password
- Password should NOT have `<` or `>` symbols

### Error: "MongoNetworkError: connection timed out"
- Your IP address is not whitelisted
- Go to Network Access and add your IP or use `0.0.0.0/0`

### Error: "MONGODB_URI is not defined"
- Check that `.env` file exists in project root
- Make sure `MONGODB_URI` is spelled correctly
- Restart the server after changing `.env`

### Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

- `USERNAME`: Your database user (e.g., `business-ai-admin`)
- `PASSWORD`: The password you set (NO angle brackets!)
- `CLUSTER`: Your cluster address (e.g., `business-ai-cluster.abc123`)
- `DATABASE_NAME`: `business-ai` (or any name you want)

---

## Verify Connection

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-29T10:45:00.000Z",
  "uptime": 5.123,
  "services": {
    "api": "operational",
    "mongodb": "connected",
    "chromadb": "connected"
  }
}
```

---

## MongoDB Atlas Free Tier Limits

- **Storage:** 512 MB
- **RAM:** Shared
- **Connections:** 500 concurrent
- **Backup:** Not included (manual export only)
- **Cost:** **FREE** forever!

This is more than enough for development and small production apps!

---

## Next Steps

Once MongoDB is connected:
- ✅ Stage 2 complete!
- ➡️ Ready for Stage 3: Authentication System
