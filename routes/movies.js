const routerMovies = require('express').Router();
const { validateMovieId, validateMovieData } = require('../utils/validation');
const { getAllMovies, createMovie, deleteMovieById } = require('../controllers/movies');

routerMovies.get('/', getAllMovies);
routerMovies.post('/', validateMovieData(), createMovie);
routerMovies.delete('/:_id', validateMovieId(), deleteMovieById);

module.exports = routerMovies;
