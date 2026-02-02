const pool = require("../services/db.js");

module.exports = {
  // getallshopitems
  // this model is used to get all items in the shop/ the items in ship parts
  // this model is used by the /shop endpoint
  getallshopitems(userId, callback) {
    const sql = `
    SELECT
     p.id AS part_id,
     p.name,
     p.category,
     p.cost,
     p.image_url,
     p.slot_size,
     p.description,
     ui.id AS inventory_id
     FROM ship_parts p
     LEFT JOIN user_inventory ui ON p.id = ui.part_id AND ui.user_id = ?
     ORDER BY p.cost DESC
    `;

    pool.query(sql, [userId], (err, results) => {
      if (err) return callback(err);
      return callback(null, results);
    });
  },

  // purchasePart
  // this model is used to purchase a part
  // this model is used by the /purchase endpoint
  //this model uses a full transaction
  purchasePart(data, callback) {
    pool.getConnection((err, connection) => {
      if (err) return callback(err);

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return callback(err);
        }

        // check if there is a recors in user_inventory, hence part is already bought by user
        const ownershipchecksql =
          "SELECT id FROM user_inventory WHERE part_id = ? AND user_id = ?";
        connection.query(
          ownershipchecksql,
          [data.partId, data.userId],
          (err, ownershipcheckresults) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return callback(err);
              });
            } else if (
              // if there is a record in user_inventory, return error
              ownershipcheckresults &&
              ownershipcheckresults.length > 0
            ) {
              return connection.rollback(() => {
                connection.release();
                return callback(new Error("Part already owned"));
              });
            }

            // get cost of part
            const getpartcostsql = `SELECT cost FROM ship_parts WHERE id = ?`;
            connection.query(
              getpartcostsql,
              [data.partId],
              (err, getpartcostresults) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    return callback(err);
                  });
                } else if (
                  // if there is no record of this part in ship_parts, return error
                  // hence no cost obtained
                  !getpartcostresults ||
                  getpartcostresults.length === 0
                ) {
                  return connection.rollback(() => {
                    connection.release();
                    return callback(new Error("Part not found"));
                  });
                }
                // part cost obtained
                const partscost = getpartcostresults[0].cost;
                // update user credit count by deducting the cost from it
                const updatesql = `UPDATE user SET credits = credits - ? WHERE id = ? AND credits >= ?`;
                connection.query(
                  updatesql,
                  [partscost, data.userId, partscost],
                  (err, updateresults) => {
                    if (err) {
                      connection.rollback(() => {
                        connection.release();
                        return callback(err);
                      });
                    } else if (
                      // if there is no change to credits, return error
                      // hence insufficient credits to buy part
                      !updateresults ||
                      updateresults.affectedRows === 0 ||
                      updateresults.changedRows === 0
                    ) {
                      return connection.rollback(() => {
                        connection.release();
                        return callback(new Error("Insufficient credits"));
                      });
                    }

                    // insert into user_inventory
                    // hence part is successfully bought by user
                    const inserttransactionsql = `INSERT INTO user_inventory (user_id, part_id) VALUES (?, ?)`;
                    connection.query(
                      inserttransactionsql,
                      [data.userId, data.partId],
                      (err, insertresults) => {
                        if (err) {
                          return connection.rollback(() => {
                            connection.release();
                            return callback(err);
                          });
                        }
                        // get new credit count
                        const getcreditssql =
                          "SELECT credits FROM user WHERE id = ?";
                        connection.query(
                          getcreditssql,
                          [data.userId],
                          (err, results) => {
                            if (err) {
                              return connection.rollback(() => {
                                connection.release();
                                return callback(err);
                              });
                            }
                            // obtain new credit count
                            const newcredits = results[0].credits;
                            connection.commit((err) => {
                              if (err) {
                                connection.rollback(() => {
                                  connection.release();
                                  return callback(err);
                                });
                              }
                              connection.release();
                              return callback(null, {
                                ...data,
                                newCredits: newcredits,
                              });
                            });
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    });
  },

  // getAllPartsOwnedbyUser
  // this model is used to get all parts owned by a user
  // this model is used by the /inventory endpoint
  getAllPartsOwnedbyUser(userId, callback) {
    const sql = `SELECT
     ui.id AS inventory_id,
     p.id AS part_id,
     p.name,
     p.category,
     p.cost,
     p.image_url,
     p.slot_size,
     p.description,
     ui.is_equipped,
     ui.purchased_at 
     FROM user_inventory ui
     JOIN ship_parts p ON ui.part_id = p.id
     WHERE ui.user_id = ?
     ORDER BY p.cost DESC
     `;

    pool.query(sql, [userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      return callback(null, results);
    });
  },

  // getAllequippedParts
  // this model is used to get all equipped parts owned by a user
  // this model is used by the /inventory/equipped endpoint
  getAllequippedParts(userId, callback) {
    const sql = `SELECT
     ui.id AS inventory_id,
     p.id AS part_id,
     p.name,
     p.category,
     p.cost,
     p.image_url,
     p.slot_size,
     p.description
     FROM user_inventory ui
     JOIN ship_parts p ON ui.part_id = p.id
     WHERE ui.user_id = ? AND ui.is_equipped = 'equipped'
     ORDER BY p.cost DESC
    `;

    pool.query(sql, [userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      return callback(null, results);
    });
  },

  // equipPart
  // this model is used to equip a part owned by a user
  // this model is used by the equip/:partId endpoint
  // this model uses a full transaction
  equipPart(data, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        return callback(err);
      }
      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return callback(err);
        }

        // this huge get query, subqueries and obtains 4 values
        // newPartSlotSize, currentequippedstatus, currentEquippedSize, currentmaxSlotSizebyRank
        // newPartSlotSize: the slot size of the part that is going to be equipped
        // currentequippedstatus: the current equipped status of the part that is going to be equipped
        // currentEquippedSize: the current equipped size of the user
        // currentmaxSlotSizebyRank: the current max slot size of the user
        const sql = `
        SELECT
         (SELECT p.slot_size FROM ship_parts p JOIN user_inventory ui ON p.id = ui.part_id WHERE ui.part_id = ? AND ui.user_id = ?) AS newPartSlotSize,
         (SELECT ui.is_equipped FROM user_inventory ui WHERE ui.part_id = ? AND ui.user_id = ?) AS currentequippedstatus,
         (SELECT IFNULL(SUM(p.slot_size), 0) FROM ship_parts p JOIN user_inventory ui ON p.id = ui.part_id WHERE p.id != ? AND ui.user_id = ? AND ui.is_equipped = 'equipped') AS currentEquippedSize,
         (SELECT r.max_slots FROM \`rank\` r JOIN user u ON u.points >= r.min_points WHERE u.id = ? ORDER BY r.min_points DESC LIMIT 1) AS currentmaxSlotSizebyRank
        `;

        connection.query(
          sql,
          [
            data.partId,
            data.userId,
            data.partId,
            data.userId,
            data.partId,
            data.userId,
            data.userId,
          ],
          (err, results) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return callback(err);
              });
            }

            if (!results || results.length === 0) {
              return connection.rollback(() => {
                connection.release();
                return callback(err);
              });
            }

            // destructure the results
            const {
              newPartSlotSize,
              currentequippedstatus,
              currentEquippedSize,
              currentmaxSlotSizebyRank,
            } = results[0];

            if (newPartSlotSize === null || newPartSlotSize === undefined) {
              return connection.rollback(() => {
                connection.release();
                return callback(new Error("Part or rank data not found"));
              });
            }
            // if the part is already equipped, return error
            if (currentequippedstatus === "equipped") {
              return connection.rollback(() => {
                connection.release();
                return callback(new Error("Part already equipped"));
              });
            }

            // calculate if the new part will fit in the user's inventory
            // if not, return error
            if (
              newPartSlotSize + currentEquippedSize >
              currentmaxSlotSizebyRank
            ) {
              return connection.rollback(() => {
                connection.release();
                return callback(new Error("Insufficient slot capacity"));
              });
            }

            // update user_inventory to equip part
            const updatesql = `UPDATE user_inventory SET is_equipped = 'equipped' WHERE part_id = ? AND user_id = ?`;
            connection.query(
              updatesql,
              [data.partId, data.userId],
              (err, updateresults) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    return callback(err);
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      return callback(err);
                    });
                  }
                  connection.release();
                  return callback(null, updateresults);
                });
              }
            );
          }
        );
      });
    });
  },

  // removepart
  // this model is used to remove a part owned by a user
  // this model is used by the unequip/:inventoryId endpoint
  removepart(data, callback) {
    const sql = `UPDATE user_inventory ui SET is_equipped = 'unequipped' WHERE ui.id = ? AND ui.user_id = ? `;

    pool.query(sql, [data.inventoryId, data.userId], (err, results) => {
      if (err) {
        return callback(err);
      }

      return callback(null, results);
    });
  },

  // getUserShipByRank
  // this model is used to get user's ship based on their rank
  // this model is used by the /ship endpoint
  getUserShipByRank(userId, callback) {
    const sql = `
      SELECT 
        u.id as user_id,
        u.username,
        u.points,
        r.id as rank_id,
        r.name as rank_name,
        r.max_slots,
        CASE 
          WHEN r.id = 1 THEN 'Ship1.png'
          WHEN r.id = 2 THEN 'Ship2.png'
          WHEN r.id = 3 THEN 'Ship3.png'
          WHEN r.id = 4 THEN 'Ship4.png'
          WHEN r.id = 5 THEN 'Nairan - Battlecruiser - Base.png'
          WHEN r.id = 6 THEN 'Nairan - Dreadnought - Base.png'
          ELSE 'Ship1.png'
        END as base_ship_image,
        (SELECT IFNULL(SUM(p.slot_size), 0) 
         FROM ship_parts p 
         JOIN user_inventory ui ON p.id = ui.part_id 
         WHERE ui.user_id = ? AND ui.is_equipped = 'equipped') AS used_slots
      FROM user u
      JOIN \`rank\` r ON u.points >= r.min_points
      WHERE u.id = ?
      ORDER BY r.min_points DESC
      LIMIT 1
    `;
    
    pool.query(sql, [userId, userId], (err, results) => {
      if (err) return callback(err);
      if (!results || results.length === 0) {
        return callback(new Error("User not found"));
      }
      
      const shipData = results[0];
      shipData.available_slots = shipData.max_slots - shipData.used_slots;
      
      callback(null, shipData);
    });
  },
};
