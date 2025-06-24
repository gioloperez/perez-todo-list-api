const db = require('../db');

function findTasksByListId(listId, limit = 100, offset = 0) {
  const query = db.prepare(`
    SELECT id, title, position
    FROM tasks
    WHERE list_id = ?
    ORDER BY position ASC
    LIMIT ? OFFSET ?
  `);
  return query.all(listId, limit, offset);
}

module.exports = {
  findTasksByListId,
};