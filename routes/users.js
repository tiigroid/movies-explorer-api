const routerUsers = require('express').Router();
const { validateUserInfo } = require('../utils/validation');
const { getUserInfo, editUserInfo } = require('../controllers/users');

routerUsers.get('/me', getUserInfo);
routerUsers.patch('/me', validateUserInfo(), editUserInfo);

module.exports = routerUsers;
