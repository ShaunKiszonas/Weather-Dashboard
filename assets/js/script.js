var cityName = document.querySelector("#current-city");
var searchCity = document.querySelector("#search-city");
var currentDate = document.querySelector("#current-date");
var submitBtn = document.querySelector("#button");

var previousSearch = [];

var uviColor = "uvi-low";

function getCity(event) {
    event.preventDefault();

    var getLatAndLon = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchCity.value + '&appid=4ce1081bbd0cd6d45033a1dc8f18bcdf';

    fetch(getLatAndLon)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                    if (previousSearch.length == 10) {
                        previousSearch.shift();
                    }
                    saveCity(previousSearch.push({ cityName: data[0].name, lat: data[0].lat, lon: data[0].lon }));
                    loadCity();
                    getCurrentWeather(data[0].lat, data[0].lon, data[0].name);
                    searchCity.value = "";
                })
            }
        })
}

function getCurrentWeather(lat, lon, name) {
    var openWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=4ce1081bbd0cd6d45033a1dc8f18bcdf';

    fetch(openWeatherUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data, name);
                })
            }
        })
}

function recentWeather(recent) {
    getCurrentWeather(recent.lat, recent.lon, recent.cityName);
}

function displayWeather(data, name) {
    cityName.textContent = name;

    subContent(0, data.current);
    subContent(1, data.daily[1]);
    subContent(2, data.daily[2]);
    subContent(3, data.daily[3]);
    subContent(4, data.daily[4]);
    subContent(5, data.daily[5]);
}

function subContent(id, data) {
    var temp = document.querySelector('#temp-' + id);
    var wind = document.querySelector('#wind-' + id);
    var humidity = document.querySelector('#humidity-' + id);
    var date = document.querySelector('#date-' + id);
    var image = document.querySelector('#image-' + id);

    wind.textContent = data.wind_speed;
    humidity.textContent = data.humidity;
    date.textContent = moment(data.dt * 1000).format('MM/DD/YYYY');
    image.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
    if (id == 0) {
        var uvI = document.querySelector('#uv-index');
        uvI.textContent = data.uvi;
        temp.textContent = data.temp;
        if (data.uvi >= 0 && data.uvi < 3) {
            uviColor = "uvi-low";
        }
        if (data.uvi >= 3 && data.uvi < 6) {
            uviColor = "uvi-moderate";
        }
        if (data.uvi >= 6 && data.uvi < 8) {
            uviColor = "uvi-high";
        }
        if (data.uvi >= 8 && data.uvi < 11) {
            uviColor = "uvi-very-high";
        }
        if (data.uvi >= 11) {
            uviColor = "uvi-extreme";
        }
        uvI.className = uviColor;
    } else {
        temp.textContent = data.temp.max;
    }
}

function saveCity() {
    localStorage.setItem("City", JSON.stringify(previousSearch));
}

function loadCity() {
    previousSearch = JSON.parse(localStorage.getItem("City"));
    var button = "";

    for (var i = 0; i < previousSearch.length; i++) {
        button += '<button type="button" id="button" onclick="recentWeather(previousSearch[' + i + '])">' + previousSearch[i].cityName + '</button>';
    }
    document.querySelector("#previous-search").innerHTML = button;
}

submitBtn.addEventListener("click", getCity);

loadCity();