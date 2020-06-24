const express = require('express');
const axios = require('axios');
const config = require('../../config');
const router = express.Router();

const geocode = require('../libs/geocode')(axios, config);
const forecast = require('../libs/forecast')(axios, config);
const currentWeather = require('../libs/currentWeather')(axios, config);

const weatherController = require('../controllers/weatherController')(
  geocode,
  forecast,
  currentWeather
);

router.get('/', weatherController);

module.exports = router;
