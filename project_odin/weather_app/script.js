let autocompletedListElement = document.querySelector("ul");
let form = document.querySelector("form");
let inputField = document.querySelector("input");

inputField.addEventListener("input", ()=>{
    let searchStr = inputField.value;
    let listContainer = document.querySelector(".searchResults");

    if (searchStr.length > 4){

        listContainer.innerHTML = "<ul></ul>";

        getAutocompletedOptions(searchStr)
        .then(parseResponseJson)
        .then(populateAutocompletedContainer);
    }
    
    else{
        listContainer.innerHTML = "";
    }
});

function getAutocompletedOptions(partialString){
    let fetchPromise = fetch(`https://photon.komoot.io/api/?q=${partialString}&limit=3`, { mode: "cors" });
    let jsonPromise = fetchPromise.then((response) => {
        return response.json();
    });
    
    return jsonPromise;
}

function parseResponseJson(originalResponseJson){
    let autocompletedCitynames = [];

    let features = originalResponseJson.features;

    features = features.filter(place => {
        return place.properties.type == "city";
    });

    features.forEach((feature) => {
        autocompletedCitynames.push(feature.properties.name + ", " + feature.properties.country)
    });

    return resolve(autocompletedCitynames);
}

function populateAutocompletedContainer(autocompletedStrings){
    let autocompletedListElement = document.querySelector("ul");
    autocompletedListElement.innerHTML = "";

    autocompletedStrings.forEach(strValue => {
        let autocompletedElement = document.createElement("li");
        autocompletedElement.textContent = strValue;

        autocompletedListElement.appendChild(autocompletedElement);

        autocompletedElement.addEventListener("click", () => {
            let inputField = document.querySelector("input");
            inputField.value = strValue;
        });
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    let autocompletedListContainer = document.querySelector(".searchResults");
    autocompletedListContainer.innerHTML = "";
    
    showDialog();

    let weatherInfoContainer = document.querySelector(".weatherContainer");

    weatherInfoContainer.innerHTML = `<div class="todayContainer">
            <div class="topPortion">
            </div>
            <div class="bottomPortion">
            </div>
        </div>
        <div class="weekContainer"> 
        </div>`;

    getSevenDaysWeather(inputField.value)
    .then(displayTodayWeather)
    .then(populateUpcomingDays)
    .then(closeDialog);
});

async function getSevenDaysWeather(locationName){
    let request = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices` +
        `/rest/services/timeline/${locationName}?key=KJASBFKSBFXXXXXXXXXX`,
        { mode: "cors"} );
    
    let json = await request.json();
    return json.days.slice(0, 7);
}

function displayTodayWeather(allDays){
    let todayWeatherDetails = allDays[0];

    let topPortionContainer = document.querySelector(".todayContainer .topPortion");

    let maxTempSpan = document.createElement("span");
    let minTempSpan = document.createElement("span");
    let cloudcoverSpan = document.createElement("span");
    let humiditySpan = document.createElement("span");
    let descriptionSpan = document.createElement("span");
    let image = document.createElement("img");
    let infoContainer = document.createElement("div");

    maxTempSpan.textContent = "Max: " + todayWeatherDetails.tempmax;
    minTempSpan.textContent = "Min: " + todayWeatherDetails.tempmin;
    cloudcoverSpan.textContent = "Clouds: " + todayWeatherDetails.cloudcover;
    humiditySpan.textContent = "Humidity: " + todayWeatherDetails.humidity;
    descriptionSpan.textContent = todayWeatherDetails.description;

    image.src = `./weather_icons/${todayWeatherDetails.icon}.svg`;
    image.height = 300;
    image.width = 300;

    infoContainer.appendChild(maxTempSpan);
    infoContainer.appendChild(minTempSpan);
    infoContainer.appendChild(cloudcoverSpan);
    infoContainer.appendChild(humiditySpan);

    topPortionContainer.appendChild(image);
    topPortionContainer.appendChild(infoContainer);

    let bottomPortionContainer = document.querySelector(".todayContainer .bottomPortion");

    bottomPortionContainer.appendChild(descriptionSpan);

    return new Promise((resolve) =>{
        resolve(allDays.slice(1, allDays.length));
    });
}

function populateUpcomingDays(allDays){
    allDays.forEach(dayInfo =>{
        displayUpcomingDay(dayInfo);
    });
    return new Promise(resolve => resolve());
}

function displayUpcomingDay(dayInfo){
    let weekContainer = document.querySelector(".weekContainer");

    let dayContainer = document.createElement("div");
    dayContainer.className = "dayContainer";

    let infoContainer = document.createElement("div");

    let img = document.createElement("img");
    img.src = `./weather_icons/${dayInfo.icon}.svg`;
    img.height = 50;
    img.width = 50;

    let maxTempSpan = document.createElement("span");
    let minTempSpan = document.createElement("span");

    maxTempSpan.textContent = "Max: " + dayInfo.tempmax;
    minTempSpan.textContent = "Min: " + dayInfo.tempmin;

    infoContainer.appendChild(maxTempSpan);
    infoContainer.appendChild(minTempSpan);

    dayContainer.appendChild(img);
    dayContainer.appendChild(infoContainer);

    weekContainer.appendChild(dayContainer);
}

function showDialog(){
    let dialog = document.querySelector("dialog");
    dialog.showModal();
}

function closeDialog(){
    let dialog = document.querySelector("dialog");
    dialog.close();
}