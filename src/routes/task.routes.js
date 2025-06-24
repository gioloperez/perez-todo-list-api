const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.get('/lists/:listId/tasks', taskController.getTasksByList);

module.exports = router;
