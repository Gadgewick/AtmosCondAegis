function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        //$('.resultSearch').emnpty();
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
    var addressEncode = addressVal.replace(' ', '+');
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
    console.log(latLongVal.toString());
    fetch (`${baseUrl}input=emergency+shelter&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&locationbias=circle:5000@${latLongVal}${key}`)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(shelterLocationData => displayResultsShelter(shelterLocationData))
    .catch(error => $('.js-error-message').text(`Something went wrong: ${error.message}`)
)};
    

function displayResultsShelter(shelterLocationData) {
        var data = shelterLocationData.candidates[0];
            var photoData = data.photos[0];
            console.log(data);
           $('.shelter').append(`<h1 class="blockTitle">Shelter</h1><div class="resultsPhoto">${photoData.html_attributions[0]}</div><h3 class="mainBodyText">${data.name}</h3><h4 class="otherBodyText">${data.formatted_address}</h4>`)
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
    .then(responseJson => displayResultsWeather(responseJson))
    .catch(error => $('.js-error-message').text(`Something went wrong: ${error.message}`)
    )};

function displayResultsWeather(responseJson) {
    console.log(responseJson);
    $('.results').removeClass('hidden');
}


$(function() {
    console.log('App is loaded! Please submit value.');
    watchForm();
  });