jest.mock('../../src/utils/conversion.js', () => ({
  mpsToKph: jest.fn((speed) => speed),
}));

const {
  extractWeatherData,
  extractForecastData,
} = require('../../src/utils/helper');

describe('helper', () => {
  describe('extractWeatherData', () => {
    let mockValues;

    beforeEach(() => {
      mockValues = {
        mockIcon: 'someIcon',
        mockTemp: 30,
        mockFeelsLike: 32,
        mockHumidity: 4,
        mockSunsetTimestamp: 1592968875,
        mockCloudiness: 34,
        mockRainLevel: 12,
        mockWindSpeed: 50,
      };
    });

    it('should extract complete weather data from input', () => {
      const mockResponse = {
        weather: [{ icon: mockValues.mockIcon }],
        main: {
          temp: mockValues.mockTemp,
          feels_like: mockValues.mockFeelsLike,
          humidity: mockValues.mockHumidity,
        },
        sys: {
          sunset: mockValues.mockSunsetTimestamp,
        },
        clouds: {
          all: mockValues.mockCloudiness,
        },
        rain: {
          level: mockValues.mockRainLevel,
        },
        wind: {
          speed: mockValues.mockWindSpeed,
        },
      };

      const extracted = extractWeatherData(mockResponse);

      expect(extracted).toBeDefined();
      expect(extracted.currentWeatherIcon).toEqual(
        expect.stringContaining(mockValues.mockIcon)
      );
      expect(extracted.currentTemp).toBe(mockValues.mockTemp);
      expect(extracted.currentFeelsLike).toBe(mockValues.mockFeelsLike);
      expect(extracted.currentSunset).toBe(mockValues.mockSunsetTimestamp);
      expect(extracted.currentClouds).toBe(mockValues.mockCloudiness);
      expect(extracted.currentRain).toBe(mockValues.mockRainLevel.toFixed(2));
      expect(extracted.currentHumidity).toBe(mockValues.mockHumidity);
      expect(extracted.currentWindSpeed).toBe(mockValues.mockWindSpeed);
    });

    it('should extract weather data from input when rain is not present', () => {
      const mockResponse = {
        weather: [{ icon: mockValues.mockIcon }],
        main: {
          temp: mockValues.mockTemp,
          feels_like: mockValues.mockFeelsLike,
          humidity: mockValues.mockHumidity,
        },
        sys: {
          sunset: mockValues.mockSunsetTimestamp,
        },
        clouds: {
          all: mockValues.mockCloudiness,
        },
        wind: {
          speed: mockValues.mockWindSpeed,
        },
      };

      const extracted = extractWeatherData(mockResponse);

      expect(extracted).toBeDefined();
      expect(extracted.currentWeatherIcon).toEqual(
        expect.stringContaining(mockValues.mockIcon)
      );
      expect(extracted.currentTemp).toBe(mockValues.mockTemp);
      expect(extracted.currentFeelsLike).toBe(mockValues.mockFeelsLike);
      expect(extracted.currentSunset).toBe(mockValues.mockSunsetTimestamp);
      expect(extracted.currentClouds).toBe(mockValues.mockCloudiness);
      expect(extracted.currentRain).toBe(0);
      expect(extracted.currentHumidity).toBe(mockValues.mockHumidity);
      expect(extracted.currentWindSpeed).toBe(mockValues.mockWindSpeed);
    });
  });

  describe('extractForecastData', () => {
    it('should return items with index divisible by 8', () => {
      const list = [...Array(40).keys()];

      const extracted = extractForecastData({ list });

      expect(extracted.length).toBe(5);
      extracted.forEach((item) => expect(parseInt(extracted) % 8).toBe(0));
    });
  });
});
