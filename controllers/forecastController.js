const forecast = require('../utils/forecast');

module.exports = {
  getForecastData(req, res) {
    const { lon, lat, address } = req.query;
    if (!lon || !lat || !address) {
      return res.send({ error: 'Something went wrong!' });
    }

    forecast(lon, lat, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        forecast: forecastData.message,
        location: address,
        data: forecastData.data,
      });
    });
  },
};
