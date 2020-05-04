const request = require('request');
const rp = require('request-promise');
const config = require('../config');

const currentWeather = (lon, lat) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${config.openWeatherMapKey}`;

    rp({ url, json: true })
      .then((response) => {
        if (response.message) reject('Unable to find location!');
        resolve({
          data: response,
        });
      })
      .catch(() => {
        reject('Unable to connect to openweathermap!');
      });
  });
};

module.exports = currentWeather;
