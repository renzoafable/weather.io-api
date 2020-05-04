const geocode = require('../utils/geocode');
const forecast = require('../utils/forecast');
const currentWeather = require('../utils/currentWeather');

module.exports = {
  async getWeatherData(req, res) {
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
      const { coord } = weatherData;
      const forecastData = await forecast(coord.lon, coord.lat);

      debugger;

      res.send({
        forecast: forecastData.message,
        location: geoLocation,
        forecastData: forecastData.data,
        currentWeatherData: weatherData,
      });
    } catch (error) {
      res.send({ error });
    }
  },
};
