function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        //$('.resultSearch').emnpty();
        //$('.js-error-message').empty();
        var stateVal = document.getElementsByClassName("state")[0].value;
        console.log(stateVal);
    })
}

function getWeatherAlert(StateVal) {
    var baseUrl = "https://api.weather.gov/alerts/active/area/";
    fetch (`${baseUrl}/${stateVal}`)
}


$(function() {
    console.log('App is loaded! Please submit value.');
    watchForm();
  });