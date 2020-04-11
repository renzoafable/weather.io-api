const request = require('request');
const config = require('../config');

const forecast = (lon, lat, callback) => {
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${config.openWeatherMapKey}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to openweathermap!', undefined);
    } else if (body.message) {
      callback('Unable to find location!', undefined);
    } else {
      callback(undefined, {
        message: `The weather for today is ${
          body.list[0].weather[0].description
        }. It is currently ${(body.list[0].main.temp - 273.15).toFixed(
          2
        )} degrees out.`,
        data: body,
      });
    }
  });
};

module.exports = forecast;
