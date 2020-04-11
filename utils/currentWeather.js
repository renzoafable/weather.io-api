const request = require('request');
const config = require('../config');

const currentWeather = (lon, lat, callback) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=af53d9ed4492e68a147204d1634d1421`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to openweathermap!', undefined);
    } else if (body.message) {
      callback('Unable to find location!', undefined);
    } else {
      callback(undefined, {
        data: body,
      });
    }
  });
};

module.exports = currentWeather;
