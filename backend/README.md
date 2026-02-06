# Backend - Gamified Wellness Challenge API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   
   Create `.env` file in the `backend/` folder:
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

3. **Create Database**
   ```sql
   CREATE DATABASE wellness;
   ```

4. **Initialize Tables**
   ```bash
   node src/configs/initTables.js
   ```
   This will create all tables and seed initial data (ranks, difficulties, sample parts).

5. **Start Server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3000`

## Project Structure

```
backend/
├── src/
│   ├── configs/
│   │   └── initTables.js       # Database schema & seeding
│   ├── controllers/            # Request handlers
│   │   ├── userController.js
│   │   ├── challengesController.js
│   │   ├── completionsController.js
│   │   ├── resourceController.js
│   │   └── difficultyController.js
│   ├── middleware/             # Authentication & validation
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   ├── ownership.middleware.js
│   │   └── isActive.middleware.js
│   ├── models/                 # Database queries
│   │   ├── userModel.js
│   │   ├── challengesModel.js
│   │   ├── completionsModel.js
│   │   ├── resourceModel.js
│   │   └── difficultyModel.js
│   ├── routes/                 # API endpoints
│   │   ├── userRoutes.js
│   │   ├── challengesRoutes.js
│   │   ├── completionsRoutes.js
│   │   ├── resourceRoutes.js
│   │   └── difficultyRoutes.js
│   └── services/
│       └── db.js               # MySQL connection pool
├── utils/
│   ├── AppError.js             # Custom error class
│   └── errorHandler.js         # Global error handler
├── index.js                    # Server entry point
├── package.json
└── .env                        # Environment variables (create this)
```

## API Endpoints

### Users (`/api/users`)

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| POST | `/register` | - | Create new account |
| POST | `/login` | - | Authenticate user |
| GET | `/logout` | auth | Logout user |
| GET | `/refresh` | - | Refresh JWT token |
| GET | `/profile/me` | auth | Get own profile |
| GET | `/profile/:username` | - | Get public profile |
| GET | `/leaderboard` | - | View rankings |
| GET | `/leaderboard/position` | auth | Get own rank |
| GET | `/leaderboard/position/username/:username` | - | Get user rank |
| PUT | `/update` | auth | Update profile |
| DELETE | `/delete` | auth | Delete account |
| GET | `/selectAll` | auth, admin | Admin: View all users |
| GET | `/selectById/:id` | auth, admin | Admin: View user by ID |

### Challenges (`/api/challenges`)

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| GET | `/selectAll` | - | View all challenges |
| GET | `/selectById/:id` | - | View challenge details |
| GET | `/selectAllByCreatorId` | auth | View own challenges |
| GET | `/:id/users` | - | View challenge completions |
| POST | `/create` | auth | Create challenge |
| POST | `/:id/start` | auth, isActive | Start challenge |
| POST | `/:id/complete` | auth, isActive | Complete challenge |
| POST | `/:id/abandon` | auth | Abandon challenge |
| PUT | `/update/:id` | auth, ownership | Update challenge |
| DELETE | `/delete/:id` | auth, ownership | Delete challenge |

### Completions (`/api/completions`)

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| GET | `/pending` | auth | View pending challenges |
| GET | `/missions` | auth | View challenge history |
| GET | `/users/:id` | - | View user completions |

### Resources (`/api/resources`)

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| GET | `/shop` | auth | Browse shop |
| GET | `/inventory` | auth | View inventory |
| GET | `/inventory/equipped` | auth | View equipped parts |
| GET | `/ship` | auth | Get ship info |
| POST | `/purchase/:partId` | auth | Purchase part |
| PUT | `/equip/:partId` | auth | Equip part |
| PUT | `/unequip/:inventoryId` | auth | Unequip part |

### Difficulties (`/api/difficulties`)

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| GET | `/` | - | Get all difficulties |
| GET | `/:id` | - | Get difficulty by ID |

## Middleware

- **auth** - Verifies JWT token
- **admin** - Checks admin role
- **ownership** - Verifies resource ownership
- **isActive** - Checks if challenge is active

## Database Schema

### Tables
- `user` - User accounts (id, username, email, password, points, credits, role)
- `rank` - Rank tiers (id, name, min_points, max_slots)
- `challenges` - Challenges (id, title, description, points_rewarded, credits_rewarded, duration_days, difficulty_id, creator_id, is_active)
- `difficulty` - Difficulty levels (id, name, min_value, max_value)
- `user_completions` - Challenge progress (id, user_id, challenge_id, status, notes, started_at, completed_at)
- `ship_parts` - Available parts (id, name, category, cost, quality, slot_size, description)
- `user_inventory` - Owned parts (id, user_id, part_id, is_equipped, purchased_at)
- `refresh_tokens` - JWT tokens (id, user_id, token, expires_at)

## Error Handling

All errors are handled by the global error handler in `utils/errorHandler.js`. Custom errors use the `AppError` class.

## Authentication

- Uses JWT access tokens (15min expiry) and refresh tokens (7 days)
- Tokens stored in HTTP-only cookies
- Automatic token refresh on 401 errors

## Testing

Use Postman or similar tool to test endpoints. Import the API collection if provided.

## Dependencies

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.5",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "cookie-parser": "^1.4.6",
  "nodemon": "^3.0.2"
}
```

## Notes

- Database transactions are used for critical operations (purchase, equip, complete challenge)
- Passwords are hashed with bcrypt (10 rounds)
- All dates stored in MySQL DATETIME format
- Slot capacity is validated when equipping parts
