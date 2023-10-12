const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'поле "страна создания фильма" - должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'поле "режессёр фильма" - должно быть заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'поле "длительность фильма" - должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'поле "год создания фильма" - должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'поле "постер к фильму"- должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректно переданный URL',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'поле "трейлер фильма" - должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректно переданный URL',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'поле "миниатюрное изображение постера фильма" - должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Некорректно переданный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'не передан id пользователя'],
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: [true, 'не передан id фильма'],
    ref: 'movie',
  },
  nameRU: {
    type: String,
    required: [true, 'поле "название фильма на русском языке" - должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'поле "название фильма на английском языке" - должно быть заполнено'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
