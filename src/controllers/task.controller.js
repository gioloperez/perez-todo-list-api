const taskService = require('../services/task.service');

function getTasksByListId(req, res) {
  const listId = parseInt(req.params.listId);
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;

  if (isNaN(listId)) {
    return res.status(400).json({ error: 'Invalid List ID' });
  }
  
  try {
    const tasks = taskService.getTasksByListId(listId, limit, offset);
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    if (err.message === 'LIST_NOT_FOUND') {
      return res.status(404).json({ error: 'List not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

function createTask(req, res) {
  const listId = parseInt(req.params.listId);
  const { title } = req.body;

  if (isNaN(listId)) {
    return res.status(400).json({ error: 'Invalid List ID' });
  }

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }

  try {
    const task = taskService.createTask(listId, title);
    res.status(201).json(task);
  } catch (err) {
    if (err.message === 'LIST_NOT_FOUND') {
      return res.status(404).json({ error: 'List not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getTasksByListId,
  createTask,
}
