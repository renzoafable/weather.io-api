const rp = require('request-promise');
const config = require('../config');
const { mpsToKph } = require('./conversion');

const extractWeatherData = (response) => {
  const data = {
    currentWeatherIcon: `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`,
    currentTemp: response.main.temp,
    currentFeelsLike: response.main.feels_like,
    currentSunset: response.sys.sunset,
    currentClouds: response.clouds.all,
    currentRain: response.rain ? Object.values(response.rain)[0].toFixed(2) : 0,
    currentHumidity: response.main.humidity,
    currentWindSpeed: mpsToKph(response.wind.speed),
  };
  return data;
};

const currentWeather = (lon, lat) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${config.openWeatherMapKey}`;

    rp({ url, json: true })
      .then((response) => {
        if (response.message) reject({ error: 'Unable to find location!' });
        resolve({
          data: extractWeatherData(response),
        });
      })
      .catch(() => {
        reject('Unable to connect to openweathermap!');
      });
  });
};

module.exports = currentWeather;
