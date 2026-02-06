# Gamified Wellness Challenge Application

**Full Name:** Lee Jun Lin Cheston  
**Admission No:** P2509358  
**Course:** ST0503 Backend Web Development  
**Assignment:** CA2  
**Class:** DIT/FT/1B/01

## Project Overview

A full-stack gamified wellness application where users complete challenges to earn points and credits. Users can purchase ship parts from the shop and customize their ships based on their rank progression. Features include challenge management, leaderboard rankings, inventory system, and profile customization.

**Theme:** Spaceship Builder

## Tech Stack

### Backend
- Node.js + Express
- MySQL
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React + Vite
- React Router
- Axios
- Bootstrap 5
- GSAP (animations)
- Lucide React (icons)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chestinez/BED_CA2
   cd BED_CA2
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file in `backend/` folder:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=<your-mysql-password>
   DB_DATABASE=wellness
   DB_PORT=3306
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-key-here
   ```

   Create MySQL database:
   ```sql
   CREATE DATABASE wellness;
   ```

   Initialize database tables:
   ```bash
   node src/configs/initTables.js
   ```

   Start backend server:
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:3000`

3. **Frontend Setup**
   ```bash
   cd frontend/my-project
   npm install
   ```

   Start frontend:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Access the Application**
   - Open browser to `http://localhost:5173`
   - Register a new account or use test credentials (if seeded)

## Project Structure

```
BED_CA2/
├── backend/
│   ├── src/
│   │   ├── configs/        # Database initialization
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation
│   │   ├── models/         # Database queries
│   │   ├── routes/         # API endpoints
│   │   └── services/       # Database connection
│   ├── utils/              # Error handling
│   └── index.js            # Server entry point
│
└── frontend/my-project/
    └── src/
        ├── components/     # Reusable components
        ├── context/        # Auth context
        ├── hooks/          # Custom hooks
        ├── pages/          # Page components
        ├── services/       # API configuration
        └── utils/          # Helper functions
```

## Features

### Core Features
- ✅ User authentication (register, login, logout)
- ✅ Challenge system (create, edit, delete, start, complete)
- ✅ Shop system (browse and purchase ship parts)
- ✅ Inventory management (equip/unequip parts)
- ✅ Profile system (view, edit, delete account)
- ✅ Leaderboard with search
- ✅ Rank progression system
- ✅ Ship visualization

### Technical Features
- JWT token authentication with refresh tokens
- Protected routes
- Database transactions
- Input validation
- Error handling
- Loading states
- Responsive design

## API Documentation

See [backend/README.md](backend/README.md) for detailed API endpoint documentation.

## Database Schema

The application uses 8 main tables:
- `user` - User accounts and stats
- `rank` - Rank tiers with slot capacity
- `challenges` - Available challenges
- `difficulty` - Challenge difficulty levels
- `user_completions` - Challenge progress tracking
- `ship_parts` - Available parts in shop
- `user_inventory` - User's owned parts
- `refresh_tokens` - JWT refresh tokens

## Troubleshooting

**Backend won't start:**
- Check if MySQL is running
- Verify `.env` file exists with correct credentials
- Ensure database `wellness` is created

**Frontend won't start:**
- Check if backend is running on port 3000
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Can't login:**
- Verify backend is running
- Check browser console for errors
- Ensure database is initialized with `initTables.js`

## Development

**Backend:**
```bash
cd backend
npm run dev  # Runs with nodemon (auto-restart)
```

**Frontend:**
```bash
cd frontend/my-project
npm run dev  # Runs with Vite HMR
```

## Submission Notes

- All `node_modules` folders have been removed for submission
- Run `npm install` in both `backend/` and `frontend/my-project/` to restore dependencies
- Database must be initialized before first use

## License

This project is for educational purposes as part of ST0503 Backend Web Development course.
