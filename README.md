# Donate Connect

A comprehensive donation platform connecting donors with verified charitable organizations, enabling seamless contributions and transparent tracking of social impact.

## 🌟 Overview

Donate Connect is a full-stack web application that bridges the gap between donors and charitable organizations. The platform provides an intuitive interface for donors to discover organizations, make donations, track their contributions, and receive digital certificates, while enabling organizations to manage donation requests, update profiles, and connect with generous donors.

## ✨ Features

### For Donors
- **User Authentication**: Secure signup and login with JWT-based authentication
- **Organization Discovery**: Browse and search verified charitable organizations by location and category
- **Smart Search**: Location-based organization search with distance calculations
- **Donation Management**: 
  - Multiple donation types (food, books, clothes, money, infrastructure, other)
  - Detailed donation tracking with status updates (pending, accepted, completed, rejected)
  - Comprehensive donation history
- **Gamification System**:
  - Points-based reward system for donations
  - Leaderboard to track top donors
  - Achievement badges (Bronze, Silver, Gold, Platinum)
- **Digital Certificates**: 
  - Automated certificate generation for completed donations
  - Downloadable certificates with verification codes
  - Tax deduction documentation support
- **Event Celebrations**: Register special occasions (birthdays, anniversaries) with organizations
- **User Dashboard**: 
  - View all donations and their statuses
  - Track points and achievements
  - Access donation certificates
  - Monitor personal donation statistics
- **User Profile Management**: Update personal information and view donation statistics

### For Organizations
- **Organization Authentication**: Separate login system for verified organizations
- **Profile Management**: 
  - Complete organization profile with description, mission, and contact details
  - Logo and banner image upload
  - Gallery management with multiple images
  - Registration number and verification status
- **Donation Request Management**:
  - View all incoming donation requests
  - Accept, reject, or mark donations as complete
  - Track donation status and donor information
  - View detailed donation history
- **Points Award System**: Award points to donors upon donation completion
- **Certificate Generation**: Automatic certificate issuance for completed donations
- **Dashboard Analytics**:
  - Total donations received count
  - Unique donor count
  - Pending, completed, and rejected donation statistics
  - Recent activity tracking
- **Donation Needs**: Specify current needs with priority levels (urgent, needed, helpful)

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Routing**: React Router DOM 6.31.0
- **UI Components**: 
  - Radix UI primitives (Accordion, Dialog, Dropdown, Popover, etc.)
  - shadcn/ui component library
  - Custom reusable components
- **Styling**: 
  - TailwindCSS 3.4.15
  - CSS Modules
  - Responsive design with mobile-first approach
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner (toast notifications)
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Font**: DM Sans (@fontsource)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: Supabase (PostgreSQL)
- **ORM/Client**: @supabase/supabase-js 2.86.2
- **Authentication**: JWT (JSON Web Tokens)
- **Environment Management**: dotenv 17.2.3
- **CORS**: cors 2.8.5
- **Development**: nodemon 3.1.11

### Database Schema

#### Tables
1. **user_profiles**
   - User authentication and profile data
   - Points, badges, and achievement tracking
   - Total donations and donation count
   - Avatar URL and location information

2. **organization_profiles**
   - Organization details and verification status
   - Logo, banner, and gallery images
   - Total received donations and donor count
   - Rating and contact information
   - Address, registration number, website

3. **donations**
   - Donation records with type and status
   - Donor and organization relationships
   - Amount, quantity, and description
   - Timestamps (created, accepted, completed, rejected)
   - Transaction and payment information

4. **certificates**
   - Digital certificate records
   - Verification codes and certificate numbers
   - Points awarded per donation
   - Certificate URLs and issue dates

5. **donation_needs**
   - Organization-specific donation requirements
   - Priority levels (low, medium, high)
   - Target and current quantities/amounts
   - Status and date ranges

6. **reviews**
   - Donor ratings and feedback for organizations
   - Anonymous review support

7. **notifications**
   - User notification system
   - Read/unread status tracking

8. **organization_donations**
   - Junction table for donation tracking
   - Receipt timestamps and notes

## 📁 Project Structure

```
donate-connect/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── userRoutes.js      # User/donor endpoints
│   │   │   ├── orgRoutes.js       # Organization endpoints
│   │   │   └── publicRoutes.js    # Public endpoints
│   │   ├── middlewares/
│   │   │   ├── auth.js            # JWT authentication
│   │   │   └── errorHandler.js   # Error handling
│   │   └── server.js              # Express app setup
│   ├── .env                       # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/           # Reusable components
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── OrgNavbar.tsx
│   │   │   │   ├── Logo.tsx
│   │   │   │   ├── PageLayout.tsx
│   │   │   │   ├── OrganizationCard.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   ├── PointsBadge.tsx
│   │   │   │   └── Skeleton.tsx
│   │   │   └── ui/               # shadcn/ui components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       ├── dialog.tsx
│   │   │       └── ... (30+ components)
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Signup.tsx
│   │   │   ├── user/             # Donor pages
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   ├── Donate.tsx
│   │   │   │   ├── Leaderboard.tsx
│   │   │   │   └── OrganizationDetails.tsx
│   │   │   ├── org/              # Organization pages
│   │   │   │   ├── OrgLogin.tsx
│   │   │   │   ├── OrgSignup.tsx
│   │   │   │   ├── OrgDashboard.tsx
│   │   │   │   ├── OrgProfile.tsx
│   │   │   │   └── OrgDonationDetail.tsx
│   │   │   ├── Index.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/
│   │   │   ├── userService.ts    # User API calls
│   │   │   ├── orgService.ts     # Organization API calls
│   │   │   ├── orgBackendService.ts
│   │   │   ├── donationService.ts
│   │   │   └── mockData.ts       # Mock data for development
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Authentication state
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   └── utils.ts          # Utility functions
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── components.json           # shadcn/ui config
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account (for database)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd donate-connect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=8080
   NODE_ENV=development
   
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:8080
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm start
```

## 📡 API Endpoints

### Public Endpoints
- `GET /api/public/organizations` - Get all organizations
- `GET /api/public/organizations/:id` - Get organization by ID

### User/Donor Endpoints
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/donations` - Get user donations with certificates
- `POST /api/users/donations` - Create new donation
- `GET /api/users/leaderboard` - Get donor leaderboard
- `GET /api/users/certificates` - Get user certificates

### Organization Endpoints
- `POST /api/organizations/signup` - Organization registration
- `POST /api/organizations/login` - Organization login
- `GET /api/organizations/profile` - Get organization profile
- `PUT /api/organizations/profile` - Update organization profile
- `GET /api/organizations/dashboard/stats` - Get dashboard statistics
- `GET /api/organizations/donations` - Get all donations for organization
- `GET /api/organizations/donations/:id` - Get donation details with donor info
- `PUT /api/organizations/donations/:id/accept` - Accept donation
- `PUT /api/organizations/donations/:id/reject` - Reject donation
- `POST /api/organizations/donations/:id/complete` - Complete donation and award points

## 🎨 Key Features Explained

### Points System
- Donors earn points for each completed donation
- Points are awarded by organizations when marking donations complete
- Points contribute to donor rankings on the leaderboard
- Badge levels: Bronze (0-99), Silver (100-249), Gold (250-499), Platinum (500+)

### Certificate Generation
- Automatically generated when organization completes a donation
- Includes verification code for authenticity
- Contains donation details, organization info, and points awarded
- Downloadable as image for tax purposes

### Organization Verification
- Organizations register with registration numbers
- Verification status displayed to donors
- Only verified organizations can receive donations

### Image Management
- Organizations can upload logo, banner, and gallery images
- Images stored as base64 or URLs in database
- File size validation (max 5MB)
- Support for multiple gallery images

### Donation Workflow
1. Donor browses organizations
2. Donor submits donation request
3. Organization receives notification
4. Organization reviews and accepts/rejects
5. Donation is fulfilled
6. Organization marks as complete and awards points
7. Certificate automatically generated
8. Donor notified and receives certificate

## 🔒 Security Features

- JWT-based authentication
- Password hashing (handled by Supabase Auth)
- Protected routes for authenticated users
- Role-based access control (donor vs organization)
- Secure API endpoints with authentication middleware
- Input validation on frontend and backend
- XSS protection
- CORS configuration

## 🎯 Future Enhancements

- Real-time notifications using WebSockets
- Payment gateway integration for monetary donations
- SMS/Email notifications
- Advanced analytics dashboard
- Mobile app (React Native)
- Social media sharing
- Organization chat system
- Volunteer management
- Recurring donations
- Impact tracking and reporting
- Multi-language support
- Dark mode theme

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Development Team


