const mongoose = require('mongoose');
const validator = require('validator');
const { errorMessages } = require('../utils/constants');

const movieSchema = new mongoose.Schema(
  {
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return validator.isURL(v);
        },
        message: errorMessages.invalidURL,
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return validator.isURL(v);
        },
        message: errorMessages.invalidURL,
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return validator.isURL(v);
        },
        message: errorMessages.invalidURL,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
