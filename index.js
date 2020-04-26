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
        fetch (`${baseUrl}input=emergency+shelter&inputtype=textquery&locationbias=circle:5000@${latLongVal}${key}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResultsShelter(responseJson))
        .catch(error => $('.js-error-message').text(`Something went wrong: ${error.message}`)
        )};
    

function displayResultsShelter(responseJson) {
            console.log(responseJson);
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
}


$(function() {
    console.log('App is loaded! Please submit value.');
    watchForm();
  });