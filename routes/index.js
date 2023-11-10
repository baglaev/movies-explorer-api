const router = require('express').Router();

const NotFoundError = require('../utils/errors/notFoundError');
const { login, logout, createUser } = require('../controllers/users');
const { loginValidation, createUserValidation } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.use('/signout', auth, logout);

router.use('*', auth, (_req, _res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
