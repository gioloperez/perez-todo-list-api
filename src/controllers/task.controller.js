const TaskService = require('../services/task.service');
const { validateTitle, validateTaskIds } = require('../utils/validators/task.validator');

function getTasksByListId(req, res) {
  const listId = parseInt(req.params.listId);
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;

  if (isNaN(listId)) {
    return res.status(400).json({ error: 'Invalid listId' });
  }

  try {
    const tasks = TaskService.getTasksByListId(listId, limit, offset);
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    if (err.message === 'LIST_NOT_FOUND') {
      res.status(404).json({ error: 'List not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

function createTask(req, res) {
  const listId = parseInt(req.params.listId);
  const { title } = req.body;

  if (isNaN(listId)) {
    return res.status(400).json({ error: 'Invalid listId' });
  }

  const titleError = validateTitle(title, true);
  if (titleError) return res.status(400).json({ error: titleError });

  try {
    const task = TaskService.createTask(listId, title.trim());
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    if (err.message === 'LIST_NOT_FOUND') {
      res.status(404).json({ error: 'List not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

function updateTask(req, res) {
  const taskId = parseInt(req.params.taskId);
  const { title, beforeTaskId, afterTaskId } = req.body;

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid taskId' });
  }

  if (title !== undefined) {
    const titleError = validateTitle(title);
    if (titleError) return res.status(400).json({ error: titleError });
  }

  const idError = validateTaskIds(beforeTaskId, afterTaskId);
  if (idError) return res.status(400).json({ error: idError });

  try {
    const updatedTask = TaskService.updateTask(taskId, {
      title: title?.trim(),
      beforeTaskId,
      afterTaskId,
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
    if (err.message === 'TASK_NOT_FOUND') {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

function deleteTask(req, res) {
  const taskId = parseInt(req.params.taskId);

  try {
    TaskService.deleteTask(taskId);
    res.status(204).send();
  } catch (err) {
    console.log(err);
    if (err.message === 'TASK_NOT_FOUND') {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = {
  getTasksByListId,
  createTask,
  updateTask,
  deleteTask,
}
