const request = require('supertest');
const app = require('../src/app');
const geocode = require('../src/libs/geocode');

describe('app', () => {
  describe('weatherRoute', () => {
    describe('GET /weather', () => {
      let agent;

      beforeAll(() => {
        agent = request.agent(app);
      });

      afterAll(() => {
        agent = null;
      });

      it('should respond with status code 200', async () => {
        const someLocation = 'Mandaluyong City';

        const response = await agent.get(`/weather?address=${someLocation}`);

        expect(response.status).toBe(200);
      });

      it('should fetch weather data', async () => {
        const someLocation = 'Manila';

        const response = await agent.get(`/weather?address=${someLocation}`);

        expect(response.body).toHaveProperty('location');
        expect(response.body.location).not.toBeNull();
        expect(response.body).toHaveProperty('forecastData');
        expect(response.body.forecastData).not.toBeNull();
        expect(response.body).toHaveProperty('currentWeatherData');
        expect(response.body.currentWeatherData).not.toBeNull();
      });

      it('should respond with status code 400 if query does not include address', async () => {
        const response = await agent.get('/weather');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('You must provide a search address.');
      });

      it('should respond with status code 400 if an external api call failed', async () => {
        const someLocation =
          'Some non-existent place that caused geocode() to fail';

        const response = await agent.get(`/weather?address=${someLocation}`);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
          'Unable to find location. Try another search.'
        );
      });

      it('should respond with 404 if invalid route is accessed', async () => {
        const response = await agent.get(`/invalidRoute`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Not Found');
      });
    });
  });
});
