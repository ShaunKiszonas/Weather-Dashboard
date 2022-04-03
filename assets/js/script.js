var cityName = document.querySelector("#current-city");
var searchCity = document.querySelector("#search-city");
var currentDate = document.querySelector("#current-date");
var submitBtn = document.querySelector("#button");

var uviColor = "uvi-low";

function getCity(event) {
    event.preventDefault();

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
    var openWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=4ce1081bbd0cd6d45033a1dc8f18bcdf';

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
    cityName.textContent = searchCity.value;

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
    image.src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
    if (id == 0) {
        var uvI = document.querySelector('#uv-index');
        uvI.textContent = data.uvi;
        temp.textContent = data.temp;
        switch (data.uvi) {
            case 0: case 1: case 2:
                uviColor = "uvi-low";
                break;
            case 3: case 4: case 5:
                uviColor = "uvi-moderate";
                break;
            case 6: case 7:
                uviColor = "uvi-high";
                break;
            case 8: case 9: case 10:
                uviColor = "uvi-very-high";
                break;
            default:
                uviColor = "uvi-extreme";
                break;
        }
        uvI.className = uviColor;
    } else {
        temp.textContent = data.temp.max;
    }
}

submitBtn.addEventListener("click", getCity);
