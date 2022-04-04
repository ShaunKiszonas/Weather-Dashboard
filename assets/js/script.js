var cityName = document.querySelector("#current-city");
var searchCity = document.querySelector("#search-city");
var currentDate = document.querySelector("#current-date");
var submitBtn = document.querySelector("#button");

var previousSearch = [];

var uviColor = "uvi-low";

// gets the lat and lon values for the city that was typed in
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

// Calls the api to get the data for the city that was typed in
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

// Makes the city name = the name that was searched or clicked on from the previous search buttons
function displayWeather(data, name) {
    cityName.textContent = name;

    // Calls the subContent function for all 6 days
    subContent(0, data.current);
    subContent(1, data.daily[1]);
    subContent(2, data.daily[2]);
    subContent(3, data.daily[3]);
    subContent(4, data.daily[4]);
    subContent(5, data.daily[5]);
}

// Inputs the data for the subcontent for the city
function subContent(id, data) {
    var temp = document.querySelector('#temp-' + id);
    var wind = document.querySelector('#wind-' + id);
    var humidity = document.querySelector('#humidity-' + id);
    var date = document.querySelector('#date-' + id);
    var image = document.querySelector('#image-' + id);

    // Makes the textContent for wind, humidity, time, and the image
    wind.textContent = data.wind_speed;
    humidity.textContent = data.humidity;
    date.textContent = moment(data.dt * 1000).format('MM/DD/YYYY');
    image.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";

    // For today's weather it will display the current temp and uv-index which corresponding colors
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
    }
    // Makes the next 5 days temp the max temp
    else {
        temp.textContent = data.temp.max;
    }
}

// saves city name, lat, and lon coords
function saveCity() {
    localStorage.setItem("City", JSON.stringify(previousSearch));
}

// loads and creates the button for previous searches
function loadCity() {
    previousSearch = JSON.parse(localStorage.getItem("City"));
    var button = "";

    if (previousSearch == null) {
        previousSearch = [];
    }
    for (var i = 0; i < previousSearch.length; i++) {
        button += '<button type="button" id="button" onclick="recentWeather(previousSearch[' + i + '])">' + previousSearch[i].cityName + '</button>';
    }
    document.querySelector("#previous-search").innerHTML = button;
}

submitBtn.addEventListener("click", getCity);

loadCity();