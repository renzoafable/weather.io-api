const geocode = require('../utils/geocode');
const forecast = require('../utils/forecast');
const currentWeather = require('../utils/currentWeather');

module.exports = {
  getWeatherData(req, res) {
    const { address } = req.query;

    if (!address) {
      return res.send({
        error: 'You must provide a search address!',
      });
    }

    geocode(
      address,
      (error, { longitude, latitude, location: geoLocation } = {}) => {
        if (error) {
          return res.send({ error });
        }

        currentWeather(longitude, latitude, (error, currentWeatherData) => {
          if (error) {
            return res.send({ error });
          }

          const { data: weatherData } = currentWeatherData;
          const { coord } = weatherData;

          forecast(coord.lon, coord.lat, (error, forecastData) => {
            if (error) {
              return res.send({ error });
            }

            res.send({
              forecast: forecastData.message,
              location: geoLocation,
              forecastData: forecastData.data,
              currentWeatherData: weatherData,
            });
          });
        });
      }
    );
  },
};
