const taskService = require('../services/task.service');

exports.getTasksByList = (req, res) => {
  const tasks = taskService.getTasksByList();
  res.status(200).json(tasks);
};
