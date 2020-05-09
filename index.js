const STORE = [1,2,3,4];

function clearSTORE() {
    STORE.length = 0;
}

function watchForm() {
    $('.myButton').click(event => {
        event.preventDefault();
        $('.shelter').empty();
        $('.weatherAlert').empty();
        $('.js-error-message').empty();
        clearSTORE();
        var stateVal = document.getElementsByClassName("state")[0].value;
        var addressVal = $(`.city`).val()
        $('.shelter').hide();
        $('#countyInput').show();
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

//weather section

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
    console.log(weatherAlertList);
    for (let i=0; i < weatherAlertList.length; i++) {
        if (weatherAlertList[i].properties) {
            var countyValArray= weatherAlertList[i].properties.areaDesc.split(';');
            console.log(countyValArray);
            infoArray = i;
            for (let j = 0; j < countyValArray.length; j++) {
                    STORE.push({
                    county : countyValArray[j],
                    headline : weatherAlertList[i].properties.headline,
                    description : weatherAlertList[i].properties.description,
                    instruction : weatherAlertList[i].properties.instruction
                });

            //var weatherAlertGenerator = `<h1 class="secondHeadlineText">${STORE[infoArray].headline}</h1><p class"alertInfo">${STORE[infoArray].description}</p><p class"alertInfo">${STORE[infoArray].instruction}</p>`;
            
            //$('.weatherAlert').replaceWith(weatherAlertGenerator);
            //var countySelect = document.getElementsByClassName("county")[0].value;
            //countyDisplay(countySelect, countyShow);
            }
            console.log(STORE);
        } else {
            $('.weatherAlert').append(`<h3>There are no Weather Alerts at this time</h3>`);
        }
        
    }

    countySearch();
}

function countySearch() {
    for (let i=0; i < STORE.length; i++) {
        var countyIndex = i;
        var infoID= STORE[countyIndex].county;
        $('.county').append($(`<option class="countyInputOption" val="${infoID}">${infoID}</option>`));
        var weatherAlertGenerator = `<div class="alertInfo hidden" id="${infoID}"><h1 class="secondHeadlineText">${STORE[countyIndex].headline}</h1><p>${STORE[countyIndex].description}</p><p>${STORE[countyIndex].instruction}</p></div>`;
        $('.weatherAlert').append(weatherAlertGenerator);
    };

        $(`#countyInput`).change(function() {
            var countySelected = $("#countyInput option:selected").val();
            console.log(countySelected);
                if(countySelected) {
                    $(".alertInfo").not("#" +countySelected).hide();
                    $("#" +countySelected).show();
                } else{
                    $(".alertInfo").hide();
                }
            })
            /*var countySelected = $("#countyInput option:selected").val();
            console.log(countySelected);
            var alertByCountyShow = document.getElementsByClassName('weatherAlert');
            console.log(alertByCountyShow);*/
    
        }


    
    

     /*function countyDisplay(countyShow) {
            console.log(`${countyShow} was chosen`);
        }
    }

   function displayResultsWeather(weatherData) {
        var weatherAlertList = weatherData.features;
        for (let i=0; i < weatherAlertList.length; i++) {
            if (weatherAlertList[i].properties) {
                `<option value="AL">${weatherAlertList[i].properties.areaDesc}</option>`
                $('.weatherAlert').append(`<h1 class="blockTitle">${weatherAlertList[i].properties.event}</h1><h4 class="otherBodyText">${weatherAlertList[i].properties.headline}</h4><h5>${weatherAlertList[i].properties.areaDesc}</h5><p>${weatherAlertList[i].properties.description}</p><p>${weatherAlertList[i].properties.instruction}</p>`);
            } else {
                $('.weatherAlert').append(`<h3>There are no Weather Alerts at this time</h3>`);
            }
        }

    $('.results').removeClass('hidden');
}*/



function backToTop() {
    $('.navbar').on('click', $('.topButton'), function() {
        event.preventDefault();
        $(document.body).animate({scrollTop: 0}, "slow");
        return false;
    })
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

  function watchScroll() {
      $(document).scroll(function() {
          if (window.scrollY > 370) {
              $('.navbar').addClass('fixed');
              $('.topButton').removeClass('hidden');
          } else {
          $('.navbar').removeClass('fixed');
          $('.topButton').addClass('hidden');
        }
      })
  }

$(function() {
    watchScroll();
    watchForm();
  });

  show('.weatherAlertButton', '.weatherAlert')
  show('.shelterButton', '.shelter')