let searchFormEl = document.querySelector("#search-form");
let searchInputEl = document.querySelector("#searchbar");
let rightContainerEl = document.querySelector(".right-container");
let rightBottomEl = document.querySelector(".right-bottom");


let formSubmitHandler = function(event) {
    event.preventDefault();
    geocoding();
   
};

let geocoding = function() {

    let cityName = searchInputEl.value.trim();
   
   let openWeatherBaseUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";
   let geocodingUrl = openWeatherBaseUrl + cityName + ",us&limit=5&appid=966f438203d0b88a9f9515f495dd00a2";

   fetch(geocodingUrl)
   .then(function (response) {
     return response.json()
   })
   .then(function (data) {
     console.log(data);
     var cityLat = data[0].lat;
     var cityLon = data[0].lon;
     
    getCurrentWeather(cityLat, cityLon);
    forcast5days(cityLat,cityLon);

   });
};

var getCurrentWeather= function(lat, lon) {
    let currentweatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=966f438203d0b88a9f9515f495dd00a2`;

    fetch(currentweatherUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);


        var iconCode = data.current.weather[0].icon;
        // console.log(iconCode);
        var temperature = data.current.temp + "°F";
        // console.log(temperature);
        var humidity = data.current.humidity + "%";
        // console.log(humidity);
        var windSpeed = data.current.wind_speed + "MPH";
        // console.log(windSpeed);
        var uvIndex = data.current.uvi;
        // console.log(uvIndex);
        
        displayCurrent(iconCode, temperature, humidity, windSpeed, uvIndex);

    })
}

let displayCurrent = function(icon, temp, humidity, windspped, uvi) {

    rightContainerEl.innerHTML = "";

    var currentDiv = document.createElement("div")
    currentDiv.id = "current-div";


    // var cityP = document.createElement("p")
    // tempP.innerText = cityName1;
    // var dateP = document.createElement("p")
    // tempP.innerHTML = new Date;

    var iconurl = `http://openweathermap.org/img/w/${icon}.png`;
    var iconI = document.createElement("img");
    iconI.setAttribute("src", iconurl);
    var tempP = document.createElement("p")
    tempP.innerText = "Temperature: " + temp;
    var humidityP = document.createElement("p")
    humidityP.innerText = "Humidity: " + humidity;
    var windspeedP = document.createElement("p")
    windspeedP.innerText = "Wind Speed: " + windspped;
    var uviP = document.createElement("p")
    uviP.innerText = "UV Index: " + uvi;
   

    // currentDiv.appendChild(cityP);
    // currentDiv.appendChild(dateP);
    currentDiv.appendChild(iconI);
    currentDiv.appendChild(tempP);
    currentDiv.appendChild(humidityP);
    currentDiv.appendChild(windspeedP);
    currentDiv.appendChild(uviP);
    rightContainerEl.appendChild(currentDiv);
}

var forcast5days = function (lat, lon) {

    let forcastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=966f438203d0b88a9f9515f495dd00a2`;
    // let forcastUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&units=imperial&ctn=6&appid=966f438203d0b88a9f9515f495dd00a2`;

    fetch(forcastUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        
        for (let i=7; i<40; i+=8) {

            let forcastDiv = document.createElement("div");

            // var date = new Date((data.list[i].dt) * 1000);
            let date = new Date(data.list[i].dt*1000).toLocaleDateString("en-US");
            console.log(date);

            let forcastDateP = document.createElement("div");
            forcastDateP.innerText = date;


            let forcastIcon= document.createElement("img");
            let forcastIconCode = data.list[i].weather[0].icon;
            let iconurl = `http://openweathermap.org/img/w/${forcastIconCode}.png`;
            forcastIcon.setAttribute("src", iconurl);

            
            let forcastTempP = document.createElement("p")
            forcastTempP.innerText = "Temperature: " + data.list[i].main.temp;
            console.log(data.list[i].main.temp);
            let forcastHumidityP = document.createElement("p")
            forcastHumidityP.innerText = "Humidity: " + data.list[i].main.humidity;
            console.log(data.list[i].main.humidity);
        

            forcastDiv.appendChild(forcastDateP);
            forcastDiv.appendChild(forcastIcon);
            forcastDiv.appendChild(forcastTempP);
            forcastDiv.appendChild(forcastHumidityP);

            rightBottomEl.appendChild(forcastDiv);
        }
    });
};

searchFormEl.addEventListener("submit", formSubmitHandler)
