// initTable.js
const pool = require("../services/db");

const sql = `
  SET FOREIGN_KEY_CHECKS = 0;
  DROP TABLE IF EXISTS user_completions, user_inventory, challenges, ship_parts, rank, difficulty, user;
  SET FOREIGN_KEY_CHECKS = 1;
  
  -- Creating tables
  -- difficulty table
  CREATE TABLE difficulty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    min_value INT NOT NULL
  );
  -- Inserting different difficulties into difficulty table
  INSERT INTO difficulty (name, min_value) VALUES ('Easy', 0), ('Medium', 51), ('Hard', 101);
  
  --rank table
  CREATE TABLE rank (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    min_points INT DEFAULT 0,
    max_slots INT DEFAULT 5
  );
  -- Inserting different ranks into rank table
  INSERT INTO rank (name, min_points, max_slots) VALUES ('Recruit', 0, 5), ('Pilot', 500, 10), ('Commander', 1100, 15), ('Admiral', 1700, 20), ('Fleet-Admiral', 2400, 30), ('Big-Boss', 3500, 40);
  
  -- user table
  CREATE TABLE user (
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
  );
  -- Different users, cannot be directly inserted user table.
  -- Rather use the /register endpoint to directly create a user,
  -- as i used bcrypt to hash passwords ensuring important user details are secure.
  
  -- challenges table
  CREATE TABLE challenges (
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
  );
  --Different challenges, cannot be directly inserted into challenges table.
  --Rather use the /create endpoint to directly create a challenge,
  --as i used auth middleware to ensure only logged in users/ users with their user id can create challenges.

  -- user_completions table
  CREATE TABLE user_completions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
  );
  --Different records of challenges completions, cannot be directly inserted into user_completions table.
  --Rather use the /:id/start endpoint to directly create a record,
  --as i used auth middleware to ensure only logged in users/ users with their user id can create records.
  --that and challenge id from params is also needed
  
  -- ship_parts table
  CREATE TABLE ship_parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cost INT NOT NULL,
    category ENUM('Engine', 'Shield', 'Weapon', 'Hull','Hybrid'),
    image_url VARCHAR(255),
    slot_size INT NOT NULL
  );
  --KEEP IN MIND---
  --These are mock parts to be inserted, but slot_sizes can be changed after insertion,
  -- especially the "Plasma Canon" as its slot size is 100(overwhelmingly large), used for testing
  -- also image_url are mock values as i plan to use them for frontend, and simply used terms like "url1" as a placeholder
  INSERT INTO ship_parts (name, description, cost, category, image_url, slot_size) VALUES
  ('Ion Thruster v1', 'Basic propulsion for cadet pilots.', 100, 'Engine', 'url1', 2),
  ('Titanium Plating', 'Extra protection against space debris.', 250, 'Hull', 'url2', 4),
  ('Plasma Cannon', 'Standard defense for deep nebula exploration.', 500, 'Weapon', 'url3', 100);
  
  -- user_inventory table
  CREATE TABLE user_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    part_id INT NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_equipped ENUM('equipped', 'unequipped') DEFAULT 'unequipped',
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (part_id) REFERENCES ship_parts(id) ON DELETE CASCADE
  );
  --Different records of parts in user_inventory, cannot be directly inserted into user_inventory table.
  --Rather use the /purchase/:partId endpoint to directly create a record,
  --as i used auth middleware to ensure only logged in users/ users with their user id can create records.
  --that and both partId from params is also needed
`;

console.log("Syncing database tables>>>");

pool.query(sql, (err) => {
  // sync tables via querying to the db at the start
  if (err) {
    console.error("Sync Error:", err);
    process.exit(1);
  }
  console.log("Starship Systems Online: Schema Synced");
  process.exit(0);
});
