const db = require('../db');

function findById(listId) {
  const query = db.prepare(`SELECT * FROM lists WHERE id = ?`);
  return query.get(listId);
}

module.exports = {
  findById,
};