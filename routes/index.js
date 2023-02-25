const router = require('express').Router();
const routerUsers = require('./users');
const routerMovies = require('./movies');
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const { validateSignIn, validateSignUp } = require('../utils/validation');
const NotFoundError = require('../utils/errors/NotFoundError');

router.post('/signup', validateSignUp(), createUser);
router.post('/signin', validateSignIn(), login);
router.get('/signout', logout);
router.use(auth);
router.use('/users', routerUsers);
router.use('/movies', routerMovies);
router.use('/', (req, res, next) => next(new NotFoundError('Путь не найден')));

module.exports = router;
