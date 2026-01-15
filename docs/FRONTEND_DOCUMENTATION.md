# Frontend Documentation

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React Context (Auth, Theme)
│   ├── hooks/             # Custom React Hooks
│   ├── pages/             # Page components (routed)
│   ├── services/          # API service modules
│   ├── App.jsx            # Main App component
│   └── main.jsx           # Entry point
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Build configuration
└── .env                   # Environment variables
```

## 🏗️ Architecture
- **Framework**: React 19.
- **Build**: Vite for fast HMR and optimized builds.
- **Routing**: React Router DOM v7 for declarative routing.
- **Styling**: TailwindCSS v4 for utility-first styling.
- **Icons**: Lucide React.

## 🔌 API Integration
The frontend communicates with the backend via REST API.
Base URL is configured in `.env` (`VITE_API_URL`).

### Service Layer
API calls are organized in the `services/` directory:
- `auth.service.js`: Login, register, get profile.
- `business.service.js`: Fetch business info.
- `chat.service.js`: Send messages to AI.
- `document.service.js`: Manage documents.

Example:
```javascript
import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};
```

## 🧩 Components
Key components include:
- `Layout`: Main layout wrapper (Navigation, Sidebar).
- `ChatWidget`: The embedded chat interface.
- `DocumentList`: Display and manage uploaded documents.
- `LeadDashboard`: Table view of captured leads.

## 🔐 Authentication
Authentication is managed via `AuthContext`.
- Stores JWT in `localStorage`.
- Provides `user` object and `login`/`logout` methods to components.
- Protects functionality via PrivateRoute wrappers.

## 🚀 Development

### Setup
```bash
cd frontend
npm install
npm run dev
```

### Build
```bash
npm run build
# Output in dist/
npm run preview
```

## 🎨 Styling Guide
We use TailwindCSS.
- Use `flex` and `grid` for layouts.
- Use `text-primary`, `bg-secondary` etc. for theming (if configured).
- Responsive prefixes: `md:`, `lg:` etc.

## 📦 Deployment
The frontend is built as a static site (`dist/`) and can be served by any static host (Render Static Site, Netlify, Vercel) or served by Nginx on the VPS alongside the backend.
