let searchFormEl = document.querySelector("#search-form");
let searchInputEl = document.querySelector("#searchbar");
let rightContainerEl = document.querySelector(".right-container");
let rightBottomEl = document.querySelector(".right-bottom");
let forecastTitleEl = document.querySelector("#forecast-title");
let targetCity = document.querySelector("#target-city")
let cityName;


let formSubmitHandler = function(event) {
    event.preventDefault();
    geocoding();
};



let geocoding = function() {

    cityName = searchInputEl.value.trim();
    console.log(cityName);
    
   
   let openWeatherBaseUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
   let geocodingUrl = openWeatherBaseUrl + cityName + ",us&limit=5&appid=966f438203d0b88a9f9515f495dd00a2";

   fetch(geocodingUrl)
   .then(function (response) {
     return response.json()
   })
   .then(function (data) {
     console.log(data);
     cityName = data[0].name;
     targetCity.textContent = cityName + " (" + (new Date).toLocaleDateString() + ")";
     let cityLat = data[0].lat;
     let cityLon = data[0].lon;
     
    getCurrentWeather(cityLat, cityLon);
    rightBottomEl.innerHTML = "";
    forcast5days(cityLat,cityLon);
    addToSearchHistory();

   });
};

let getCurrentWeather= function(lat, lon) {
    let currentweatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=966f438203d0b88a9f9515f495dd00a2`;

    fetch(currentweatherUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);


        let iconCode = data.current.weather[0].icon;
        // console.log(iconCode);
        let temperature = data.current.temp + "°F";
        // console.log(temperature);
        let humidity = data.current.humidity + "%";
        // console.log(humidity);
        let windSpeed = data.current.wind_speed + "MPH";
        // console.log(windSpeed);
        let uvIndex = data.current.uvi;
        // console.log(uvIndex);
        
        displayCurrent(iconCode, temperature, humidity, windSpeed, uvIndex);

    })
}

let displayCurrent = function(icon, temp, humidity, windspped, uvi) {

    rightContainerEl.innerHTML = "";

    let currentDiv = document.createElement("div")
    currentDiv.id = "current-div";


    // let cityP = document.createElement("p")
    // tempP.innerText = cityName1;
    // let dateP = document.createElement("p")
    // tempP.innerHTML = new Date;

    let iconurl = `http://openweathermap.org/img/w/${icon}.png`;
    let iconI = document.createElement("img");
    iconI.setAttribute("src", iconurl);
    let tempP = document.createElement("p")
    tempP.innerText = "Temperature: " + temp;
    let humidityP = document.createElement("p")
    humidityP.innerText = "Humidity: " + humidity;
    let windspeedP = document.createElement("p")
    windspeedP.innerText = "Wind Speed: " + windspped;
    let uviP = document.createElement("p")
    uviP.innerText = "UV Index: " + uvi;
    
    //uv index and color code
    if(uvi < 2){
        uviP.classList.add("lowuv")
    } else if (uvi < 5) {
        uviP.classList.add("moduv")
    } else if (uvi < 7) {
        uviP.classList.add("highuv")
    } else if (uvi <10) {
        uviP.classList.add("veryhighuv")
    }
   

    // currentDiv.appendChild(cityP);
    // currentDiv.appendChild(dateP);
    currentDiv.appendChild(iconI);
    currentDiv.appendChild(tempP);
    currentDiv.appendChild(humidityP);
    currentDiv.appendChild(windspeedP);
    currentDiv.appendChild(uviP);
    rightContainerEl.appendChild(currentDiv);
    forecastTitleEl.innerText = "5-Days Forecast";
}

let forcast5days = function (lat, lon) {


    //  let forecastTitle = document.createElement("h2");
    //  forecastTitle.addClass = "d-block";
    //  forecastTitle.innerText = "5-Day Forecast";
    //  document.getElementById("forecast-title").append(forecastTitle);

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
            forcastDiv.classList.add("forcast-div");
            

            // let date = new Date((data.list[i].dt) * 1000);
            let date = new Date(data.list[i].dt*1000).toLocaleDateString("en-US");
            // console.log(date);

            let forcastDateP = document.createElement("div");
            forcastDateP.innerText = date;


            let forcastIcon= document.createElement("img");
            let forcastIconCode = data.list[i].weather[0].icon;
            let iconurl = `http://openweathermap.org/img/w/${forcastIconCode}.png`;
            forcastIcon.setAttribute("src", iconurl);

            
            let forcastTempP = document.createElement("p")
            forcastTempP.innerText = "Temperature: " + data.list[i].main.temp;
            // console.log(data.list[i].main.temp);
            let forcastHumidityP = document.createElement("p")
            forcastHumidityP.innerText = "Humidity: " + data.list[i].main.humidity;
            // console.log(data.list[i].main.humidity);
        
            
            forcastDiv.appendChild(forcastDateP);
            forcastDiv.appendChild(forcastIcon);
            forcastDiv.appendChild(forcastTempP);
            forcastDiv.appendChild(forcastHumidityP);

            rightBottomEl.appendChild(forcastDiv);
        }
    });
};


let cityRowEl = document.querySelector("#cityRow");
let citiesArr;

let renderSearchHistory = function () {

    citiesArr = JSON.parse(localStorage.getItem("searched")) || [];

    for (let i=0; i<citiesArr.length; i++) {
        let cityblock = document.createElement("td")
        cityblock.innerText = citiesArr[i];
        cityRowEl.appendChild(cityblock);
    }
    
}

let addToSearchHistory = function() {
 console.log(cityName);

 
 citiesArr.push(cityName);
 localStorage.setItem("searched", JSON.stringify(citiesArr));
 console.log(citiesArr);

 let newcityblock = document.createElement("td")
 newcityblock.innerText = cityName;
 cityRowEl.appendChild(newcityblock);

};

renderSearchHistory();
searchFormEl.addEventListener("submit", formSubmitHandler);




// improve city name display

// let improveCityNameFormat = function(str) {
//  let inputLower = str.toLowerCase();
//     if (str.includes(" ")) {
//         let splitted = str.split(" "); //["new", "york"]
//         let newArr = [];
//         for (let i = 0; i<splitted.length; i++ ) {
            
//           let newWord = splitted[i].charAt(0).toUpperCase + splitted[i].slice(1);
//           newArr.push(newWord);
//           return newArr.join(" ");
//         }
//     }
//     return inputLower.charAt(0).toUpperCase + inputLower.slice(1);
    
// }


// console.log(improveCityNameFormat("new York"));
// console.log(improveCityNameFormat("new york"));
// console.log(improveCityNameFormat("sAn franCisco"));
// console.log(improveCityNameFormat("chiCAgo"));