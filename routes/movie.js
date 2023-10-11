const router = require('express').Router();
const {
  getMovies,
  createMovie,
  removeMovie,
} = require('../controllers/movie');

const {
  validateDeleteMovie,
  validateMovie,
} = require('../middlewares/validateMovie');

router.get('/', getMovies);
router.post('/', validateMovie, createMovie);
router.delete('/:movieId', validateDeleteMovie, removeMovie);

module.exports = router;
