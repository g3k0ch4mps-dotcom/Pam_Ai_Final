# API Error Codes & Handling

## Overview

The Business AI Assistant API uses standard HTTP status codes and a consistent JSON error response format. This guide helps you understand and handle errors effectively.

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": ["Optional array of strings with more detail"]
  }
}
```

---

## HTTP Status Codes

| Code | Title | Description |
|------|-------|-------------|
| 400 | Bad Request | The request was invalid or missing required fields. |
| 401 | Unauthorized | Authentication is required or the token is invalid. |
| 403 | Forbidden | You do not have permission to access the resource. |
| 404 | Not Found | The requested resource or route does not exist. |
| 409 | Conflict | The request conflicts with current state (e.g., duplicate email). |
| 422 | Unprocessable Entity | Valid request but cannot be processed (e.g., scraping failure). |
| 429 | Too Many Requests | Rate limit exceeded. |
| 500 | Internal Server Error | An unexpected server-side error occurred. |

---

## Error Codes Reference

### Authentication Errors

| Code | Status | Description |
|------|--------|-------------|
| `AUTH_REQUIRED` | 401 | No Authorization header or token provided. |
| `INVALID_TOKEN` | 401 | The provided JWT token is malformed or invalid. |
| `TOKEN_EXPIRED` | 401 | The JWT token has expired. User must log in again. |
| `USER_NOT_FOUND` | 401 | The user associated with the token no longer exists. |
| `INVALID_CREDENTIALS`| 401 | Incorrect email or password. |
| `EMAIL_EXISTS` | 409 | Attempting to register with an already registered email. |
| `TOO_MANY_LOGIN_ATTEMPTS` | 429 | Exceeded maximum login attempts (10 per hour). |

### Permission & Authorization Errors

| Code | Status | Description |
|------|--------|-------------|
| `MISSING_BUSINESS_ID`| 400 | Business context is missing from request. |
| `ACCESS_DENIED` | 403 | User is not a member of the requested business. |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks the required role (e.g., admin or owner). |
| `ROLE_MISSING` | 403 | User role context is missing from the request. |

### Validation & Request Errors

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed (see `details` for fields). |
| `MISSING_FIELDS` | 400 | Required body fields are missing. |
| `INVALID_URL` | 400 | Provided URL is malformed or invalid protocol. |
| `ROUTE_NOT_FOUND` | 404 | The requested API route does not exist. |
| `TOO_MANY_REQUESTS` | 429 | Global rate limit exceeded (100 per 15 mins). |

### Document & Scraping Errors

| Code | Status | Description |
|------|--------|-------------|
| `NO_FILE` | 400 | No file found in `multipart/form-data` request. |
| `FILE_TOO_LARGE` | 400 | Uploaded file exceeds the 5MB limit. |
| `INVALID_FILE` | 400 | Unsupported file type (supported: PDF, DOCX, TXT, CSV, MD). |
| `SCRAPE_FAILED` | 422 | Failed to extract content from the provided URL. |
| `INSUFFICIENT_CONTENT`| 422 | Scraped content is too short or empty. |
| `REFRESH_FAILED` | 422 | Failed to update existing URL content. |
| `URL_EXISTS` | 409 | This URL has already been added to the knowledge base. |

### Server Errors

| Code | Status | Description |
|------|--------|-------------|
| `INTERNAL_SERVER_ERROR` | 500 | An unhandled error occurred on the server. |
| `SERVER_ERROR` | 500 | Database or service-level failure. |
| `CHAT_FAILED` | 500 | AI service failed to generate a response. |

---

## Handling Errors

### In the Browser (Frontend)

```javascript
try {
  const response = await fetch('/api/documents/upload', { ... });
  const data = await response.json();

  if (!response.ok) {
    if (data.error.code === 'TOKEN_EXPIRED') {
      // Redirect to login
    }
    throw new Error(data.error.message);
  }
} catch (error) {
  console.error(error.message);
}
```

### Rate Limiting

The API implements several levels of rate limiting:
- **Global**: 100 requests per 15 minutes per IP.
- **Auth**: 10 login/register requests per hour per IP.
- **Scraping**: 10 URL scrapes per hour per business.

If you receive a `429` status, check the `Retry-After` header for when you can resume requests.
