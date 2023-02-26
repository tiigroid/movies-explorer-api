const router = require('express').Router();
const routerUsers = require('./users');
const routerMovies = require('./movies');
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const { validateSignIn, validateSignUp } = require('../utils/validation');
const NotFoundError = require('../utils/errors/NotFoundError');
const { errorMessages } = require('../utils/constants');

router.post('/signup', validateSignUp(), createUser);
router.post('/signin', validateSignIn(), login);
router.use(auth);
router.get('/signout', logout);
router.use('/users', routerUsers);
router.use('/movies', routerMovies);
router.use('/', (req, res, next) => next(new NotFoundError(errorMessages.notFoundPath)));

module.exports = router;
