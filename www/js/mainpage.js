/**
 * Created by Philip on 3/21/17.
 */
var marker;
var locationObj = [];
var currentStatus = 0;
var myLat;
var myLng;
var distance;
var happened = 0;

var intro = angular.module('starter', ['ionic'])

	.run(function ($ionicPlatform) {

		$ionicPlatform.ready(function () {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

				// Don't remove this line unless you know what you are doing. It stops the viewport
				// from snapping when text inputs are focused. Ionic handles this internally for
				// a much nicer keyboard experience.
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				StatusBar.styleDefault();
			}
		});
	});

/**
 * Created by Philip on 3/21/17.
 */

var map;
var app = angular.module('starter', ['ionic'])

	.run(function ($ionicPlatform) {
		//Could be commented out
		$ionicPlatform.ready(function () {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

				// Don't remove this line unless you know what you are doing. It stops the viewport
				// from snapping when text inputs are focused. Ionic handles this internally for
				// a much nicer keyboard experience.
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
				StatusBar.styleDefault();
			}
		});
	});


/**
 * Created by Philip on 3/21/17.
 */

// mapControl
app.controller('huntControl', function ($scope, $ionicPopup) {

	initMap();
	$scope.data = JSON.parse(localStorage.getItem("locationData"));

	$scope.init = function () {
		$ionicPopup.show({
			title: "Welcome to Tufts Scavenger",
			template: "<div>Click the hint button to get your precious hint</div><div>Click the distance button to know your progress</div>",
			buttons: [{
				text: 'Start Now',
				type: 'button-balanced',
				onTap: function () {
					$scope.generateLocation();
					$scope.autoUpdate();
				}
			}]
		});
	};


	$scope.generateLocation = function () {
		var location1 = Math.floor(Math.random() * 48) + 0;

		locationObj.push($scope.data[location1]);

		$scope.startGame();
	};

	$scope.startGame = function () {


	};

	$scope.hintPopup = function () {
		$ionicPopup.show({
			title: "Here is your hint",
			template: locationObj[currentStatus].long_desc,
			buttons: [{
				text: 'Cancel',
				type: 'button-royal'
			}]
		});
	};


	$scope.distPopup = function () {
		$ionicPopup.show({
			title: "You wanna know how far your are?",
			template: '<div>' + distance + '</div>' + " meters away from destination",
			buttons: [{
				text: 'Cancel',
				type: 'button-royal'
			}]
		});
	};


	$scope.checkDist = function () {
		if (distance < 30) {
			if (happened == 0) {
				$scope.finishPopupstage();
				happened = 1;
			}

		}

	};


	$scope.autoUpdate = function () {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				var newPoint = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude);

				myLat = position.coords.latitude;
				myLng = position.coords.longitude;

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

				map.setCenter(newPoint);
				calculateDist();
				$scope.checkDist();
			});

			// Call the autoUpdate() function every 5 seconds
			setTimeout($scope.autoUpdate, 300);
		} else {
			alert("Sorry, Geolocation not supported");
		}
	};

	$scope.finishPopupstage = function () {
		$ionicPopup.show({
			title: "Congrats! You have found this building!",
			template: 'You just found the place! Nice work!',
			buttons: [{
				text: 'Play another one',
				type: 'button-balanced',
				onTap: function () {
					happened = 0;
					$scope.generateLocation();
				}
			}]
		});
	};
});

function calculateDist() {
	var bldgPos = new google.maps.LatLng({lat: locationObj[currentStatus].lat, lng: locationObj[currentStatus].lng});
	var myPos = new google.maps.LatLng({lat: myLat, lng: myLng});

	distance = google.maps.geometry.spherical.computeDistanceBetween(bldgPos, myPos);

}