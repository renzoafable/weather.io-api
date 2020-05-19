const rp = require('request-promise');
const config = require('../config');

const extractForecastData = ({ list }) => {
  return list.filter((item, index) => index % 8 === 0);
};

const forecast = (lon, lat) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${config.openWeatherMapKey}`;
    rp({ url, json: true })
      .then((response) => {
        if (response.message) reject({ error: 'Unable to find location!' });
        else {
          resolve({
            data: extractForecastData(response),
          });
        }
      })
      .catch(() => {
        reject({ error: 'Unable to connect to openweathermap!' });
      });
  });
};

module.exports = forecast;
