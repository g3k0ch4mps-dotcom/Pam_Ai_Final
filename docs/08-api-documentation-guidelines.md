# API Documentation Guidelines - Business AI Assistant

> **Project:** Business AI Assistant API  
> **Stack:** Node.js + Express + MongoDB + ChromaDB + OpenAI  
> **Standards:** REST, OpenAPI 3.0, Security-First Approach  
> **Target Audience:** Developers, Security Auditors, Integration Partners

---

## 📋 Documentation Standards

**Every API endpoint MUST include:**
1. Complete endpoint specification
2. Authentication requirements
3. Request/response examples
4. Error scenarios
5. Security considerations
6. Rate limiting information

---

## 1. API Overview

### 1.1 Metadata

```yaml
API Name: Business AI Assistant API
Version: v1.0.0
Base URL: 
  - Production: https://api.yourdomain.com/api
  - Development: http://localhost:3000/api
Protocol: HTTPS (mandatory in production)
Data Format: JSON
Authentication: JWT Bearer Token
Documentation: https://docs.yourdomain.com
Contact: support@yourdomain.com
```

### 1.2 Environments

| Environment | URL | Purpose |
|------------|-----|---------|
| Production | `https://api.yourdomain.com/api` | Live customer traffic |
| Staging | `https://staging-api.yourdomain.com/api` | Pre-production testing |
| Development | `http://localhost:3000/api` | Local development |

### 1.3 Rate Limits

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Public Chat | 10 requests | 1 hour per IP |
| Authentication | 5 attempts | 15 minutes per IP |
| File Upload | 5 uploads | 1 hour per user |
| General API | 100 requests | 15 minutes per user |

---

## 2. Authentication & Authorization

### 2.1 Authentication Method

**JWT Bearer Token** (for business admin APIs)

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Structure:**
```json
{
  "userId": "user_456def",
  "businessId": "biz_123abc",
  "role": "owner",
  "permissions": {
    "canUploadDocuments": true,
    "canDeleteDocuments": true,
    "canManageTeam": true,
    "canViewAnalytics": true,
    "canManageSettings": true
  },
  "iat": 1735468800,
  "exp": 1736073600
}
```

**Token Expiration:** 7 days

**No Authentication Required:**
- Public chat endpoints (`POST /api/public/:slug/chat`)
- Business info retrieval (`GET /api/public/:slug`)
- Health check (`GET /api/health`)

### 2.2 Authorization Model

**Permission-Based Access Control**

| Permission | Description | Required For |
|-----------|-------------|--------------|
| `canUploadDocuments` | Upload business documents | Document upload |
| `canDeleteDocuments` | Delete documents | Document deletion |
| `canManageTeam` | Add/remove team members | Team management |
| `canViewAnalytics` | View chat analytics | Analytics dashboard |
| `canManageSettings` | Modify business settings | Settings update |

**Role Hierarchy:**
```
Owner (all permissions)
  └─ Admin (all except business deletion)
      └─ Manager (document + analytics)
          └─ Staff (view only)
```

---

## 3. Endpoint Documentation Template

**Every endpoint MUST be documented using this template:**

### Endpoint Template

```markdown
## [METHOD] [PATH]

**Purpose:** Brief description of what this endpoint does

**Authentication:** Required / Not Required

**Rate Limit:** X requests per Y time period

**Permissions Required:** 
- `permissionName` (if authenticated)

### Request

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| param | type | ✅/❌ | Description |

**Query Parameters:**
| Name | Type | Required | Default | Validation | Description |
|------|------|----------|---------|-----------|-------------|
| param | type | ✅/❌ | value | rules | Description |

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | ✅ | Bearer <token> |
| Content-Type | ✅ | application/json |

**Request Body:**
```json
{
  "field": "value"
}
```

**Field Validation:**
| Field | Type | Required | Validation | Description |
|------|------|----------|-----------|-------------|
| field | type | ✅/❌ | rules | Description |

### Response

**Success (200):**
```json
{
  "success": true,
  "data": {}
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### Security Considerations
- List security measures
- Vulnerability mitigations
- Access control checks

### Example Request
```bash
curl -X METHOD "URL" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### Example Response
```json
{
  "success": true
}
```
```

---

## 4. Standard Request Headers

**All Authenticated Requests:**

| Header | Required | Value | Description |
|--------|----------|-------|-------------|
| `Authorization` | ✅ | `Bearer <JWT>` | Authentication token |
| `Content-Type` | ✅ | `application/json` | Request body format |
| `X-Request-ID` | ❌ | UUID | Request tracking (optional) |

**File Upload Requests:**

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | ✅ | `Bearer <JWT>` |
| `Content-Type` | ✅ | `multipart/form-data` |

---

## 5. Standard Response Format

### 5.1 Success Response Structure

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response payload
  },
  "timestamp": "2024-12-29T10:30:00.000Z"
}
```

**For Lists/Collections:**
```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  },
  "timestamp": "2024-12-29T10:30:00.000Z"
}
```

### 5.2 Error Response Structure

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error context (optional)
    }
  },
  "timestamp": "2024-12-29T10:30:00.000Z"
}
```

---

## 6. HTTP Status Codes

### 6.1 Standard Status Codes

| Code | Status | Usage in Our API |
|------|--------|------------------|
| **200** | OK | Successful GET, PATCH, DELETE |
| **201** | Created | Successful POST (resource created) |
| **204** | No Content | Successful DELETE (no body) |
| **400** | Bad Request | Validation error, invalid input |
| **401** | Unauthorized | Missing/invalid/expired token |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Business/document/user not found |
| **409** | Conflict | Email/business name already exists |
| **413** | Payload Too Large | File exceeds 10MB limit |
| **422** | Unprocessable Entity | Semantic validation error |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Unexpected server error |
| **503** | Service Unavailable | OpenAI/ChromaDB unavailable |

### 6.2 Status Code Guidelines

**Use 400 for:**
- Invalid email format
- Missing required fields
- Invalid file type
- Validation errors

**Use 401 for:**
- No Authorization header
- Invalid JWT token
- Expired JWT token

**Use 403 for:**
- User lacks required permission
- User not member of business
- Resource access denied

**Use 404 for:**
- Business not found
- Document not found
- User not found

**Use 429 for:**
- Chat rate limit exceeded
- Upload rate limit exceeded
- Auth attempts exceeded

---

## 7. Error Codes Reference

### 7.1 Standard Error Codes

| Error Code | HTTP Status | Description |
|-----------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `MISSING_REQUIRED_FIELD` | 400 | Required field missing |
| `INVALID_FILE_TYPE` | 400 | File type not supported |
| `NO_FILE_PROVIDED` | 400 | File upload missing |
| `UNAUTHORIZED` | 401 | No authentication provided |
| `TOKEN_EXPIRED` | 401 | JWT token expired |
| `TOKEN_INVALID` | 401 | JWT token invalid |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `PERMISSION_DENIED` | 403 | Insufficient permissions |
| `ACCESS_DENIED` | 403 | No access to resource |
| `BUSINESS_NOT_FOUND` | 404 | Business does not exist |
| `DOCUMENT_NOT_FOUND` | 404 | Document does not exist |
| `USER_NOT_FOUND` | 404 | User does not exist |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `BUSINESS_NAME_EXISTS` | 409 | Business name taken |
| `FILE_TOO_LARGE` | 413 | File exceeds 10MB |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `TOO_MANY_ATTEMPTS` | 429 | Too many login attempts |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `AI_SERVICE_ERROR` | 503 | OpenAI unavailable |
| `SERVICE_UNAVAILABLE` | 503 | Service down |

### 7.2 Error Response Examples

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "notanemail"
      }
    ]
  },
  "timestamp": "2024-12-29T10:30:00.000Z"
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Access token has expired"
  },
  "timestamp": "2024-12-29T10:30:00.000Z"
}
```

**Rate Limit Error (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 1 hour.",
    "retryAfter": 3600
  },
  "timestamp": "2024-12-29T10:30:00.000Z"
}
```

---

## 8. Data Types & Formats

### 8.1 Standard Data Types

| Type | Format | Example | Validation |
|------|--------|---------|-----------|
| `string` | text | `"hello"` | UTF-8 |
| `integer` | number | `42` | Whole numbers |
| `float` | decimal | `3.14` | Decimal numbers |
| `boolean` | true/false | `true` | Boolean only |
| `date-time` | ISO 8601 | `"2024-12-29T10:30:00.000Z"` | ISO format |
| `uuid` | UUID v4 | `"507f1f77-bcf8-6cd7-9944-3901"` | Valid UUID |
| `email` | RFC 5322 | `"user@example.com"` | Valid email |
| `url` | URI | `"https://example.com"` | Valid URL |
| `enum` | fixed set | `"owner" | "admin"` | Allowed values |

### 8.2 Custom Types

**businessId:**
```typescript
type: string
pattern: ^biz_[a-zA-Z0-9]+$
example: "biz_123abc"
```

**userId:**
```typescript
type: string
pattern: ^user_[a-zA-Z0-9]+$
example: "user_456def"
```

**documentId:**
```typescript
type: string
pattern: ^doc_[a-zA-Z0-9]+$
example: "doc_789ghi"
```

**sessionId:**
```typescript
type: string
pattern: ^sess_[a-zA-Z0-9]+$
example: "sess_abc123xyz"
```

---

## 9. Pagination & Filtering

### 9.1 Pagination

**Query Parameters:**
```http
GET /api/business/:businessId/documents?page=1&limit=20
```

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | - | Page number (1-indexed) |
| `limit` | integer | 20 | 100 | Items per page |

**Response Format:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 9.2 Filtering

**Date Range:**
```http
GET /api/business/:id/analytics?startDate=2024-01-01&endDate=2024-12-31
```

**Status Filter:**
```http
GET /api/business/:id/documents?status=completed
```

### 9.3 Sorting

```http
GET /api/business/:id/documents?sort=uploadedAt:desc
```

**Format:** `field:direction`
- Direction: `asc` or `desc`
- Default: `createdAt:desc`

---

## 10. File Upload Specifications

### 10.1 Supported File Types

| Type | MIME Type | Extension | Max Size |
|------|-----------|-----------|----------|
| PDF | `application/pdf` | `.pdf` | 10MB |
| Plain Text | `text/plain` | `.txt` | 10MB |
| Word Document | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `.docx` | 10MB |
| CSV | `text/csv` | `.csv` | 10MB |
| JSON | `application/json` | `.json` | 10MB |
| Markdown | `text/markdown` | `.md` | 10MB |

### 10.2 File Upload Request

```http
POST /api/business/:businessId/documents/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

--boundary
Content-Disposition: form-data; name="file"; filename="document.pdf"
Content-Type: application/pdf

<binary file data>
--boundary--
```

### 10.3 File Validation

**Checks Performed:**
1. MIME type validation
2. File extension validation
3. File size validation (max 10MB)
4. Content validation (file signature)

**Rejection Reasons:**
- File type not in allowed list
- File size exceeds 10MB
- MIME type doesn't match extension
- File appears corrupted

---

## 11. Security Documentation Requirements

### 11.1 Per-Endpoint Security Checklist

**Every endpoint MUST document:**

```markdown
### Security Considerations

- **Authentication:** [Required/Not Required]
- **Authorization Checks:**
  - [ ] User authentication verified
  - [ ] Business membership verified
  - [ ] Permission check: `permissionName`
  - [ ] Resource ownership validated
- **Input Validation:**
  - [ ] All inputs validated
  - [ ] SQL/NoSQL injection prevention
  - [ ] XSS prevention
  - [ ] File type validation (if applicable)
- **Rate Limiting:** [X requests per Y time]
- **Data Exposure:**
  - [ ] No sensitive data in response
  - [ ] Business isolation enforced
  - [ ] PII handling compliant
- **BOLA Prevention:** [How resource ownership is verified]
- **BFLA Prevention:** [How permission checks are enforced]
```

### 11.2 Security Vulnerabilities Addressed

**BOLA (Broken Object Level Authorization):**
```markdown
✅ Always verify businessId in requests
✅ Check user membership before allowing access
✅ Filter database queries by businessId
```

**BFLA (Broken Function Level Authorization):**
```markdown
✅ Check permissions on every action
✅ Validate role hierarchy
✅ Deny by default, allow explicitly
```

**Excessive Data Exposure:**
```markdown
✅ Return only necessary fields
✅ No password hashes in responses
✅ No internal IDs exposed
```

**Mass Assignment:**
```markdown
✅ Whitelist allowed fields
✅ Validate all input fields
✅ Don't accept arbitrary JSON
```

**Injection Attacks:**
```markdown
✅ Sanitize all inputs (express-mongo-sanitize)
✅ Use parameterized queries
✅ Validate data types
```

---

## 12. Rate Limiting Headers

**All rate-limited responses include:**

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 23
X-RateLimit-Reset: 1735468800
```

**When limit exceeded (429):**
```http
Retry-After: 3600
```

---

## 13. Request/Response Examples

### 13.1 Example Requirements

**Every endpoint MUST include:**

1. **Successful request example (curl)**
2. **Successful response example**
3. **At least 2 error scenarios**
4. **Authentication example**
5. **Postman-compatible format**

### 13.2 Example Template

```markdown
### Example: Successful Request

**Request:**
```bash
curl -X POST "https://api.yourdomain.com/api/business/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@luxurysalon.com",
    "password": "SecurePass123!",
    "fullName": "Sarah Johnson",
    "businessName": "Luxury Salon"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Business registered successfully",
  "user": {
    "id": "user_456def",
    "email": "owner@luxurysalon.com"
  },
  "business": {
    "id": "biz_123abc",
    "businessName": "Luxury Salon",
    "chatUrl": "https://yourapp.com/chat/luxury-salon"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Example: Validation Error

**Request:**
```bash
curl -X POST "https://api.yourdomain.com/api/business/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "notanemail",
    "password": "short"
  }'
```

**Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```
```

---

## 14. OpenAPI / Swagger Specification

### 14.1 Requirements

**Must Include:**
- OpenAPI 3.0+ specification
- All endpoints documented
- Request/response schemas
- Authentication schemes
- Error responses
- Examples for all operations

### 14.2 OpenAPI Template

```yaml
openapi: 3.0.0
info:
  title: Business AI Assistant API
  version: 1.0.0
  description: AI-powered business assistant with RAG
  contact:
    email: support@yourdomain.com

servers:
  - url: https://api.yourdomain.com/api
    description: Production
  - url: http://localhost:3000/api
    description: Development

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  
  schemas:
    Error:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string

paths:
  /business/register:
    post:
      summary: Register new business
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
                - fullName
                - businessName
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
      responses:
        '201':
          description: Business registered successfully
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

---

## 15. Testing Documentation

### 15.1 Test Scenarios

**Every endpoint MUST include:**

| Scenario | Expected Result | Status Code |
|----------|----------------|-------------|
| Valid request | Success | 200/201 |
| Missing auth | Error | 401 |
| Invalid auth | Error | 401 |
| Insufficient permission | Error | 403 |
| Invalid input | Error | 400 |
| Resource not found | Error | 404 |
| Rate limit exceeded | Error | 429 |

### 15.2 Postman Collection

**Collection Structure:**
```
Business AI Assistant API/
├── Public/
│   ├── Get Business Info
│   └── Public Chat
├── Authentication/
│   ├── Register Business
│   └── Login
├── Documents/
│   ├── Upload Document
│   ├── List Documents
│   └── Delete Document
└── Team/
    ├── Invite Member
    └── List Members
```

---

## 16. Versioning Strategy

### 16.1 URL Versioning

```
Current: /api/v1/...
Future: /api/v2/...
```

### 16.2 Deprecation Policy

**Process:**
1. Announce deprecation 6 months in advance
2. Mark endpoint as deprecated in docs
3. Return `Deprecation` header
4. Provide migration guide
5. Sunset after 12 months

**Deprecation Header:**
```http
Deprecation: true
Sunset: Sat, 31 Dec 2025 23:59:59 GMT
Link: <https://docs.yourdomain.com/migration>; rel="deprecation"
```

---

## 17. Logging & Monitoring

### 17.1 Logged Information

**Always Log:**
- Request method & path
- Response status code
- Response time
- User ID (if authenticated)
- Business ID (if applicable)
- Error messages
- Rate limit violations

**Never Log:**
- Passwords (plain or hashed)
- JWT tokens
- API keys
- Credit card information
- Full request/response bodies with PII

### 17.2 Correlation IDs

**Request tracking:**
```http
X-Request-ID: abc-123-def-456
```

**Included in all log entries and error responses**

---

## 18. Documentation Maintenance

### 18.1 Update Triggers

**Documentation MUST be updated when:**
- New endpoint added
- Endpoint behavior changed
- New error code introduced
- Rate limits modified
- Security requirements changed
- Response format modified

### 18.2 Version Control

**Documentation is code:**
- Store in Git repository
- Review changes in PRs
- Keep in sync with API code
- Generate from OpenAPI spec

---

## 19. Documentation Checklist

**Before releasing an endpoint:**

- [ ] Endpoint purpose documented
- [ ] Authentication requirements specified
- [ ] All parameters documented with validation rules
- [ ] Request body schema provided
- [ ] Success response example included
- [ ] At least 2 error scenarios documented
- [ ] Security considerations listed
- [ ] Rate limiting specified
- [ ] Curl example provided
- [ ] Added to OpenAPI specification
- [ ] Postman collection updated
- [ ] Test scenarios documented
- [ ] BOLA/BFLA mitigations explained

---

## 20. Documentation Tools

### 20.1 Required Tools

| Tool | Purpose |
|------|---------|
| Swagger UI | Interactive API documentation |
| Postman | API testing & collections |
| Redoc | Alternative documentation UI |
| OpenAPI Generator | SDK generation |

### 20.2 Automation

```bash
# Generate docs from OpenAPI spec
npm run docs:generate

# Validate OpenAPI spec
npm run docs:validate

# Update Postman collection
npm run postman:update
```

---

## ✅ Final Documentation Standards

### Must-Haves:

1. **Completeness:** All endpoints documented
2. **Accuracy:** Matches actual API behavior
3. **Security:** OWASP top 10 addressed
4. **Examples:** Real, working examples
5. **Versioning:** Clear version strategy
6. **Testing:** Postman collections included
7. **OpenAPI:** Valid OpenAPI 3.0+ spec
8. **Maintenance:** Kept up-to-date

### Quality Metrics:

- [ ] 100% endpoint coverage
- [ ] Zero undocumented endpoints
- [ ] All errors have examples
- [ ] Security checklist completed per endpoint
- [ ] Postman collection passes all tests
- [ ] OpenAPI spec validates
- [ ] Documentation reviewed by security team

---

**Documentation Quality = API Quality**

**Clear documentation = Secure, testable, and production-ready API**

🎯 **This guideline ensures our Business AI Assistant API is professionally documented, secure, and ready for external developers and security audits!**
