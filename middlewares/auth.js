const jwt = require('jsonwebtoken');
const AuthorizationError = require('../utils/errors/AuthorizationError');
const { devJwtkey } = require('../utils/dev-config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devJwtkey);
  } catch (err) {
    next(new AuthorizationError('Ошибка авторизации'));
    return;
  }

  req.user = payload;
  next();
};
