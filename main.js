let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchIcon");

let locationReq = new XMLHttpRequest();
let locationApiKey = "452e18e08a6f7fa016675befc2cc15c6a584c163fb30622d6a9bbed3";
let locationUrl = `https://api.ipdata.co/?api-key=${locationApiKey}`;
let weatherApiKey = "606598bc0df2ed2c7f731258ccedc54c";
// let cityName = "Khartoum";
// let talAndLanUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},&limit=5&appid=${weatherApiKey}`;

window.onload = () => {
    getData(locationUrl)
        .then((location) => weather(location.city))
        .catch((error) => console.log(error));
};
searchBtn.addEventListener("click", () => {
    weather(searchInput.value);
});
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") weather(searchInput.value);
});
//--------------------------------------------------------------
const getData = (apiLink) => {
    return new Promise((resolve, reject) => {
        let myRequest = new XMLHttpRequest();
        myRequest.onload = function () {
            if (this.readyState === 4 && this.status === 200) {
                resolve(JSON.parse(this.responseText));
            } else {
                reject(Error("No Data Found"));
            }
        };

        myRequest.open("GET", apiLink);
        myRequest.send();
    });
};

let weather = (cityName) => {
    getData(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},&limit=1&appid=${weatherApiKey}`
    )
        .then((locations) => [locations[0].lat, locations[0].lon])
        .then((latAndLon) => getWeatherData(...latAndLon))
        .catch((error) => console.log(error));
};

let getWeatherData = (lat, lon) => {
    getData(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
    ).then((data) => setWeatherInfo(data));
};

let setWeatherInfo = (WeatherObject) => {
    let tempDisplay = document.getElementById("deg");
    let cityDisplay = document.getElementById("city");
    let windDisplay = document.getElementById("wind");
    let humidityDisplay = document.getElementById("humidity");
    let weatherCondition = document.getElementById("weatherCondition");
    console.log(WeatherObject);
    tempDisplay.textContent = Math.round(WeatherObject.main.temp);
    cityDisplay.textContent =
        WeatherObject.name + "," + WeatherObject.sys.country;
    windDisplay.textContent = WeatherObject.wind.speed;
    humidityDisplay.textContent = WeatherObject.main.humidity;
    weatherCondition.textContent = WeatherObject.weather[0].main;
    setWeatherCondition(WeatherObject.weather[0]);
};

let setWeatherCondition = (condition) => {
    // condition = condition.toLowerCase();
    let conDisplay = document.getElementById("condition");
    conDisplay.src = `https://openweathermap.org/img/wn/${condition.icon}.png`;
};
