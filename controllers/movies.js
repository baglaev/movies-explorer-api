const Movie = require('../models/movie');

const {
  OK,
  CREATED,
} = require('../utils/constants');

const NotFoundError = require('../utils/errors/notFoundError');
const BadRequestError = require('../utils/errors/badRequestError');
const ForbiddenError = require('../utils/errors/forbiddenError');

function getMovies(req, res, next) {
  const owner = req.user._id;
  return Movie.find({ owner })
    .then((movies) => res.status(OK).send(movies))
    .catch(next);
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => { res.status(CREATED).send(movie); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(err);
    });
}

function deleteMovie(req, res, next) {
  return Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw next(new NotFoundError('Фильм не найден'));
      }
      if (movie.owner._id.toString() !== req.user._id) {
        throw (new ForbiddenError('Доступ запрещён'));
      }
      return Movie.deleteOne(movie);
    })
    .then((movie) => res.status(OK).send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Ошибка в ведённых данных'));
      }
      return next(err);
    });
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
