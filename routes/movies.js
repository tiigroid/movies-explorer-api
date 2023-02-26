const routerMovies = require('express').Router();
const { validateMovieId, validateMovieData } = require('../utils/validation');
const { getUserMovies, createMovie, deleteMovieById } = require('../controllers/movies');

routerMovies.get('/', getUserMovies);
routerMovies.post('/', validateMovieData(), createMovie);
routerMovies.delete('/:_id', validateMovieId(), deleteMovieById);

module.exports = routerMovies;
