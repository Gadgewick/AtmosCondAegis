function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        $('.shelter').empty();
        $('.weatherAlert').empty();
        $('.js-error-message').empty();
        var stateVal = document.getElementsByClassName("state")[0].value;
        var addressVal = $(`#address`).val()
        $('.shelter').hide();
        $('.weatherAlert').show();
        getWeatherAlert(stateVal);
        getLatLng(stateVal,addressVal)
    })
}

function getLatLng(stateVal, addressVal) {
    var encodeAddressVal= addressVal.replace(" ", "+");
    var key= "AIzaSyBlqsxvTm23APcJur8ztY7Ul_4Bdl5Czjs";
    var url= `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddressVal}+${stateVal}&key=${key}`;
    fetch(url) 
    .then (response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);

    })
    .then(latLng => initMap(latLng))
    .catch(error => $('.js-error-message').text(`No results found`)) 
}


var map, infowindow;

function initMap(latLng) {
var latLngArray= latLng.results[0].geometry.location;

  var request = {
    query: `emergency+shelter`,
    fields: ['name', 'formatted_address', 'geometry'],
    locationBias: latLngArray
  };
  var mapCenter= {
      lat: 0,
      lng: 130
  };

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(
      document.getElementById('map'), {center: mapCenter, zoom: 15}
  );

var service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place= results[i];

        createMarker(place);
      }
      map.setCenter(results[0].geometry.location);
    
    }
});
}

function createMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        var contentString= `<h3>${place.name}</h3><h4>${place.formatted_address}</h4>`;
      infowindow.setContent(contentString);
      infowindow.open(map, this);
    });
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
    .catch(error => $('.js-error-message').text(`No results found`)
    )};

function displayResultsWeather(weatherData) {
    var weatherAlertList = weatherData.features;
    for (let i=0; i < weatherAlertList.length; i++) {
        if (weatherAlertList[i].properties) {
            $('.weatherAlert').append(`<h1 class="blockTitle">${weatherAlertList[i].properties.event}</h1><h4 class="otherBodyText">${weatherAlertList[i].properties.headline}</h4><h5>${weatherAlertList[i].properties.areaDesc}</h5><p>${weatherAlertList[i].properties.description}</p><p>${weatherAlertList[i].properties.instruction}</p>`);
        } else {
            $('.weatherAlert').append(`<h3>There are no Weather Alerts at this time</h3>`);
        }
    }

    $('.results').removeClass('hidden');
}

function show(sectionButton, sectionSelector) {
    $('.navbar').on('click', sectionButton, function() {
        event.preventDefault();
        $('.content').hide();
        $(sectionSelector).fadeIn();
    })
}

function onReady(callback) {
    var intervalId = window.setInterval(function() {
      if (document.getElementsByTagName('body')[0] !== undefined) {
        window.clearInterval(intervalId);
        callback.call(this);
      }
    }, 1000);
  }
  
  function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
  }
  
  onReady(function() {
    setVisible('.results', true);
    setVisible('#loading', false);
  });

$(function() {
    watchForm();
  });

  show('.weatherAlertButton', '.weatherAlert')
  show('.shelterButton', '.shelter')