//Core JS

const STORE = [1,2,3,4];

function clearSTORE() {
    STORE.length = 0;
}

function watchForm() {
    $('.myButton').click(event => {
        event.preventDefault();
        $(`#countyInput`).empty();
        $('.shelter').empty();
        $('.weatherAlert').empty();
        $('.js-error-message').empty();
        clearSTORE();
        const stateVal = document.getElementsByClassName("state")[0].value;
        const addressVal = $(`.city`).val()
        $('.shelter').hide();
        $('#countyInput').show();
        $('.weatherAlert').show();
        getWeatherAlert(stateVal);
        getLatLng(stateVal,addressVal)
    })
}


//Shelter Section
function getLatLng(stateVal, addressVal) {
    const encodeAddressVal= addressVal.replace(" ", "+");
    const key= "AIzaSyBlqsxvTm23APcJur8ztY7Ul_4Bdl5Czjs";
    //GET geocode data fom Google Geocode
    const url= `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddressVal}+${stateVal}&key=${key}`;
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
//Using the client side Places Library to search for our query using the geocode location 
function initMap(latLng) {
const latLngArray= latLng.results[0].geometry.location;

  const request = {
    query: `emergency+shelter`,
    fields: ['name', 'formatted_address', 'geometry'],
    locationBias: latLngArray
  };
  const mapCenter= {
      lat: 0,
      lng: 130
  };

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(
      document.getElementById('map'), {center: mapCenter, zoom: 15}
  );

const service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place= results[i];

        createMarker(place);
      }
      map.setCenter(results[0].geometry.location);
    
    }
});
}

function createMarker(place) {
    const marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        const contentString= `<h3>${place.name}</h3><h4>${place.formatted_address}</h4>`;
      infowindow.setContent(contentString);
      infowindow.open(map, this);
    });
}

//Weather Section

function getWeatherAlert(stateVal) {
    //GET from the National Weather Service API
    const baseUrl = "https://api.weather.gov/alerts/active/area/";
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
    const weatherAlertList = weatherData.features;
    for (let i=0; i < weatherAlertList.length; i++) {
        if (weatherAlertList[i].properties) {
            const countyValArray= weatherAlertList[i].properties.areaDesc.split(';');
            infoArray = i;
            for (let j = 0; j < countyValArray.length; j++) {
                    STORE.push({
                    county : countyValArray[j],
                    headline : weatherAlertList[i].properties.headline,
                    description : weatherAlertList[i].properties.description,
                    instruction : weatherAlertList[i].properties.instruction
                });
            }
        } else {
            $('.weatherAlert').append(`<h3>There are no Weather Alerts at this time</h3>`);
        }
        
    }

    countySearch();
}

function countySearch() {
    $('.county').append($(`<option value="County_Select">County Select</option>`));
    $('.weatherAlert').append(`<div class="alertInfo"><h1 class="weatherText">If no counties are selectable in the drop down menu that means there are no weather warnings at this time.</h1></div>`);
    for (let i=0; i < STORE.length; i++) {
        const countyIndex = i;
        const infoID= STORE[countyIndex].county;
        var countyDesc = STORE[countyIndex].description;
        countyDesc = countyDesc.replace(/\*/g, "<br>");
        //countyDesc= countyDesc.replace(/\./g, ".  ");
        countyDesc = countyDesc.replace("null", "");
        var countyInst = STORE[countyIndex].instruction;
        $('.county').append($(`<option class="countyInputOption" val="${infoID.replace(/\s/g, '')}">${infoID}</option>`));
        const weatherAlertGenerator = `<div class="alertInfo hidden" id="${infoID.replace(/\s/g, '')}"><h1 class="weatherText">${STORE[countyIndex].headline}</h1><p>${countyDesc}</p><p>${countyInst}</p></div>`;
        $('.weatherAlert').append(weatherAlertGenerator.replace("null", ""));
    };
        
        $(`#countyInput`).change(function() {
            const countySelected = $("#countyInput option:selected").val().replace(/\s/g, '');
            const weatherShow = document.getElementById(`${countySelected}`);
                if(countySelected) {
                    $(".alertInfo").hide();
                    $(weatherShow).show();
                } else{
                    $(".alertInfo").hide();
                }
        })
    
}

//Nav element
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

//Load screen
function onReady(callback) {
    const intervalId = window.setInterval(function() {
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

 //functions that are called

$(function() {
    watchScroll();
    watchForm();
  });

  show('.weatherAlertButton', '.weatherAlert')
  show('.shelterButton', '.shelter')