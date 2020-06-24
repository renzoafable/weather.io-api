const geocode = (http, config) => async (address) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${config.mapboxToken}&limit=1`;

  const response = await http.get(url);
  const { features } = response.data;

  if (features.length === 0) {
    const err = new Error('Unable to find location. Try another search.');
    err.status = 400;
    throw err;
  }

  const [lon, lat] = features[0].center;
  const location = features[0].place_name;

  return {
    latitude: lat,
    longitude: lon,
    location,
  };
};

module.exports = geocode;
