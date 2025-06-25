const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.get('/lists/:listId/tasks', taskController.getTasksByListId);
router.post('/lists/:listId/tasks', taskController.createTask);
router.patch('/tasks/:taskId', taskController.updateTask);
router.delete('/tasks/:taskId', taskController.deleteTask);

module.exports = router;
