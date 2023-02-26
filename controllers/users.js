const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthorizationError = require('../utils/errors/AuthorizationError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictingRequestError = require('../utils/errors/ConflictingRequestError');
const { errorMessages } = require('../utils/constants');
const { devJwtkey } = require('../utils/dev-config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.send({ name: user.name, email }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictingRequestError(errorMessages.conflictEmail));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.badRequest));
        return;
      }
      next(err);
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.editUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictingRequestError(errorMessages.conflictEmail));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.badRequest));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  function handleAuthorizationError() {
    throw new AuthorizationError(errorMessages.authWrongEmailOrPassword);
  }

  function createToken(user) {
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devJwtkey, { expiresIn: '7d' });
    res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7 }).send({ email, password });
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        handleAuthorizationError();
      } else {
        bcrypt.compare(password, user.password)
          .then((matched) => (matched ? createToken(user) : handleAuthorizationError()))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
};
