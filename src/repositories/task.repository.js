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

function findLastTaskInList(listId) {
  const query = db.prepare(`
    SELECT * FROM tasks
    WHERE list_id = ?
    ORDER BY position DESC
    LIMIT 1
  `);
  return query.get(listId);
}

function createTask(listId, title, position) {
  const query = db.prepare(`
    INSERT INTO tasks (list_id, title, position)
    VALUES (?, ?, ?)
  `);
  const result = query.run(listId, title, position);
  return { id: result.lastInsertRowid, listId, title, position };
}
 
module.exports = {
  findTasksByListId,
  findLastTaskInList,
  createTask,
};