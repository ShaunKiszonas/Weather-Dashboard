var cityName = document.querySelector("#current-city");
var searchCity = document.querySelector("#search-city");
var currentDate = document.querySelector("#current-date");
var submitBtn = document.querySelector("#button");

function getCity(event) {
    event.preventDefault();
    cityName.textContent = searchCity.value;
    var getLatAndLon = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchCity.value + '&appid=4ce1081bbd0cd6d45033a1dc8f18bcdf';

    fetch(getLatAndLon)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                    getCurrentWeather(data[0].lat, data[0].lon);
                })
            }
        })

}

function getCurrentWeather(lat, lon) {
    var openWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=4ce1081bbd0cd6d45033a1dc8f18bcdf';

    fetch(openWeatherUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data);
                })
            }
        })
}

function displayWeather(data) {
    console.log(data);
    cityName.textContent = '(' + data.current.dt + ')';
}

submitBtn.addEventListener("click", getCity);
