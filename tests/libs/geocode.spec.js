const geocode = require('../../src/libs/geocode');

describe('geocode', () => {
  let mockHttp, config;
  beforeAll(() => {
    config = {
      mapboxToken: 'somerandommapboxtoken1234',
    };
  });

  it('should return an object with longitude, latitude, and location', async () => {
    const mockResponse = {
      data: {
        features: [
          {
            center: [41.5, 33.3],
            place_name: 'Some sample city',
          },
        ],
      },
    };

    mockHttp = {
      get: jest.fn(() => Promise.resolve(mockResponse)),
    };
    const mockGeocode = geocode(mockHttp, config);

    const response = await mockGeocode('Some city');

    expect(mockHttp.get).toHaveBeenCalledWith(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        'Some city'
      )}.json?access_token=${config.mapboxToken}&limit=1`
    );
    expect(response).toHaveProperty('longitude');
    expect(response).toHaveProperty('latitude');
    expect(response).toHaveProperty('location');
  });

  it('should return latitude, longitude, and location of a place', async () => {
    const mockResponse = {
      data: {
        features: [
          {
            center: [41.5, 33.3],
            place_name: 'Some sample city',
          },
        ],
      },
    };

    mockHttp = {
      get: jest.fn(() => Promise.resolve(mockResponse)),
    };
    const mockGeocode = geocode(mockHttp, config);

    const response = await mockGeocode('Some city');

    expect(response.latitude).toBe(33.3);
    expect(response.longitude).toBe(41.5);
    expect(response.location).toBe('Some sample city');
  });

  it('should throw error if location was not found', async () => {
    const mockResponse = {
      data: {
        features: [],
      },
    };
    mockHttp = {
      get: jest.fn(() => Promise.resolve(mockResponse)),
    };
    const mockGeocode = geocode(mockHttp, config);

    expect(
      async () => await mockGeocode('Some non-existent place')
    ).rejects.toThrow('Unable to find location. Try another search.');
  });
});
