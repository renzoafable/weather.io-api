const rp = require('request-promise');
const config = require('../config');

const forecast = (lon, lat) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${config.openWeatherMapKey}`;
    rp({ url, json: true })
      .then((response) => {
        if (response.message) reject('Unable to find location!');
        else {
          resolve({
            message: `The weather for today is ${
              response.list[0].weather[0].description
            }. It is currently ${(response.list[0].main.temp - 273.15).toFixed(
              2
            )} degrees out.`,
            data: response,
          });
        }
      })
      .catch(() => {
        reject('Unable to connect to openweathermap!');
      });
  });
};

module.exports = forecast;
