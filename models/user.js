const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../utils/errors/unauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },

    email: {
      type: String,
      require: [true, 'Поле "email" должно быть заполнено'],
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неправильный формат почты',
      },
      unique: true,
    },

    password: {
      type: String,
      require: [true, 'Поле "password" должно быть заполнено'],
      select: false,
    },
  },
  {
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email }).select('+password')
          .then((user) => {
            if (!user) {
              return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
            }

            return bcrypt.compare(password, user.password)
              .then((matched) => {
                if (!matched) {
                  return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
                }

                return user;
              });
          });
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
