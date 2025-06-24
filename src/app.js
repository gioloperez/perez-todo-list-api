const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
  });

app.use('/api/users', userRoutes);

module.exports = app;
