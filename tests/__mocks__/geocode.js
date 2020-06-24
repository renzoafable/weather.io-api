const geocode = () => async () => {
  const err = new Error('Geocode failed');
  err.status = 400;
  throw err;
};

module.exports = geocode;
