const Movie = require('../models/movie');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const BadRequestError = require('../utils/errors/BadRequestError');
const { errorMessages } = require('../utils/constants');

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
    .catch((err) => (err.name === 'ValidationError' ? next(new BadRequestError(errorMessages.badRequest)) : next(err)));
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(errorMessages.notFoundFilm);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(errorMessages.forbidden);
      }

      Movie.findByIdAndRemove(req.params._id)
        .then((validMovie) => (validMovie && res.send(validMovie)))
        .catch(next);
    })
    .catch(next);
};
