console.log('Client side js file is loaded!');

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-one');
const messageTwo = document.querySelector('#message-two');

const urlBuilder = ({
  geometry = null,
  formatted_address = null,
  name = null,
}) => {
  if (geometry) {
    return `http://localhost:3000/forecast?lon=${geometry.location.lng()}&lat=${geometry.location.lat()}&address=${formatted_address}`;
  } else {
    return `http://localhost:3000/weather?address=${name}`;
  }
};

const locationInput = document.getElementById('locationInput');
const autoComplete = new google.maps.places.Autocomplete(locationInput, {
  types: ['(regions)'],
});

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
  fetch(urlBuilder(suggestion)).then((response) => {
    response.json().then((data) => {
      const { error, location, forecast } = data;
      if (error) {
        messageOne.textContent = `Error! ${error}`;
        messageTwo.textContent = '';
      } else {
        messageOne.textContent = location;
        messageTwo.textContent = forecast;
      }
    });
  });
});
