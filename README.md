# Donato

Donato - A Platform Connecting Donors with Donation Centers.

## Project Summary

The platform supports two roles:
- `Donors`: discover verified organizations, create donations, track statuses, view certificates, and check leaderboard ranking.
- `Organizations`: manage profile and donation needs, review incoming donations, accept or reject requests, complete donations, and award points.

Core workflow:
1. Donor creates a donation request.
2. Organization reviews the request.
3. Organization accepts or rejects.
4. On completion, points are awarded and certificate data is generated.

## Key Highlights

- Dual-role authentication and protected routing (donor and organization).
- `33` backend REST endpoints.
- Donation lifecycle with `4` statuses: `pending`, `accepted`, `rejected`, `completed`.
- Gamification with points and `4` badge tiers: Bronze, Silver, Gold, Platinum.
- Certificate tracking for completed donations.
- Supabase-backed relational schema with `8` primary tables.

## Tech Stack

### Frontend
- React `18` + TypeScript
- Vite
- Tailwind CSS
- Radix UI + shadcn/ui
- React Router
- React Query
- React Hook Form + Zod
- Axios

### Backend
- Node.js
- Express `5`
- Supabase (`@supabase/supabase-js`)
- dotenv
- cors

### Database and Auth
- Supabase Postgres
- Supabase Auth
- JWT token-based API authorization
- Role checks in backend middleware

## Architecture Overview

### Backend Modules
- `backend/src/routes/publicRoutes.js`: public organization and leaderboard APIs.
- `backend/src/routes/userRoutes.js`: donor auth, profile, donations, certificates, dashboard.
- `backend/src/routes/orgRoutes.js`: organization auth, profile, needs, donation management, dashboard.
- `backend/src/middlewares/auth.js`: token verification and role checks.
- `backend/src/config/supabase.js`: regular client + optional service-role admin client.

### Frontend Modules
- `frontend/src/pages/auth/*`: donor authentication pages.
- `frontend/src/pages/user/*`: donor dashboard, profile, donate flow, leaderboard.
- `frontend/src/pages/org/*`: organization auth, dashboard, profile, donation detail.
- `frontend/src/context/AuthContext.tsx`: auth state for both roles.
- `frontend/src/services/*`: typed API integration layer.

## API Overview

Base URL: `http://localhost:8080/api`

### Public (`3`)
- `GET /public/organizations`
- `GET /public/organizations/:id`
- `GET /public/leaderboard`

### Donor (`13`)
- `POST /users/signup`
- `POST /users/login`
- `POST /users/forgot-password`
- `POST /users/reset-password`
- `GET /users/profile`
- `PUT /users/profile`
- `GET /users/dashboard`
- `GET /users/organizations`
- `GET /users/organizations/:id`
- `POST /users/donations`
- `GET /users/donations`
- `GET /users/certificates`
- `GET /users/leaderboard`

### Organization (`17`)
- `POST /organizations/signup`
- `POST /organizations/login`
- `POST /organizations/forgot-password`
- `POST /organizations/reset-password`
- `GET /organizations/profile`
- `PUT /organizations/profile`
- `GET /organizations/dashboard/stats`
- `GET /organizations/donations`
- `GET /organizations/donations/:id`
- `GET /organizations/needs`
- `POST /organizations/needs`
- `PUT /organizations/donations/:id/accept`
- `POST /organizations/donations/:id/complete`
- `PUT /organizations/donations/:id/reject`
- `GET /organizations/received-donations`
- `GET /organizations/donation-stats`
- `GET /organizations/received-donations/:id`

## Database Tables

- `user_profiles`
- `organization_profiles`
- `donations`
- `certificates`
- `donation_needs`
- `reviews`
- `notifications`
- `organization_donations`

## Local Setup

### Prerequisites
- Node.js `16+` (recommended `18+`)
- npm
- Supabase project

### 1. Clone

```bash
git clone <repository-url>
cd donate-connect
```

### 2. Install Dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Configure Backend Environment

Create `backend/.env`:

```env
PORT=8080
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Notes:
- `SUPABASE_ANON_KEY` is required.
- `SUPABASE_SERVICE_ROLE_KEY` is optional but enables admin-level public reads where configured.

### 4. Run Development Servers

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Default URLs:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`

## Scripts

### Backend
- `npm run dev`: start backend with nodemon.
- `npm start`: start backend in normal mode.

### Frontend
- `npm run dev`: start Vite dev server.
- `npm run build`: production build.
- `npm run preview`: preview production build.
- `npm run lint`: run ESLint.

## Security Notes

- API routes use bearer token validation.
- Role-based authorization is enforced for donor and organization endpoints.
- Supabase Auth manages password security.
- CORS and structured error handling are enabled in backend middleware.

## Testing and Validation

The repository includes multiple backend test scripts in `backend/`, such as:
- `test-api.js`
- `test-donation-flow.js`
- `test-dashboard-workflow.js`
- `test-complete-flow.js`

Refer to:
- `backend/TESTING_GUIDE.md`
- `backend/MANUAL_TESTING_GUIDE.md`

## Roadmap

- Real-time notifications.
- Payment integration for monetary donations.
- Improved analytics and reporting.
- Mobile application support.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a pull request.

## License

Licensed under the ISC License.

## Contact

- Name: `Harshal Sriampura Lokesh , Supriya Gouda`

