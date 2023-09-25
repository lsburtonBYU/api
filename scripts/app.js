// my house: https://api.weather.gov/points/40.2585,-111.6877

const KM_CONSTANT = 0.621371;
const station = "KPVU"; //provo airport
const latestObsURL = `https://api.weather.gov/stations/${station}/observations/latest`;
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const directions = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

// utility conversion functions
convertToF = celsius => Math.round((celsius * 9) / 5 + 32);
makeID = word => `#${word.replace(/\s/g, "-").toLowerCase()}`;
convertToMiles = km => Math.round(km * KM_CONSTANT);
getWindDirectionFromAngle = angle => directions[Math.round(angle / 22.5)];
getDate = date =>
  `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
getTime = date =>
  `${
    date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
  }:${date.getMinutes()}${date.getHours() > 12 ? "pm" : "am"}`;

latestObs = document.querySelector(".currentWeather");
getData();

function getData() {
  fetch(latestObsURL)
    .then(response => response.json())
    .then(data => displayCurrentObs(data))
    .catch(error => console.log("error", error));
}

function displayCurrentObs(data) {
  d = data;
  console.log("data", d);

  if (data === null) {
    document.querySelector(".currentWeather").innerHTML = "Service unavailable";
  } else {
    while (latestObs.firstChild) {
      latestObs.removeChild(latestObs.firstChild);
    }

    const timestamp = new Date(data.properties.timestamp);

    let element = document.createElement("p");
    element.classList.add("date");
    element.textContent = getDate(timestamp);
    latestObs.appendChild(element);

    element = document.createElement("p");
    element.classList.add("location");
    element.textContent = "Provo, Utah";
    latestObs.appendChild(element);

    element = document.createElement("p");
    element.classList.add("temp");
    element.textContent = `${convertToF(data.properties.temperature.value)}°`;
    latestObs.appendChild(element);

    element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.innerHTML = `<use href="${makeID(
      data.properties.textDescription
    )}"/>`;
    latestObs.appendChild(element);

    element = document.createElement("p");
    element.classList.add("wind");
    element.textContent = `Wind ${Math.round(
      convertToMiles(data.properties.windSpeed.value ?? 0)
    )} mph ${
      data.properties.windDirection.value
        ? getWindDirectionFromAngle(data.properties.windDirection.value)
        : ""
    }`;
    latestObs.appendChild(element);

    element = document.createElement("p");
    element.classList.add("humidity");
    element.textContent = `Humidity ${data.properties.relativeHumidity.value.toFixed(
      0
    )}%`;
    latestObs.appendChild(element);

    element = document.createElement("p");
    element.classList.add("time");
    element.textContent = `Generated at ${getTime(timestamp)}`;
    latestObs.appendChild(element);
  }
}
