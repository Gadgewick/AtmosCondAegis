function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        //$('.resultSearch').emnpty();
        $('.js-error-message').empty();
        var stateVal = document.getElementsByClassName("state")[0].value;
        console.log(stateVal);
        getWeatherAlert(stateVal);
    })
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
    .then(responseJson => displayResults(responseJson))
    .catch(error => $('.js-error-message').text(`Something went wrong: ${error.message}`)
    )};

function displayResults(responseJson) {
    console.log(responseJson);
}


$(function() {
    console.log('App is loaded! Please submit value.');
    watchForm();
  });