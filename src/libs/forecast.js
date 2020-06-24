const { extractForecastData } = require('../utils/helper');

const forecast = (http, config) => async (lon, lat) => {
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${config.openWeatherMapKey}`;

  const response = await http.get(url);
  const { data } = response;

  if (data.message) throw new Error('Unable to find location!');
  else {
    return {
      data: extractForecastData(data),
    };
  }
};

module.exports = forecast;
