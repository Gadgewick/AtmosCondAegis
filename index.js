function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        $('.shelter').empty();
        $('.weatherAlert').empty();
        $('.js-error-message').empty();
        var stateVal = document.getElementsByClassName("state")[0].value;
        var addressVal = $(`#address`).val()
        console.log(stateVal);
        console.log(addressVal);
        getWeatherAlert(stateVal);
        getLatLong(stateVal,addressVal)
    })
}

function getLatLong(stateVal, addressVal) {
    var key="&key=AIzaSyBlqsxvTm23APcJur8ztY7Ul_4Bdl5Czjs";
    var baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    var addressEncode = addressVal.split(' ').join('+');
    fetch (`${baseUrl}${addressEncode}+${stateVal}${key}`)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(geoData => getShelterLocation(geoData))
    .catch(error => $('.js-error-message').text(`Something went wrong: ${error.message}`)
    )};

function getShelterLocation(geoData) {
    console.log(geoData);
    var results = Object.values(geoData)[0][0];
    var latLong = results.geometry.location;
    var latLongVal = Object.values(latLong).toString();
    var baseUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?`;
    var key="&key=AIzaSyBlqsxvTm23APcJur8ztY7Ul_4Bdl5Czjs";
    console.log(latLongVal);
    fetch (`${baseUrl}input=emergency+shelter&inputtype=textquery&fields=formatted_address,name,geometry&locationbias=circle:5000@${latLongVal}${key}`)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(shelterLocationData => createResultsShelterBox(shelterLocationData))
    .catch(error => $('.js-error-message').text(`Something went wrong: ${error.message}`)
)};
    

function createResultsShelterBox(shelterLocationData) {
    var data = shelterLocationData.candidates[0];
    console.log(data);
    var placeName = data.name;
    var placeAddress = data.formatted_address;
    var geoCodeForMapPic = placeAddress.split(' ').join('+').replace(/,/g, '');
    var baseUrl = `https://maps.googleapis.com/maps/api/staticmap?`;
    var key="&key=AIzaSyBlqsxvTm23APcJur8ztY7Ul_4Bdl5Czjs";
    console.log(geoCodeForMapPic);
    fetch (`${baseUrl}center=${geoCodeForMapPic}&zoom=17&size=500x400&markers=${geoCodeForMapPic}${key}`)
    .then(response => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error(response.statusText);
    })
    .then(miniMap => displayShelterResults(miniMap, placeName, placeAddress))
    .catch(error => $('.js-error-message').text(`Something went wrong: ${error.message}`)
    )};
        
function displayShelterResults(miniMap, placeName, placeAddress) {
    console.log(miniMap,placeName,placeAddress);
    let img = document.createElement('img');
    $('.shelter').append(img);
    $('.shelter').append(`<h1 class="blockTitle">${placeName}</h1><h3 class="mainBodyText">${placeAddress}</h3>`);
    img.src = URL.createObjectURL(miniMap);
}


function getWeatherAlert(stateVal) {
    var baseUrl = "https://api.weather.gov/alerts/active/area/";
    fetch (`${baseUrl}/${stateVal}`)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(weatherData => displayResultsWeather(weatherData))
    .catch(error => $('.js-error-message').text(`Something went wrong: ${error.message}`)
    )};

function displayResultsWeather(weatherData) {
    console.log(weatherData);
    var weatherAlertList = weatherData.features;
    for (let i=0; i < weatherAlertList.length; i++) {
        console.log('outer loop iteration' + i);
        console.log(weatherAlertList[i].properties);
        if (weatherAlertList[i].properties) {
            $('.weatherAlert').append(`<h1 class="blockTitle">${weatherAlertList[i].properties.event}</h1><h4 class="otherBodyText">${weatherAlertList[i].properties.headline}</h4><h5>${weatherAlertList[i].properties.areaDesc}</h5><p>${weatherAlertList[i].properties.description}</p><p>${weatherAlertList[i].properties.instruction}</p>`);
        } else {
            $('.weatherAlert').append(`<h3>There are no Weather Alerts at this time</h3>`);
        }
    }
    


    $('.results').removeClass('hidden');
}


$(function() {
    console.log('App is loaded! Please submit value.');
    watchForm();
  });