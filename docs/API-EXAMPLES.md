# API Usage Examples & Tutorials

This guide provides practical examples of how to interact with the Business AI Assistant API using standard tools like `curl` and JavaScript.

---

## 1. Authentication Flow

### Registering and Saving Token (cURL)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@mybusiness.com",
    "password": "SecurePassword123",
    "firstName": "Alex",
    "lastName": "Owner",
    "businessName": "Gadget Store",
    "industry": "Ecommerce"
  }'
```

---

## 2. Building Your Knowledge Base

### Uploading a PDF Document (JavaScript)
```javascript
const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch('/api/documents/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });

  return response.json();
};
```

### Scraping a Product URL (cURL)
```bash
curl -X POST http://localhost:3000/api/documents/add-url \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://gadgetstore.com/products/pro-drone",
    "autoRefresh": {
      "enabled": true,
      "frequency": "weekly"
    }
  }'
```

---

## 3. Implementing the Chat Interface

### Sending a Question (JavaScript)
```javascript
async function askAI(question, sessionId = null) {
  const response = await fetch('/api/chat/public/gadget-store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, sessionId })
  });

  const data = await response.json();
  console.log("AI Answer:", data.answer);
  return data.sessionId; // Save this for the next message
}
```

---

## 4. Capturing Leads from Chat

### Saving Contact Info (cURL)
```bash
curl -X POST http://localhost:3000/api/leads/capture \
  -H "Content-Type: application/json" \
  -d '{
    "businessSlug": "gadget-store",
    "sessionId": "session-unique-id",
    "data": {
      "name": "Sarah Customer",
      "email": "sarah@example.com",
      "phone": "+1555123456"
    }
  }'
```

---

## 5. Exporting Leads (Node.js)

### Downloading CSV via Backend
```javascript
const exportLeads = async (businessId) => {
  const response = await fetch(`/api/leads/business/${businessId}/export/csv`, {
    headers: { 'Authorization': `Bearer YOUR_TOKEN` }
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-${businessId}.csv`;
  a.click();
};
```

---

## 6. Full Scenario: Training & Testing

1. **Setup**: Create account via `POST /api/auth/register`.
2. **Train**: Link your landing pages via `POST /api/documents/add-url`.
3. **Verify**: Check your knowledge base via `GET /api/documents`.
4. **Chat**: Test an AI conversation via `POST /api/chat/public/:slug`.
5. **Analyze**: Fetch your leads via `GET /api/leads/business/:id`.
