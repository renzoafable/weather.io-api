const rp = require('request-promise');
const config = require('../config');

const geocode = (address) => {
  return new Promise((resolve, reject) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${config.mapboxToken}&limit=1`;

    rp({ url, json: true })
      .then((response) => {
        const { features } = response;

        if (features.length === 0)
          reject('Unable to find location. Try another search.');

        const [lon, lat] = features[0].center;
        const location = features[0].place_name;

        resolve({
          latitude: lat,
          longitude: lon,
          location,
        });
      })
      .catch(() => {
        reject('Unable to connect to location services!');
      });
  });
};

module.exports = geocode;
