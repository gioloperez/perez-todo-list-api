const taskService = require('../services/task.service');

exports.getTasksByListId = (req, res) => {
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
