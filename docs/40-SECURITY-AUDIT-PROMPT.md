# AI PROMPT: Comprehensive Security Audit for Codebase

## 🎯 YOUR MISSION

You are a **Senior Security Engineer** and **Application Security Expert** with 15+ years of experience in:

- ✅ OWASP Top 10 vulnerabilities
- ✅ Security code review
- ✅ Penetration testing
- ✅ Authentication & authorization
- ✅ API security
- ✅ Database security
- ✅ Cloud security (AWS, Render, MongoDB Atlas)
- ✅ Input validation & sanitization
- ✅ Secure coding practices

Your task is to perform a **comprehensive security audit** of the Business AI Assistant codebase and:
1. Identify all security vulnerabilities
2. Assess risk level (Critical, High, Medium, Low)
3. Provide specific fixes for each issue
4. Suggest security improvements
5. Create a security checklist

---

## 📋 AUDIT SCOPE

### **What to Audit:**

1. **Authentication & Authorization**
   - JWT implementation
   - Password security
   - Session management
   - Role-based access control
   - Token storage and transmission

2. **Input Validation**
   - User input sanitization
   - File upload validation
   - URL validation
   - Query parameter validation
   - Request body validation

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Security headers
   - API key management
   - Error messages (information disclosure)

4. **Database Security**
   - MongoDB injection prevention
   - Query parameterization
   - Data encryption
   - Sensitive data storage
   - Database access control

5. **External Integrations**
   - OpenAI API key security
   - Third-party API calls
   - Webhook security
   - External service authentication

6. **Data Security**
   - Sensitive data handling
   - PII (Personally Identifiable Information)
   - Data encryption at rest
   - Data encryption in transit
   - Secure file storage

7. **Code Security**
   - Dependency vulnerabilities
   - Code injection risks
   - XSS (Cross-Site Scripting)
   - CSRF (Cross-Site Request Forgery)
   - Insecure direct object references

8. **Infrastructure Security**
   - Environment variable management
   - Secrets management
   - Deployment security
   - Server configuration
   - Network security

---

## 🔍 AUDIT METHODOLOGY

### **STEP 1: Analyze Project Structure**

```bash
# Clone repository (if needed)
git clone https://github.com/g3k0ch4mps-dotcom/Pam_Ai_Final.git
cd Pam_Ai_Final

# Examine structure
tree -L 3

# Check dependencies for known vulnerabilities
cd backend
npm audit

cd ../frontend
npm audit
```

**Document:**
- Project structure
- Technologies used
- External dependencies
- Known vulnerabilities in dependencies

---

### **STEP 2: Authentication Security Audit**

**Check files:**
- `backend/src/middleware/auth.middleware.js`
- `backend/src/controllers/auth.controller.js`
- `backend/src/models/User.js`

**Look for:**

```javascript
// ❌ INSECURE: Weak JWT secret
const JWT_SECRET = 'secret123';

// ✅ SECURE: Strong, random secret
const JWT_SECRET = process.env.JWT_SECRET; // 32+ random characters

// ❌ INSECURE: JWT never expires
jwt.sign(payload, secret);

// ✅ SECURE: JWT with expiration
jwt.sign(payload, secret, { expiresIn: '7d' });

// ❌ INSECURE: Password stored in plain text
user.password = req.body.password;

// ✅ SECURE: Password hashed with bcrypt
user.password = await bcrypt.hash(req.body.password, 10);

// ❌ INSECURE: Password in response
res.json({ user });

// ✅ SECURE: Password excluded from response
const userResponse = user.toObject();
delete userResponse.password;
res.json({ user: userResponse });
```

**Audit checklist:**
- [ ] JWT secret is strong (32+ random characters)
- [ ] JWT has expiration time
- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] Passwords never returned in API responses
- [ ] Password never logged
- [ ] Token verification implemented correctly
- [ ] Refresh token mechanism (if applicable)
- [ ] Token revocation possible (if needed)

---

### **STEP 3: Input Validation Audit**

**Check files:**
- All controller files
- All middleware files
- File upload handlers

**Look for:**

```javascript
// ❌ INSECURE: No validation
const { email } = req.body;
const user = await User.findOne({ email });

// ✅ SECURE: Validation with express-validator
const { email } = req.body;
if (!validator.isEmail(email)) {
  return res.status(400).json({ error: 'Invalid email' });
}

// ❌ INSECURE: Direct MongoDB query (injection risk)
const results = await Model.find({ $where: req.query.filter });

// ✅ SECURE: Parameterized query
const results = await Model.find({ 
  field: req.query.field 
});

// ❌ INSECURE: No file upload limits
upload.single('file');

// ✅ SECURE: File upload with limits
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
});
```

**Audit checklist:**
- [ ] All user inputs validated
- [ ] Email validation
- [ ] URL validation
- [ ] File upload size limits
- [ ] File type restrictions
- [ ] Query parameter sanitization
- [ ] MongoDB injection prevention
- [ ] XSS prevention (input sanitization)

---

### **STEP 4: API Security Audit**

**Check files:**
- `backend/src/app.js` or `backend/src/server.js`
- `backend/src/middleware/*`

**Look for:**

```javascript
// ❌ INSECURE: No rate limiting
app.use('/api', routes);

// ✅ SECURE: Rate limiting implemented
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter, routes);

// ❌ INSECURE: Open CORS
app.use(cors());

// ✅ SECURE: Restricted CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// ❌ INSECURE: No security headers
app.use(express.json());

// ✅ SECURE: Security headers with Helmet
const helmet = require('helmet');
app.use(helmet());

// ❌ INSECURE: Detailed error messages in production
res.status(500).json({ 
  error: error.message,
  stack: error.stack 
});

// ✅ SECURE: Generic error messages in production
res.status(500).json({ 
  error: 'Internal server error',
  ...(process.env.NODE_ENV === 'development' && { 
    details: error.message 
  })
});
```

**Audit checklist:**
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Helmet security headers
- [ ] HTTPS enforced
- [ ] No sensitive data in error messages (production)
- [ ] Request size limits
- [ ] Proper HTTP methods used
- [ ] API versioning (if applicable)

---

### **STEP 5: Database Security Audit**

**Check files:**
- `backend/src/config/database.js`
- `backend/src/models/*`

**Look for:**

```javascript
// ❌ INSECURE: Hardcoded connection string
mongoose.connect('mongodb://localhost:27017/mydb');

// ✅ SECURE: Connection string from env
mongoose.connect(process.env.MONGODB_URI);

// ❌ INSECURE: No connection options
mongoose.connect(uri);

// ✅ SECURE: Secure connection options
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin'
});

// ❌ INSECURE: Sensitive data not encrypted
const userSchema = new Schema({
  password: String, // Plain text!
  ssn: String // No encryption!
});

// ✅ SECURE: Sensitive data hashed/encrypted
const userSchema = new Schema({
  password: String, // Will be hashed in pre-save hook
  sensitiveData: String // Should be encrypted
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

**Audit checklist:**
- [ ] Connection string in environment variable
- [ ] Database credentials secured
- [ ] MongoDB injection prevention
- [ ] Passwords never stored plain text
- [ ] Sensitive fields encrypted if needed
- [ ] Indexes on sensitive fields reviewed
- [ ] Database access limited to application user
- [ ] Backups encrypted (if applicable)

---

### **STEP 6: Secrets Management Audit**

**Check files:**
- `.env` (should NOT be in git)
- `.env.example`
- `backend/src/config/*`

**Look for:**

```javascript
// ❌ INSECURE: Secrets in code
const apiKey = 'sk-1234567890abcdef';
const jwtSecret = 'mysecret123';

// ✅ SECURE: Secrets in environment variables
const apiKey = process.env.OPENAI_API_KEY;
const jwtSecret = process.env.JWT_SECRET;

// ❌ INSECURE: .env file committed to git
# Check .gitignore
cat .gitignore | grep .env

// ✅ SECURE: .env in .gitignore
.env
.env.local
.env.*.local
```

**Audit checklist:**
- [ ] No secrets in code
- [ ] .env file in .gitignore
- [ ] .env.example provided (no actual secrets)
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] OPENAI_API_KEY secured
- [ ] Database credentials secured
- [ ] No API keys in frontend code
- [ ] No secrets in error messages
- [ ] No secrets logged

---

### **STEP 7: File Upload Security Audit**

**Check files:**
- Document upload handlers
- File storage configuration

**Look for:**

```javascript
// ❌ INSECURE: No file validation
app.post('/upload', upload.single('file'), (req, res) => {
  // File saved without checks!
});

// ✅ SECURE: Comprehensive file validation
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.random()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 1 // One file at a time
  },
  fileFilter: (req, file, cb) => {
    // Whitelist approach
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!allowedTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
      return cb(new Error('Invalid file type'));
    }
    
    cb(null, true);
  }
});

// ❌ INSECURE: Original filename used
const filename = req.file.originalname; // Path traversal risk!

// ✅ SECURE: Generated filename
const filename = `${uuidv4()}${path.extname(req.file.originalname)}`;
```

**Audit checklist:**
- [ ] File size limits enforced
- [ ] File type validation (MIME type)
- [ ] File extension validation
- [ ] Files stored outside web root
- [ ] Generated filenames (not user-provided)
- [ ] Virus scanning (if applicable)
- [ ] Direct file access prevented
- [ ] Uploaded files not executable

---

### **STEP 8: Frontend Security Audit**

**Check files:**
- `frontend/src/components/*`
- `frontend/src/pages/*`
- `frontend/src/utils/*`

**Look for:**

```javascript
// ❌ INSECURE: JWT in localStorage
localStorage.setItem('token', token);

// ✅ BETTER: JWT in httpOnly cookie (if possible)
// Or at least acknowledge the risk

// ❌ INSECURE: Dangerously setting HTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SECURE: Sanitized HTML or avoid dangerouslySetInnerHTML
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />

// ❌ INSECURE: API keys in frontend
const apiKey = 'sk-1234567890';
axios.get(url, { headers: { 'X-API-Key': apiKey }});

// ✅ SECURE: No API keys in frontend
// All API calls go through backend

// ❌ INSECURE: eval() or Function() with user input
eval(userInput); // NEVER DO THIS!

// ✅ SECURE: Avoid eval() entirely
```

**Audit checklist:**
- [ ] No API keys in frontend code
- [ ] XSS prevention (no dangerouslySetInnerHTML or sanitized)
- [ ] No eval() or Function() with user input
- [ ] HTTPS enforced
- [ ] Content Security Policy
- [ ] Sensitive data not in URL params
- [ ] Token storage reviewed
- [ ] Input validation on frontend

---

## 📊 SECURITY AUDIT REPORT TEMPLATE

After auditing, create a report with this structure:

```markdown
# Security Audit Report
**Project:** Business AI Assistant  
**Date:** [Date]  
**Auditor:** [Name/AI Assistant]  
**Version:** 1.0.0

---

## Executive Summary

[Brief overview of findings]

**Overall Risk Level:** [Critical / High / Medium / Low]

**Key Statistics:**
- Total Issues Found: [Number]
- Critical: [Number]
- High: [Number]
- Medium: [Number]
- Low: [Number]

---

## Critical Vulnerabilities (Fix Immediately)

### 1. [Vulnerability Name]

**Risk Level:** 🔴 Critical  
**Category:** Authentication  
**Location:** `backend/src/middleware/auth.middleware.js:42`

**Description:**
JWT secret is weak and predictable.

**Current Code:**
```javascript
const JWT_SECRET = 'secret123';
```

**Impact:**
- Attackers can forge authentication tokens
- Complete account takeover possible
- All user data at risk

**Fix:**
```javascript
const JWT_SECRET = process.env.JWT_SECRET; // Must be 32+ random characters
```

**Steps to Fix:**
1. Generate strong secret: `openssl rand -base64 32`
2. Add to .env: `JWT_SECRET=<generated_secret>`
3. Update code to use environment variable
4. Regenerate all existing tokens

**Priority:** Immediate (Fix within 24 hours)

---

### 2. [Next Critical Issue]
...

---

## High Severity Issues (Fix Within 1 Week)

### 1. [Issue Name]
...

---

## Medium Severity Issues (Fix Within 1 Month)

### 1. [Issue Name]
...

---

## Low Severity Issues (Nice to Have)

### 1. [Issue Name]
...

---

## Security Improvements (Recommendations)

1. **Implement Security Logging**
   - Log all authentication attempts
   - Log all failed access attempts
   - Monitor for suspicious activity

2. **Add Security Monitoring**
   - Set up error tracking (Sentry)
   - Monitor rate limit hits
   - Alert on unusual patterns

3. **Enhance Authentication**
   - Consider 2FA for admin accounts
   - Implement password strength requirements
   - Add email verification

4. **Code Quality**
   - Set up automated security scanning
   - Regular dependency updates
   - Code review process

---

## Compliance Checklist

### OWASP Top 10 (2021)

- [ ] A01:2021 – Broken Access Control
- [ ] A02:2021 – Cryptographic Failures
- [ ] A03:2021 – Injection
- [ ] A04:2021 – Insecure Design
- [ ] A05:2021 – Security Misconfiguration
- [ ] A06:2021 – Vulnerable and Outdated Components
- [ ] A07:2021 – Identification and Authentication Failures
- [ ] A08:2021 – Software and Data Integrity Failures
- [ ] A09:2021 – Security Logging and Monitoring Failures
- [ ] A10:2021 – Server-Side Request Forgery (SSRF)

---

## Dependency Vulnerabilities

### Backend
```
npm audit output:
[Paste npm audit results]
```

**Action Items:**
- Update package X to version Y
- Remove unused dependency Z
- Find alternative for vulnerable package A

### Frontend
```
npm audit output:
[Paste npm audit results]
```

**Action Items:**
- Update React to latest version
- Update axios to v1.6.0+
- Review and update all dependencies

---

## Security Best Practices Compliance

### ✅ Implemented
- JWT authentication
- Password hashing (bcrypt)
- HTTPS in production
- Environment variables for secrets

### ⚠️ Partially Implemented
- Rate limiting (needs adjustment)
- Input validation (needs improvement)
- Error handling (exposes too much info)

### ❌ Not Implemented
- 2FA
- Security logging
- Intrusion detection
- API versioning

---

## Action Plan

### Immediate (0-7 days)
1. Fix all Critical vulnerabilities
2. Update JWT secret
3. Improve input validation
4. Update vulnerable dependencies

### Short-term (1-4 weeks)
1. Fix all High severity issues
2. Implement security logging
3. Add comprehensive input validation
4. Security headers review

### Medium-term (1-3 months)
1. Fix Medium severity issues
2. Implement security monitoring
3. Code review process
4. Security training for team

### Long-term (3-6 months)
1. Consider 2FA implementation
2. Penetration testing
3. Security audit (external)
4. Compliance review (GDPR, etc.)

---

## Testing Recommendations

1. **Automated Security Scanning**
   - Set up Snyk or Dependabot
   - GitHub security alerts
   - npm audit in CI/CD

2. **Manual Security Testing**
   - Penetration testing
   - Code review
   - Security checklist validation

3. **Continuous Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Security event logging

---

## Conclusion

[Overall security posture summary]

**Risk Assessment:** [Overall risk level and reasoning]

**Recommendations:** [Top 3-5 priority recommendations]

**Next Steps:** [What should be done next]

---

## Appendix

### A. Security Checklist
[Complete checklist of all security measures]

### B. Secure Configuration Examples
[Code examples of secure implementations]

### C. Security Resources
[Links to security resources and documentation]

### D. Contact Information
[Security contact information]

---

**Report End**
```

---

## 🔧 SPECIFIC CHECKS TO PERFORM

### Authentication Security

```bash
# Check for weak secrets
grep -r "secret.*=.*['\"]" backend/
grep -r "JWT_SECRET.*=.*['\"]" backend/

# Check for hardcoded credentials
grep -ri "password.*=.*['\"]" backend/
grep -ri "api.*key.*=.*['\"]" backend/

# Check password hashing
grep -r "bcrypt" backend/
grep -r "hash.*password" backend/
```

### Input Validation

```bash
# Check for SQL/NoSQL injection risks
grep -r "\$where" backend/
grep -r "exec.*req\." backend/
grep -r "eval.*req\." backend/

# Check for XSS risks
grep -r "dangerouslySetInnerHTML" frontend/
grep -r "innerHTML.*=" frontend/
```

### Dependency Vulnerabilities

```bash
# Check npm vulnerabilities
cd backend && npm audit
cd frontend && npm audit

# Check for outdated packages
cd backend && npm outdated
cd frontend && npm outdated
```

---

## 🎯 COPY-PASTE PROMPT FOR AI

```
I need a comprehensive security audit of my codebase.

PROJECT: Business AI Assistant
REPO: https://github.com/g3k0ch4mps-dotcom/Pam_Ai_Final.git
STACK: Node.js, Express, React, MongoDB, OpenAI API

WHAT I NEED:

1. **Comprehensive Security Audit** covering:
   - Authentication & authorization
   - Input validation & sanitization
   - API security (rate limiting, CORS, headers)
   - Database security (MongoDB injection, etc.)
   - Secrets management
   - File upload security
   - Frontend security (XSS, etc.)
   - Dependency vulnerabilities

2. **Detailed Report** with:
   - All vulnerabilities found
   - Risk level for each (Critical/High/Medium/Low)
   - Specific code locations
   - Current code vs. secure code
   - Step-by-step fixes
   - Impact assessment

3. **Action Plan** with:
   - Immediate fixes (Critical)
   - Short-term fixes (High)
   - Long-term improvements
   - Prioritized task list

4. **Security Checklist** with:
   - OWASP Top 10 compliance
   - Best practices review
   - What's implemented vs. missing

Please analyze the entire codebase and provide:
- Specific vulnerabilities with code examples
- Exact file locations and line numbers
- Working code fixes
- Priority recommendations

Make it comprehensive and actionable!
```

---

**This will provide a complete security assessment of your codebase!** 🔒
