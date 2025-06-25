const db = require('../db');

function findById(taskId) {
  const query = db.prepare(`SELECT * FROM tasks WHERE id = ?`);
  return query.get(taskId);
}

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

function findNextTask(listId, position) {
  const query = db.prepare(`
    SELECT *
    FROM tasks
    WHERE list_id = ? AND position > ?
    ORDER BY position ASC
    LIMIT 1
  `);
  return query.get(listId, position);
}

function findPreviousTask(listId, position) {
  const query = db.prepare(`
    SELECT *
    FROM tasks
    WHERE list_id = ? AND position < ?
    ORDER BY position DESC
    LIMIT 1
  `);
  return query.get(listId, position);
}

function createTask(listId, title, position) {
  const query = db.prepare(`
    INSERT INTO tasks (list_id, title, position)
    VALUES (?, ?, ?)
  `);
  const result = query.run(listId, title, position);
  return { id: result.lastInsertRowid, listId, title, position };
}

function updateTask(taskId, title, position) {
  const query = db.prepare(`
    UPDATE tasks
    SET title = ?, position = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  return query.run(title, position, taskId);
}

function deleteTask(taskId) {
  const query = db.prepare(`DELETE FROM tasks WHERE id = ?`);
  return query.run(taskId);
}

module.exports = {
  findById,
  findTasksByListId,
  findLastTaskInList,
  findNextTask,
  findPreviousTask,
  createTask,
  updateTask,
  deleteTask,
};
