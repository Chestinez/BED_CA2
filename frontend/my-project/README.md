# Frontend - Gamified Wellness Challenge

React + Vite frontend for the Gamified Wellness Challenge application.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Endpoint**
   
   The API endpoint is configured in `src/services/api.js`:
   ```javascript
   baseURL: "http://localhost:3000/api"
   ```
   
   Make sure the backend is running on port 3000.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Application runs on `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/              # Reusable components
│   ├── backArrow/          # Navigation component
│   ├── challenge/          # Challenge-related components
│   ├── InventoryScene/     # Ship visualization
│   ├── leaderboard/        # Leaderboard components
│   ├── navbar/             # Navigation bar
│   ├── PageLoader/         # Loading components
│   ├── profile/            # Profile components
│   └── Toast/              # Notification component
├── context/                # React Context
│   ├── authContext.jsx     # Authentication state
│   └── authContextCreator.js
├── hooks/                  # Custom hooks
│   └── useAuth.js          # Auth hook
├── pages/                  # Page components
│   ├── challenges/         # Challenge pages
│   ├── Dashboard/          # Dashboard page
│   ├── Inventory/          # Inventory & profile pages
│   ├── leaderboard/        # Leaderboard page
│   ├── Login/              # Login page
│   ├── Register/           # Register page
│   └── shop/               # Shop page
├── services/               # API services
│   └── api.js              # Axios configuration
├── utils/                  # Utilities
│   └── ProtectedRoutes.jsx # Route protection
├── App.jsx                 # Main app component
└── main.jsx                # Entry point
```

## Key Features

### Pages
- **Dashboard** - User stats, rank progression, ship visualization
- **Challenges** - Browse and start challenges
- **Challenge Profile** - Manage created challenges
- **Create Challenge** - Form to create new challenges
- **Shop** - Browse and purchase ship parts
- **Inventory** - Manage owned parts, equip/unequip
- **Profile** - View user profile, edit account
- **Leaderboard** - View rankings and search users

### Components
- **Loaders** - Consistent loading states (Loader, PageLoadWrap, ContentLoadWrap)
- **Modals** - Edit challenge, delete confirmation, completion
- **Toast** - Notification system
- **Ship Assembly** - Visual ship display with equipped parts

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes
- Auth context for global state

## Routing

```javascript
/ or /dashboard          → Dashboard (protected)
/login                   → Login page
/register                → Register page
/challenges              → Browse challenges (protected)
/challenges/create       → Create challenge (protected)
/challenges/profile      → My challenges (protected)
/challenges/:id          → Challenge details (protected)
/shop                    → Shop (protected)
/inventory               → Inventory (protected)
/profile                 → Own profile (protected)
/profile/:username       → Public profile (protected)
/leaderboard             → Leaderboard (protected)
```

## State Management

- **Auth Context** - Global authentication state
- **Local State** - Component-specific state with useState
- **API Calls** - Axios with interceptors for token refresh

## Styling

- **Bootstrap 5** - Main CSS framework
- **Custom CSS** - Additional styling in component files
- **GSAP** - Animations on Dashboard
- **Lucide React** - Icon library

## API Integration

All API calls go through `src/services/api.js` which:
- Sets base URL to backend
- Includes credentials (cookies)
- Automatically refreshes expired tokens
- Handles 401 errors

## Development

**Hot Module Replacement (HMR):**
Vite provides instant updates during development without full page reload.

**ESLint:**
Code linting is configured. Run `npm run lint` to check for issues.

## Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "axios": "^1.7.9",
  "bootstrap": "^5.3.3",
  "lucide-react": "^0.468.0",
  "gsap": "^3.12.5"
}
```

## Environment

- **Node.js**: v14 or higher
- **Vite**: v6.0.3
- **React**: v18.3.1

## Build Output

Production build creates optimized files in `dist/` folder:
```bash
npm run build
npm run preview  # Preview production build
```

## Troubleshooting

**Port already in use:**
```bash
# Change port in vite.config.js or kill process on 5173
```

**API connection failed:**
- Verify backend is running on port 3000
- Check CORS settings in backend
- Verify API base URL in `src/services/api.js`

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Notes

- All routes except `/login` and `/register` require authentication
- Tokens are stored in HTTP-only cookies
- Automatic redirect to dashboard after login
- Automatic redirect to login when token expires
