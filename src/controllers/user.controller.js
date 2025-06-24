
const userService = require('../services/user.service');

exports.getAllUsers = (req, res) => {
  const users = userService.getUsers();
  res.status(200).json(users);
};
