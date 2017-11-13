/**
 * Created by Philip on 3/21/17.
 */
var returnedObject = [""]
var map;
var marker;
var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

// Being called by the GoogleMap API
// Initial the googleMap with default location as 0,0
function initMap() {
    var defalutLocation = new google.maps.LatLng(42.4062040, -71.1188770);

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: defalutLocation
    });

    setCurrMarker();
}
/**
 * Created by Philip on 3/21/17.
 */

// mapControl
app.controller('mapControl', function ($scope, $ionicPopup) {
    google.maps.event.addListener(marker, 'click', function () {
        var thisPOP = $ionicPopup.show({
            title: 'Latin Way',
            template: '<div>Picture for Latin Way</div><div>Intro for Latin Way</div>',
            buttons: [{
                text: 'More Info',
                type: 'button-balanced',
                onTap: function () {
                    window.open('https://students.tufts.edu/student-affairs/residential-life/on-campus-housing/residence-halls/latin-way', '_blank')
                }
            },
            {
                text: 'Back',
                type: 'button-positive'
            }]
        });

    });

});

function setCurrMarker($ionicPopup) {
    // Set my location to the location from GeoLocation
    var LatinWay = new google.maps.LatLng(42.403986, -71.121595);

    marker = new google.maps.Marker({
        position: LatinWay,
        title: "Latin Way"
    });

    marker.setMap(map);
}