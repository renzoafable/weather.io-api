const request = require('request');

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=pk.eyJ1IjoicmVuem9hZmFibGUiLCJhIjoiY2s4bG5xaHVvMGFodjNtbWlkcnZ1ZWEydiJ9.cNdAzWA63lVGxhUitWpH0g&limit=1`;

  request({ url, json: true }, (error, { body }) => {
    const { features } = body;

    if (error) {
      callback('Unable to connect to location services!', undefined);
    } else if (features.length === 0) {
      callback('Unable to find location. Try another search.', undefined);
    } else {
      const [lon, lat] = features[0].center;
      const location = features[0].place_name;
      callback(undefined, {
        latitude: lat,
        longitude: lon,
        location,
      });
    }
  });
};

module.exports = geocode;
