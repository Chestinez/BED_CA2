require('dotenv').config();
const mysql = require('mysql2')

// database connection
// where process.env.DB_HOST, process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD are defined in .env file
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
})

module.exports = pool