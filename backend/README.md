# Starter Repository for Assignment

You are required to build your folder structures for your project.

# Gamified Wellness Challenge Api

Theme: Spacehip builder
Full Name: Lee Jun Lin Cheston
Admission No.: P2509358
Course: ST0503 Backend Web Development  
Assignment: CA1
Class: DIT/FT/1B/01

## Project Overview

This is a Node.js backend for a Starship management system. Users earn points and credits through challenges to purchase ship parts, which are then equipped based on the user's Rank and the ship's remaining capacity.
Build and customise a ship with different parts, of different types to even how much space each part occupies

## Project Structure

src/
├── configs/initTable.js # Database schema & seeding script
├── controllers/ # Request handling & input validation
├── middleware/ # Auth, Ownership, and Global Error Handling
├── models/ # SQL Logic & Transactions for querying db
├── routes/ # RESTful API Endpoints
└── services/ # Database connection pool (db.js)
|** utils/ # Global error handling
|** index.js # final place where project runs

## Tech stack

node.js
---------dependencies------------
express
mysql2
dotenv
cors
bcrypt
nodemon

---

Postman (for testing)

## Setup

git clone https://github.com/ST0503-BED/bed-ca1-Chestinez
Install dependencies
npm install

Create a .env file in project root:

PORT = 3000

DB_HOST = localhost
DB_USER = root
DB_PASSWORD = < your localhost mysql password >
DB_DATABASE = wellness
DB_PORT = 3306

Within mysql create a new schema called wellness

Run `node initTable.js` to create and seed the tables. (keep note of comments within initTables.js and certain things which will be inserted into the database tables, particularly ship_parts)

npm run dev(In terminal)

now the api and all endpoints will be on http://localhost:3000

## API Endpoints

(Use the table format from your friend's README here, but use your ship/part endpoints)

Method | Endpoint | Middleware | Description

### Users

POST, /register, -, Create a new account with hashed password.
GET, /login, -, Authenticate user and return userId.
GET, /profile/me, auth, View your own user stats.
GET, /profile/:username, -, View public profile of another user by their username.
GET, /leaderboard, -, View global rankings of points and credits(secondarily) with a optional filter of how many from the top.
GET, /leaderboard/position, auth, Get your specific rank position.
GET, /leaderboard/position/username/:username, GET specific rank of a user by their username
PUT, /update, auth, Update account details.
DELETE, /delete, auth, Remove account from system.
GET, /selectAll, "auth, admin", Admin Only: View all registered users and all details.
GET, /selectById/:id, "auth, admin", Admin Only: View registered user and all details by their id.

### Challenges

GET, /selectAll, -, View all available wellness challenges of any status.
GET, /selectById/:id, -, View details for a specific challengeId.
GET, /selectAllByCreatorId, auth, View challenges you created.
GET, /:id/users, -, View users who completed a challenge.
POST, /create, auth, Create a new challenge.
POST, /:id/start, "auth, isActive", Begin a challenge.
POST, /:id/complete, "auth, isActive", Claim Points/Credits upon completion.
PUT, /update/:id, "auth, ownership", Edit challenge (Creator only).
DELETE, /delete/:id, "auth, ownership", Remove challenge (Creator only).

### Completions

GET, /missions, auth, View your history of started/completed challenges.
GET, /users/:id, -, See which users completed a specific challenge.

### Resources

GET, /shop, auth, Browse the shop for ship components.
GET, /inventory, auth, View all parts currently in your storage.
GET, /inventory/equipped, auth, View parts currently mounted to your ship.
POST, /purchase/:partId, auth, Buy a part using credits.
PUT, /equip/:partId, auth, Mount part (Capacity Check).
PUT, /unequip/:inventoryId, auth, Remove part to free up slot space.
