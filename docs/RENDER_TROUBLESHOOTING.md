# Render Deployment Troubleshooting

This guide addresses common issues encountered when deploying the Business AI Assistant to Render.

## 1. "Not Found" (404) on Refresh or Direct Link (Frontend)

**Symptoms:**
- You can access the home page (`/`), but refreshing on `/dashboard` or `/login` gives a "Not Found" error.
- Direct links to `/chat-test` fail.

**Cause:**
This is a Single Page Application (SPA). The server attempts to find a file named `login` or `dashboard` instead of serving `index.html` and letting React handle the routing.

### **Solution: Add a Rewrite Rule**

If you created your service manually (not using Blueprints), you **MUST** configure this in the Render Dashboard. `render.yaml` will be ignored.

1.  Go to your **Render Dashboard**.
2.  Click on your **Frontend Static Site** service.
3.  In the sidebar, click **"Redirects/Rewrites"**.
4.  Click **"Add Rule"** and enter exactly:
    *   **Source:** `/*`
    *   **Destination:** `/index.html`
    *   **Action:** `Rewrite` (NOT Redirect)
5.  Click **"Save Changes"**.

Try refreshing your page after 1 minute.

---

## 2. Puppeteer Error: "Could not find Chrome" (Backend)

**Symptoms:**
- Scraping fails with `Error: Could not find Chrome (ver. ...)`
- Logs show `Failed to scrape URL with Puppeteer`.

**Cause:**
Render's environment does not have Chrome installed by default, or Puppeteer is looking in the wrong cache location.

### **Solution 1: Postinstall & Cache Config (Recommended)**

We have already applied this fix in the codebase:
1.  **`package.json`**: Contains `"postinstall": "npx puppeteer browsers install chrome"`.
2.  **`.puppeteerrc.cjs`**: Forces cache to `backend/.cache/puppeteer`.

**Action Required:**
You must **Clear Build Cache** to make these changes take effect.
1.  Go to your **Backend Service** in Render.
2.  Click **"Manual Deploy"** -> **"Clear Build Cache & Deploy"**.

### **Solution 2: Environment Variables (Fallback)**

If the above doesn't work, ensure these Environment Variables are set in the Dashboard:
*   `PUPPETEER_CACHE_DIR`: `/opt/render/project/src/.cache/puppeteer`
*   `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: `false`

---

## 3. Connection Error: "MongoServerError: bad auth : Authentication failed"

**Cause:**
- Wrong IP Whitelist in MongoDB Atlas.
- Special characters in Password not URL-encoded.

**Solution:**
1.  **Whitelist 0.0.0.0/0**: In MongoDB Atlas -> Network Access -> Add IP Address -> `0.0.0.0/0`.
2.  **Check Connection String**: Ensure `MONGODB_URI` in Render Env Vars matches the format:
    `mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DBNAME>?retryWrites=true&w=majority&ssl=true`
