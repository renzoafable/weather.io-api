jest.mock('../../src/utils/helper.js', () => ({
  extractForecastData: jest.fn((response) => response),
}));

const forecast = require('../../src/libs/forecast');

describe('forecast', () => {
  let mockHttp, mockConfig;

  beforeAll(() => {
    mockConfig = {
      openWeatherMapKey: 'someapikey1234',
    };
  });

  it('should return forecast for a given longitude and latitude', async () => {
    const mockResponse = {
      data: {
        response: 'Success',
      },
    };
    mockHttp = {
      get: jest.fn(() => mockResponse),
    };
    const mockForecast = forecast(mockHttp, mockConfig);

    const result = await mockForecast(1, 3);

    expect(mockHttp.get).toHaveBeenCalled();
    expect(result).toHaveProperty('data');
    expect(result.data).toEqual(mockResponse.data);
  });

  it('should throw an error if external returns a message', async () => {
    const mockResponse = {
      data: {
        message: 'some error',
      },
    };
    const mockHttp = {
      get: jest.fn(() => mockResponse),
    };
    const mockForecast = forecast(mockHttp, mockConfig);

    await expect(() => mockForecast(0, 0)).rejects.toThrow(
      'Unable to find location!'
    );
  });
});
