const domElements = {
  forecastBody: document.querySelector('tbody'),
  tablePlaceholder: document.getElementById('empty-table'),
  tableHead: document.querySelector('thead'),
  currentWeatherIcon: document.querySelector('.current-weather-icon'),
  currentDate: document.querySelector('.current-date'),
  currentTemp: document.querySelector('.current-temp'),
  currentLocation: document.querySelector('.current-location'),
  currentFeelsLike: document.querySelector('.current-feels-like'),
  currentSunset: document.querySelector('.current-sunset'),
  currentClouds: document.querySelector('.current-clouds'),
  currentRain: document.querySelector('.current-rain'),
  currentHumidity: document.querySelector('.current-humidity'),
  currentWind: document.querySelector('.current-wind'),
};

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const locationInput = document.getElementById('locationInput');
const autoComplete = new google.maps.places.Autocomplete(locationInput, {
  types: ['(cities)'],
});

const removeChildrenElements = (domElement) => {
  while (domElement.firstChild) {
    domElement.removeChild(domElement.firstChild);
  }
};

const addClassToElement = (element, cssClass) => {
  let classArr = element.className.split(' ');
  if (!classArr.includes(cssClass)) {
    element.className += ` ${cssClass}`;
  }
};

const removeClassFromElement = (element, cssClass) => {
  element.className = element.className.replace(cssClass, '');
};

const kelvinToCelsius = (kelvin) => {
  return kelvin - 273.15;
};

const unixDateToTime = (unixDate) => {
  return new Date(unixDate * 1000);
};

const metricToImperialSpeed = (speed) => {
  return speed * 3.6;
};

const displayForecastData = (forecastData) => {
  const { cod, message, cnt, list, city } = forecastData;
  const step = Math.floor(cnt / 5);
  const tempThreshold = 27;

  removeChildrenElements(domElements.tablePlaceholder);
  addClassToElement(domElements.tablePlaceholder, 'd-none');

  // Build forecast table
  for (let i = step - 1; i < cnt; i += step) {
    const forecast = { ...list[i] };
    forecast['date'] = new Date(forecast.dt * 1000);

    const forecastItem = document.createElement('tr');
    forecastItem.innerHTML = `
        <th class="align-middle" scope="row">${
          DAYS[forecast['date'].getDay()]
        }</th>
        <td class="align-middle"><img class="weather-icon" src="http://openweathermap.org/img/wn/09${
          forecast.sys.pod
        }@2x.png">${forecast.rain ? forecast.rain['3h'] : 0} mm<sup>3</sup></td>
        <td class="align-middle"><img class="weather-icon" src="http://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png"></td>
        <td class="align-middle ${
          kelvinToCelsius(forecast.main.temp_max) > tempThreshold
            ? 'text-danger'
            : ''
        }">${kelvinToCelsius(forecast.main.temp_max).toFixed(2)} &#8451;</td>
        <td class="align-middle"><img class="weather-icon" src="http://openweathermap.org/img/wn/50d@2x.png">${(
          forecast.wind.speed * 3.6
        ).toFixed(2)} Km/h</td>
    `;
    domElements.forecastBody.appendChild(forecastItem);
  }

  removeClassFromElement(domElements.tableHead, 'd-none');
  removeClassFromElement(domElements.forecastBody, 'd-none');
};

const displayWeatherData = (currentWeatherData) => {
  // Display weather icon
  domElements.currentWeatherIcon.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`
  );
  removeClassFromElement(domElements.currentWeatherIcon, 'd-none');

  // Display current temperature
  domElements.currentTemp.innerHTML = Math.round(currentWeatherData.main.temp);

  // Display current location
  domElements.currentLocation.innerHTML = currentWeatherData.name;

  // Display current "feels like" temperature
  domElements.currentFeelsLike.innerHTML = Math.round(
    currentWeatherData.main.feels_like
  );

  // Display sunset time
  const currentSunsetDate = unixDateToTime(currentWeatherData.sys.sunset);
  domElements.currentSunset.innerHTML = `${currentSunsetDate.getHours()}:${
    currentSunsetDate.getMinutes().toString().length < 2
      ? '0' + currentSunsetDate.getMinutes()
      : currentSunsetDate.getMinutes()
  }`;

  // Display weather details
  domElements.currentClouds.innerHTML = `${currentWeatherData.clouds.all} %`;
  domElements.currentRain.innerHTML = `${
    currentWeatherData.rain
      ? currentWeatherData.rain['3h']
        ? currentWeatherData.rain['3h']
        : 0
      : 0
  } mm`;
  domElements.currentHumidity.innerHTML = `${currentWeatherData.main.humidity} %`;
  domElements.currentWind.innerHTML = `${Math.round(
    metricToImperialSpeed(currentWeatherData.wind.speed)
  )} Km/h`;
};

const displayError = (errorMessage) => {
  removeChildrenElements(domElements.tablePlaceholder);
  domElements.tablePlaceholder.innerHTML = errorMessage;
};

// Load date
const currentDate = new Date();
domElements.currentDate.innerHTML = `${
  DAYS[currentDate.getDay()]
}, ${currentDate.getDate()} ${MONTHS[currentDate.getMonth()]}`;

/**
 * This event is fired when a PlaceResult is made available for a Place the user has selected.
 * If the user enters the name of a Place that was not suggested by the control and presses the Enter key,
 * or if a Place Details request fails, the PlaceResult contains the user input in the name property,
 * with no other properties defined.
 *
 * from developers.google.com/maps/documentation/javascript/reference/places-widget
 */
google.maps.event.addListener(autoComplete, 'place_changed', () => {
  const suggestion = autoComplete.getPlace();
  const url = `/weather?address=${suggestion.formatted_address}`;

  removeChildrenElements(domElements.forecastBody);
  removeClassFromElement(domElements.tablePlaceholder, 'd-none');
  addClassToElement(domElements.tableHead, 'd-none');
  addClassToElement(domElements.forecastBody, 'd-none');

  // Create a loader inside the table
  removeChildrenElements(domElements.tablePlaceholder);
  domElements.tablePlaceholder.innerHTML = `
    <div class='spinner-border text-warning mx-auto' role='status'>
      <span class='sr-only'>Loading...</span>
    </div>
  `;

  fetch(url).then((response) => {
    response
      .json()
      .then((data) => {
        const { error, currentWeatherData, forecastData, location } = data;
        if (error) {
          console.log(error);
          displayError(error);
        } else {
          displayForecastData(forecastData);
          displayWeatherData(currentWeatherData);
        }
      })
      .catch((error) => console.log(error));
  });
});
