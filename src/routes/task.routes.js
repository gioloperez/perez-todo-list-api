const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');

router.get('/lists/:listId/tasks', TaskController.getTasksByListId);
router.post('/lists/:listId/tasks', TaskController.createTask);
router.patch('/tasks/:taskId', TaskController.updateTask);
router.delete('/tasks/:taskId', TaskController.deleteTask);

module.exports = router;
