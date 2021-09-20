var citiesContainerEl = document.querySelector("#cities-container");
var searchedCityEl = document.querySelector("#city-name");
var userFormEl = document.querySelector("#user-form");


var getWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=7248aa3a743ea022a756c41339f152c4";

    fetch(apiUrl).then(function(response) {
        
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                var cityNameEl = document.getElementById("city-title");
                var cityName = data.name;
                cityNameEl.textContent = cityName;

                var visitedContainerEl = document.getElementById("cities-container");

                var visitedCityEl = document.createElement("a");
                visitedCityEl.setAttribute("class", "visited-city");
                visitedCityEl.textContent = cityName;
                visitedContainerEl.append(visitedCityEl);
                
                // console.log(data);   
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                
                var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7248aa3a743ea022a756c41339f152c4";

                fetch(oneCallUrl).then(function(response) {
                    response.json().then(function(data) {
                        displayWeather(data, city);
                    })
                })
                
            });

        } else {
            alert("Error: The city could not found.")
        }
    })
    .catch(function(error) {
        alert("Unable to connect");
    });
}

var getForecast = function(city) {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=7248aa3a743ea022a756c41339f152c4";

    fetch(forecastUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            displayForecast(data, city);
        })
    })
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    //remove leading or trailing space in input element
    var city = searchedCityEl.value.trim();
    

    //check value in searched city variable
    if (city) {
        getWeather(city);
        getForecast(city);
        
        //clear the form
        searchedCityEl.value = "";
    } else {
        alert("Please enter a city.");
    }
};

var displayWeather = function(searchedCity) {
    //console.log(searchedCity);

    var cityTempEl = document.getElementById("temp-degrees");
    cityTempEl.textContent = Math.round(searchedCity.current.temp) + "\xB0"; 

    var cityWindEl = document.getElementById("wind-speed");
    cityWindEl.textContent = Math.round(searchedCity.current.wind_speed);

    var cityHumidityEl = document.getElementById("humidity-percent");
    cityHumidityEl.textContent = searchedCity.current.humidity;

    var cityUvEl = document.getElementById("uv-decimal");
    cityUvEl.textContent = searchedCity.current.uvi;

    if (searchedCity.current.uvi <=2 && searchedCity.current.uvi >= 0) {
        cityUvEl.classList.add("favorable");
    } if (searchedCity.current.uvi <= 7 && searchedCity.current.uvi >= 3) {
        cityUvEl.classList.add("moderate");
    } else {
        cityUvEl.classList.add("severe");
    }
}


var displayForecast = function(searchedCity) {
    var days = [];
    for (var i = 0; i < searchedCity.list.length; i+=8) {
        days.push(searchedCity.list[i]);
        console.log(days);
    }
    //var day1Date = document.getElementById("day1");
    //day1Date.textContent = searchedCity.forecast.timefrom;
}

userFormEl.addEventListener("submit", formSubmitHandler);