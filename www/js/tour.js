/**
 * Created by Philip on 3/21/17.
 */

var input;
var map;
var markers = [];
var marker = null;
var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  //Could be commented out
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


/**
 * Created by Philip on 3/21/17.
 */

// mapControl
app.controller('mapControl', function ($scope, $ionicPopup) {

	initMap();
	autoUpdate();

	$scope.data = JSON.parse(localStorage.getItem("locationData"));
	$scope.nameSearch = function (searchString) {
		if (input != searchString) { // Only delete markers once for a single repeat
			deleteMarkers();
			input = searchString;
		}
		return function (location) {

			if (searchString == undefined || searchString == "") {
				return true;
			}

			searchString = searchString.toLowerCase();
			var compareString = location['name'].toLowerCase();

			var substring = compareString.indexOf(searchString);
			var bo = (substring != -1);

			return (substring != -1);
		}

	};


	$scope.createMarker = function (location) {
		var newLocation = new google.maps.LatLng(location.lat, location.lng);

		var objectMarker = new google.maps.Marker({
			position: newLocation,
			title: location.name,
			map: map
		});

		markers.push(objectMarker);
		google.maps.event.addListener(objectMarker, 'click', function () {
			var customTemplate = '<div><b>Introduction</b></div><div>' + location.long_desc + '</div>';
			$ionicPopup.show({
				title: location.name,
				template: customTemplate,
				buttons: [{
					text: 'More Info',
					type: 'button-balanced',
					onTap: function () {
						window.open(location.link, '_blank')
					}
				},
					{
						text: 'Back',
						type: 'button-positive'
					}]
			});
		});
	};

});

//For the searchQuery, clear all the markers
function deleteMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}

	markers = [];
}

function autoUpdate() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var newPoint = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude);

			if (marker) {
				// Marker already created - Move it
				marker.setPosition(newPoint);
			}
			else {
				// Marker does not exist - Create it
				marker = new google.maps.Marker({
					position: newPoint,
					map: map,
					icon: "img/location.png"
				});
			}

		});
		// Call the autoUpdate() function every 5 seconds

		setTimeout(autoUpdate.bind(this),1000);
	} else {
		alert("Sorry, Geolocation not supported");
	}
}


