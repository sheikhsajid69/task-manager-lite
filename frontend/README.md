# Task Manager Frontend

React + Vite client for task and user management.

## Features
- Auth (signup/login/logout)
- Role-aware routing (user/admin)
- Tasks list with pagination, filtering, and sorting
- Admin users list with pagination, filtering, and sorting
- Styled task/user cards and profile summary cards

## Setup
1. Install dependencies:
```bash
npm install
```
2. Create `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```
3. Run:
```bash
npm run dev
```

## Scripts
- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run preview` - preview production bundle
- `npm run lint` - lint source

## Production Notes
- Set `VITE_API_URL` to deployed backend URL.
- Serve `dist/` from CDN/static host.
- Enable HTTPS and secure headers.
- Keep backend CORS aligned with frontend origin.
