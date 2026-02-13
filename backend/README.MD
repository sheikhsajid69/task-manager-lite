# Task Manager Backend

Express + MongoDB API for authentication, users, and tasks.

## Tech
- Node.js (ESM)
- Express
- Mongoose
- JWT auth
- Joi validation

## Setup
1. Install dependencies:
```bash
npm install
```
2. Create `.env` in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=1d
```
3. Run:
```bash
npm run dev
```

## Scripts
- `npm run dev` - start with nodemon
- `npm start` - production start

## API (high level)
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `GET /tasks` with pagination/filter/sort query params
- `GET /users` with pagination/filter/sort query params (admin only)

## Production Notes
- Set strong `JWT_SECRET`.
- Restrict CORS origin in `src/app.js`.
- Use managed MongoDB and network allowlists.
- Run behind a reverse proxy (Nginx/Cloudflare/Render/Fly).
- Add process manager and health checks.
