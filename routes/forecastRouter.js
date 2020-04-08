const express = require('express');
const router = express.Router();

const { getForecastData } = require('../controllers/forecastController');

router.get('/', getForecastData);

module.exports = router;
