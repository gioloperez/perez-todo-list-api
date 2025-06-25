const taskService = require('../services/task.service');

function getTasksByListId(req, res) {
  const listId = parseInt(req.params.listId);
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;

  if (isNaN(listId)) {
    return res.status(400).json({ error: 'Invalid listId' });
  }

  try {
    const tasks = taskService.getTasksByListId(listId, limit, offset);
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    if (err.message === 'LIST_NOT_FOUND') {
      return res.status(404).json({ error: 'List not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

function createTask(req, res) {
  const listId = parseInt(req.params.listId);
  const { title } = req.body;

  if (isNaN(listId)) {
    return res.status(400).json({ error: 'Invalid listId' });
  }

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }

  try {
    const task = taskService.createTask(listId, title);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    if (err.message === 'LIST_NOT_FOUND') {
      return res.status(404).json({ error: 'List not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

function updateTask(req, res) {
  const taskId = parseInt(req.params.taskId);
  const { title, beforeTaskId, afterTaskId } = req.body;

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid taskId' });
  }

  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string' });
  }

  if (
    beforeTaskId !== undefined && isNaN(parseInt(beforeTaskId)) ||
    afterTaskId !== undefined && isNaN(parseInt(afterTaskId))
  ) {
    return res.status(400).json({ error: 'beforeTaskId and afterTaskId must be valid numbers' });
  }

  try {
    const updatedTask = taskService.updateTask(taskId, { title, beforeTaskId, afterTaskId });
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
    if (err.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getTasksByListId,
  createTask,
  updateTask,
}
