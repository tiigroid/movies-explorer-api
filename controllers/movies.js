const Movie = require('../models/movie');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictingRequestError = require('../utils/errors/ConflictingRequestError');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => (res.send(movies)))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    movieId,
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
  } = req.body;

  Movie.create({
    owner,
    movieId,
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictingRequestError('Этот фильм уже сохранен'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены неверные данные'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Ошибка доступа');
      }

      Movie.findByIdAndRemove(req.params._id)
        .then((validMovie) => (validMovie && res.send(validMovie)))
        .catch(next);
    })
    .catch(next);
};
