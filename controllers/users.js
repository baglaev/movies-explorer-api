const bcrypt = require('bcryptjs');
const User = require('../models/user');

const {
  OK,
  CREATED,
  DUPLICATE_KEY,
} = require('../utils/constants');

const UnauthorizedError = require('../utils/errors/unauthorizedError');
const NotFoundError = require('../utils/errors/notFoundError');
const BadRequestError = require('../utils/errors/badRequestError');
const ConflictError = require('../utils/errors/conflictError');

const { generateToken } = require('../utils/token');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const payload = { _id: user._id, email: user.email };
    const token = generateToken(payload);
    res.cookie('jwt', token, {
      maxAge: 6548000,
      httpOnly: true,
      sameSite: true,
    });
    return res.status(OK).send(payload);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};

function logout(_req, res, next) {
  try {
    res.clearCookie('jwt').send({ message: 'Выполнен выход из аккаунта' });
  } catch (err) {
    next(err);
  }
}

function getUser(req, res, next) {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(err);
    });
}

function createUser(req, res, next) {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(CREATED).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка в ведённых данных'));
      } else if (err.code === DUPLICATE_KEY) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.code === DUPLICATE_KEY) {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      return next(err);
    });
}

module.exports = {
  login,
  logout,
  getUser,
  createUser,
  updateUser,
};
