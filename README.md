# WeatherIO API

A weather forecast application that allows a user to input any address and returns the current weather and a 5-day forecast information about that specific place.

## Prerequisites

1. [Node](https://nodejs.org/en/)
2. [Yarn](https://classic.yarnpkg.com/en/docs/install/)
3. [OpenWeatherMap API Key](https://openweathermap.org/appid)
4. [Mapbox API Key](https://www.mapbox.com/)

## Installing

1. Clone this repository.
2. Install the dependencies

```
cd weather.io-api
yarn install
```

3. Create your `.env` file. This is where you place your API keys.

```
cp .env.sample .env
nano .env.sample
```

4. Start the dev server

```
yarn dev
```

## Built With

- [Express](http://expressjs.com/) - The web framework used
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) - Dependency Management
- [OpenWeatherMap](https://openweathermap.org/api) - Forecast API
- [Mapbox](https://docs.mapbox.com/api/search/) - Geocoding API
