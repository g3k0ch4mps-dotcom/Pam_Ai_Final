# API Documentation Guide

This directory contains the complete technical documentation for the Business AI Assistant API.

## 📂 Files Included

| File | Purpose | Audience |
|------|---------|----------|
| **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** | Comprehensive human-readable guide | Developers, Integrators |
| **[openapi.yaml](./openapi.yaml)** | OpenAPI 3.0 Specification (Swagger) | Automated Tools, Code Generators |
| **[postman_collection.json](./postman_collection.json)** | Postman Collection for testing | QA, Developers |
| **[README_API_DOCS.md](./README_API_DOCS.md)** | This file | Everyone |

## 🚀 How to Use

### 1. For Reading & Reference
Open [API_DOCUMENTATION.md](./API_DOCUMENTATION.md). It contains detailed explanations, examples, and error codes for every endpoint.

### 2. For Automated Tools
You can use `openapi.yaml` to:
- Generate client SDKs (e.g., using `openapi-generator`)
- Import into Swagger UI to visualize the API
- Validate API responses

### 3. For Testing (Postman)
1. Open Postman.
2. Click **Import** > **File** > Select `postman_collection.json`.
3. Checks the "Variables" tab in the collection settings:
   - `base_url`: Set to `http://localhost:3000` or your production URL.
4. Run the "Register" or "Login" request to automatically set your `token` variable.
5. You can now run protected requests like "Upload Document".

## 🛠️ Updating Documentation
If you change the API code, please ensure you update:
1. `API_DOCUMENTATION.md` manually for human readers.
2. `openapi.yaml` if you added routes or changed schemas.
3. `postman_collection.json` if you want to share new test cases.
