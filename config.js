const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  port: process.env.PORT,
  openWeatherMapKey: process.env.OPEN_WEATHER_MAP_KEY,
  mapboxToken: process.env.MAPBOX_TOKEN,
};
