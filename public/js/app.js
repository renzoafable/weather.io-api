console.log('Client side js file is loaded!');

const messageOne = document.querySelector('#message-one');
const messageTwo = document.querySelector('#message-two');
const forecastBody = document.querySelector('tbody');
const tablePlaceholder = document.getElementById('empty-table');
const locationInput = document.getElementById('locationInput');
const autoComplete = new google.maps.places.Autocomplete(locationInput, {
  types: ['(cities)'],
});

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

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

const displayForecastData = ({ forecastData }) => {
  removeChildrenElements(tablePlaceholder);
  addClassToElement(tablePlaceholder, 'd-none');
  const { cod, message, cnt, list, city } = forecastData;
  const step = Math.floor(cnt / 5);
  const tempThreshold = 27;

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
          forecast.main.temp_max - 273.15 > tempThreshold ? 'text-danger' : ''
        }">${(forecast.main.temp_max - 273.15).toFixed(2)} &#8451;</td>
        <td class="align-middle"><img class="weather-icon" src="http://openweathermap.org/img/wn/50d@2x.png">${
          forecast.wind.speed
        } m/s</td>
    `;
    forecastBody.appendChild(forecastItem);
  }
  removeClassFromElement(document.querySelector('thead'), 'd-none');
  removeClassFromElement(document.querySelector('tbody'), 'd-none');
};

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
  const url = `http://localhost:3000/weather?address=${suggestion.name}`;

  removeChildrenElements(forecastBody);
  removeClassFromElement(tablePlaceholder, 'd-none');
  addClassToElement(document.querySelector('thead'), 'd-none');
  addClassToElement(document.querySelector('tbody'), 'd-none');

  // Create a loader inside the table
  removeChildrenElements(tablePlaceholder);
  tablePlaceholder.innerHTML = `
    <div class='spinner-border text-warning mx-auto' role='status'>
      <span class='sr-only'>Loading...</span>
    </div>
  `;

  fetch(url).then((response) => {
    response.json().then((data) => {
      const { error, location, forecast } = data;
      console.log(data);
      if (error) {
      } else {
        displayForecastData(data);
      }
    });
  });
});
