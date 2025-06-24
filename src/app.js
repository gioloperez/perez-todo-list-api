const express = require('express');
const app = express();
const taskRoutes = require('./routes/task.routes');

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
  });

app.use(taskRoutes);

module.exports = app;
