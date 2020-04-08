console.log('Client side js file is loaded!');

const messageOne = document.querySelector('#message-one');
const messageTwo = document.querySelector('#message-two');
const forecastBody = document.getElementById('table-body');
const locationInput = document.getElementById('locationInput');
const autoComplete = new google.maps.places.Autocomplete(locationInput, {
  types: ['(regions)'],
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

const displayForecastData = ({ forecastData }) => {
  removeChildrenElements(forecastBody);
  const { cod, message, cnt, list, city } = forecastData;
  const step = Math.floor(cnt / 5);

  for (let i = step - 1; i < cnt; i += step) {
    const forecast = { ...list[i] };
    forecast['date'] = new Date(forecast.dt * 1000);

    const forecastItem = document.createElement('tr');
    forecastItem.innerHTML = `
        <th class="align-middle" scope="row">${
          DAYS[forecast['date'].getDay()]
        }</th>
        <td class="align-middle"><img class="weather-icon" src="http://openweathermap.org/img/wn/09n@2x.png">${
          forecast.rain ? forecast.rain['3h'] : 0
        } mm<sup>3</sup></td>
        <td class="align-middle"><img class="weather-icon" src="http://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png"></td>
        <td class="align-middle">${(forecast.main.temp_min - 273.15).toFixed(
          2
        )} &#8451;</td>
        <td class="align-middle"><img class="weather-icon" src="http://openweathermap.org/img/wn/50d@2x.png">${
          forecast.wind.speed
        } m/s</td>
    `;
    forecastBody.appendChild(forecastItem);
  }
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

  messageOne.textContent = 'Loading..';
  messageTwo.textContent = 'Loading..';
  removeChildrenElements(forecastBody);

  // Create a loader inside the table
  const spinner = document.createElement('tr');
  spinner.innerHTML = `
    <th scope="row" colspan="5">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </th>
  `;
  forecastBody.appendChild(spinner);

  fetch(url).then((response) => {
    response.json().then((data) => {
      const { error, location, forecast } = data;
      console.log(data);
      if (error) {
        messageOne.textContent = `Error! ${error}`;
        messageTwo.textContent = '';
      } else {
        messageOne.textContent = location;
        messageTwo.textContent = forecast;
        displayForecastData(data);
      }
    });
  });
});
