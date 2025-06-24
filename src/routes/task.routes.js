const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.get('/lists/:listId/tasks', taskController.getTasksByListId);

module.exports = router;
