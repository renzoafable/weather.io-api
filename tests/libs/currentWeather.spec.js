jest.mock('../../src/utils/helper.js', () => ({
  extractWeatherData: jest.fn((response) => response),
}));

const currentWeather = require('../../src/libs/currentWeather');

describe('currentWeather', () => {
  let mockHttp, mockConfig;
  beforeAll(() => {
    mockConfig = {
      openWeatherMapKey: 'someapikey1234',
    };
  });

  it('should return current weather data', async () => {
    const mockResponse = {
      data: {
        success: 'success!',
      },
    };
    mockHttp = {
      get: jest.fn(() => mockResponse),
    };
    const mockCurrentWeather = currentWeather(mockHttp, mockConfig);

    const weatherData = await mockCurrentWeather(1, 2);

    expect(weatherData).toHaveProperty('data');
    expect(mockHttp.get).toHaveBeenCalled();
    expect(weatherData.data).toEqual(mockResponse.data);
  });

  it('should throw an error if external api responds with a message', async () => {
    const mockResponse = {
      data: { message: 'something went wrong' },
    };
    mockHttp = {
      get: jest.fn(() => mockResponse),
    };
    const mockCurrentWeather = currentWeather(mockHttp, mockConfig);

    await expect(() => mockCurrentWeather(0, 0)).rejects.toThrow(
      'Unable to find location!'
    );
  });
});
