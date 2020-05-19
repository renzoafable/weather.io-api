var express = require('express');
var router = express.Router();

const geocode = require('../utils/geocode');
const forecast = require('../utils/forecast');
const currentWeather = require('../utils/currentWeather');

router.get('/', (req, res) => {
  return res.render('index', {
    title: 'Weather',
    name: 'Lorenz Matthew Afable',
  });
});
router.get('/weather', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.send({
      error: 'You must provide a search address!',
    });
  }

  try {
    const { longitude, latitude, location: geoLocation } = await geocode(
      address
    );
    const currentWeatherData = await currentWeather(longitude, latitude);
    const { data: weatherData } = currentWeatherData;
    const forecastData = await forecast(longitude, latitude);

    res.send({
      location: geoLocation,
      forecastData: forecastData.data,
      currentWeatherData: weatherData,
    });
  } catch (error) {
    res.send({ error });
  }
});

module.exports = router;
