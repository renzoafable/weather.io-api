const weather = (geocode, forecast, currentWeather) => async (
  req,
  res,
  next
) => {
  const { address } = req.query;

  if (!address) {
    const err = new Error('You must provide a search address.');
    err.status = 400;
    return next(err);
  }

  try {
    const { longitude, latitude, location } = await geocode(address);
    const currentWeatherData = await currentWeather(longitude, latitude);
    const forecastData = await forecast(longitude, latitude);

    res.send({
      location,
      forecastData: forecastData.data,
      currentWeatherData: currentWeatherData.data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = weather;
