const geocode = require('../utils/geocode');
const forecast = require('../utils/forecast');

module.exports = {
  getWeatherData(req, res) {
    const { address } = req.query;

    if (!address) {
      return res.send({
        error: 'You must provide a search address!',
      });
    }

    geocode(address, (error, { lon, lat, location: geoLocation } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(lon, lat, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData.message,
          location: geoLocation,
          data: forecastData.data,
        });
      });
    });
  },
};
