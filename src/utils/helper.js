const { mpsToKph } = require('./conversion');

exports.extractForecastData = ({ list }) => {
  return list.filter((item, index) => index % 8 === 0);
};

exports.extractWeatherData = (response) => {
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
