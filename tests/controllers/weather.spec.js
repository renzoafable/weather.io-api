const weather = require('../../src/controllers/weatherController');

describe('weather', () => {
  let geocode, forecast, currentWeather;

  it('should respond with an object containing location, forecast data, and current weather data', async () => {
    const mockGeocodeRes = {
      longitude: 'some longitude',
      latitude: 'some latitude',
      location: 'some location',
    };
    const mockCurrenWeatherRes = { data: 'the current weather data' };
    const mockForecastRes = { data: 'the forecast data' };
    geocode = jest.fn(() => Promise.resolve(mockGeocodeRes));
    currentWeather = jest.fn(() => Promise.resolve(mockCurrenWeatherRes));
    forecast = jest.fn(() => Promise.resolve(mockForecastRes));
    const mockWeather = weather(geocode, forecast, currentWeather);
    const mockReq = {
      query: { address: 'some input address' },
    };
    const mockRes = {
      send: jest.fn(),
    };
    const mockNext = jest.fn();

    await mockWeather(mockReq, mockRes, mockNext);

    expect(geocode).toHaveBeenCalledWith(mockReq.query.address);
    expect(currentWeather).toHaveBeenCalledWith(
      mockGeocodeRes.longitude,
      mockGeocodeRes.latitude
    );
    expect(forecast).toHaveBeenCalledWith(
      mockGeocodeRes.longitude,
      mockGeocodeRes.latitude
    );
    expect(mockRes.send).toHaveBeenCalledWith({
      location: mockGeocodeRes.location,
      forecastData: mockForecastRes.data,
      currentWeatherData: mockCurrenWeatherRes.data,
    });
  });

  it('should throw an error if query object does not contain address', async () => {
    geocode = jest.fn();
    currentWeather = jest.fn();
    forecast = jest.fn();
    const mockWeather = weather(geocode, forecast, currentWeather);
    const mockReq = {
      query: {},
    };
    const mockRes = {};
    const error = new Error('You must provide a search address.');
    error.status = 400;
    const mockNext = jest.fn();

    await mockWeather(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should call next() when geocode() throws', async () => {
    geocode = jest.fn(() => Promise.reject('geocode failed'));
    currentWeather = jest.fn();
    forecast = jest.fn();
    const mockWeather = weather(geocode, forecast, currentWeather);
    const mockReq = {
      query: { address: 'some address' },
    };
    const mockRes = {};
    const mockNext = jest.fn();

    await mockWeather(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith('geocode failed');
  });

  it('should call next() when currentWeather() throws', async () => {
    geocode = jest.fn(() =>
      Promise.resolve({
        longitude: 'some longitude',
        latitude: 'some latitude',
        location: 'some location',
      })
    );
    currentWeather = jest.fn(() => Promise.reject('currentWeather failed'));
    forecast = jest.fn();
    const mockWeather = weather(geocode, forecast, currentWeather);
    const mockReq = {
      query: { address: 'some address' },
    };
    const mockRes = {};
    const mockNext = jest.fn();

    await mockWeather(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith('currentWeather failed');
  });

  it('should call next() when forecast() throws', async () => {
    geocode = jest.fn(() =>
      Promise.resolve({
        longitude: 'some longitude',
        latitude: 'some latitude',
        location: 'some location',
      })
    );
    currentWeather = jest.fn();
    forecast = jest.fn(() => Promise.reject('forecast failed'));
    const mockWeather = weather(geocode, forecast, currentWeather);
    const mockReq = {
      query: { address: 'some address' },
    };
    const mockRes = {};
    const mockNext = jest.fn();

    await mockWeather(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith('forecast failed');
  });
});
