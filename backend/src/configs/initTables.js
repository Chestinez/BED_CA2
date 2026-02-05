// initTable.js
require('dotenv').config({ path: '../../.env' });
const pool = require("../services/db");

const initializeDatabase = async () => {
  console.log("Syncing database tables>>>");

  try {
    // Create tables only if they don't exist (safer approach)
    // No dropping of existing tables to preserve data

    // Create difficulty table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS difficulty (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        min_value INT NOT NULL
      )
    `);

    // Insert difficulty data only if table is empty
    const difficultyCount = await executeQuery("SELECT COUNT(*) as count FROM difficulty");
    if (difficultyCount[0].count === 0) {
      await executeQuery(`
        INSERT INTO difficulty (name, min_value) VALUES 
        ('Easy', 0), ('Medium', 51), ('Hard', 101)
      `);
    }

    // Create rank table (using backticks because rank is a reserved word)
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS \`rank\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        min_points INT DEFAULT 0,
        max_slots INT DEFAULT 5
      )
    `);

    // Insert rank data only if table is empty
    const rankCount = await executeQuery("SELECT COUNT(*) as count FROM `rank`");
    if (rankCount[0].count === 0) {
      await executeQuery(`
        INSERT INTO \`rank\` (name, min_points, max_slots) VALUES 
        ('Recruit', 0, 5), ('Pilot', 500, 10), ('Commander', 1100, 15), 
        ('Admiral', 1700, 20), ('Fleet-Admiral', 2400, 30), ('Big-Boss', 3500, 40)
      `);
    }

    // Create user table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        points INT DEFAULT 0,
        credits INT DEFAULT 0,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        description TEXT
      )
    `);

    // Create challenges table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        points_rewarded INT DEFAULT 0,
        credits_rewarded INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        duration_days INT DEFAULT 1,
        creator_id INT,
        difficulty_id INT NOT NULL,
        is_active ENUM('0', '1') DEFAULT '1',
        FOREIGN KEY (difficulty_id) REFERENCES difficulty(id)
      )
    `);

    // Create user_completions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_completions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        challenge_id INT NOT NULL,
        status ENUM('pending', 'completed') DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
      )
    `);

    // Create ship_parts table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS ship_parts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cost INT NOT NULL,
        category ENUM('Engine', 'Shield', 'Weapon', 'Hull','Hybrid'),
        image_url VARCHAR(255),
        slot_size INT NOT NULL
      )
    `);

    // Insert ship_parts data only if table is empty
    const partsCount = await executeQuery("SELECT COUNT(*) as count FROM ship_parts");
    if (partsCount[0].count === 0) {
      await executeQuery(`
        INSERT INTO ship_parts (name, description, cost, category, image_url, slot_size) VALUES
        ('Ion Thruster v1', 'Basic propulsion for cadet pilots.', 100, 'Engine', 'url1', 2),
        ('Titanium Plating', 'Extra protection against space debris.', 250, 'Hull', 'url2', 4),
        ('Plasma Cannon', 'Standard defense for deep nebula exploration.', 500, 'Weapon', 'url3', 100)
      `);
    }

    // Create user_inventory table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        part_id INT NOT NULL,
        purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_equipped ENUM('equipped', 'unequipped') DEFAULT 'unequipped',
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (part_id) REFERENCES ship_parts(id) ON DELETE CASCADE
      )
    `);

    console.log("Starship Systems Online: Schema Synced");
    process.exit(0);
  } catch (error) {
    console.error("Sync Error:", error);
    process.exit(1);
  }
};

function executeQuery(sql) {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

initializeDatabase();
