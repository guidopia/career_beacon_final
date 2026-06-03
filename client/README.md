# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment Notes
- Set the environment variable `VITE_API_URL` to your backend API base URL (e.g., https://your-backend-domain.com) in your deployment platform.
- All backend API calls should use `API_BASE_URL` from `src/api/index.js`.
- Use `apiFetch` utility for all backend calls to ensure proper cross-domain credential handling.

### Backend Environment Variables Required:
- `SESSION_SECRET`: A strong secret for session encryption
- `MONGO_URI`: Your MongoDB connection string
- `ALLOWED_ORIGINS`: Comma-separated list of frontend domains (e.g., "https://your-frontend.vercel.app")
- `FRONTEND_URL`: Your frontend domain (e.g., "https://your-frontend.vercel.app")
- `COOKIE_DOMAIN`: For cross-domain cookies (leave empty for different domains, use ".yourdomain.com" for subdomains)
- `NODE_ENV`: Set to "production" for production deployment

### Cookie Domain Examples:
- **Different domains**: Leave `COOKIE_DOMAIN` empty (e.g., frontend: `guidopia.vercel.app`, backend: `guidopia-backend.vercel.app`)
- **Subdomains**: Use `COOKIE_DOMAIN=.yourdomain.com` (e.g., frontend: `app.yourdomain.com`, backend: `api.yourdomain.com`)
- **Same domain**: Use `COOKIE_DOMAIN=yourdomain.com` (e.g., both on `yourdomain.com`)

### Cross-Domain Session Issues Fixed:
- Session cookies now include `SameSite=None` and `Secure=true` for production
- All fetch calls use `credentials: 'include'` for cross-domain cookie handling
- Cookie domain properly configured for cross-domain deployment
