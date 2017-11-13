/**
 * Created by Philip on 3/21/17.
 */
/**
 * Created by Philip on 3/21/17.
 */
var options = [];
var quest_ctr = 0;
var quiz = angular.module('starter', ['ionic'])

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

quiz.controller('quizControl', function ($scope, $ionicPopup) {

	$scope.score = 0;

	$scope.cards = JSON.parse(localStorage.getItem("locationData"));

	$scope.init = function () {
		var question = document.getElementById("question");
		var response = document.getElementById("response");
		for (var i = 1; i < 5; i++) {
			options[i - 1] = document.getElementById("option" + i);
		}
		$scope.loadQuestion();
	};


	$scope.correctAnswer = function () {
		$ionicPopup.show({

			title: "CONGRATS!",

			template: '<div>Correct! Click the button below to proceed to the next question.</div>',
			buttons: [{
				text: 'Next',
				type: 'button-balanced',
				onTap: function () {
					quest_ctr++;
					$scope.loadQuestion();
					var el = document.getElementById('option1'),
						elClone = el.cloneNode(true);

					el.parentNode.replaceChild(elClone, el);
					el = document.getElementById('option2'),
						elClone = el.cloneNode(true);

					el.parentNode.replaceChild(elClone, el);
					el = document.getElementById('option3'),
						elClone = el.cloneNode(true);

					el.parentNode.replaceChild(elClone, el);
					el = document.getElementById('option4'),
						elClone = el.cloneNode(true);
					el.parentNode.replaceChild(elClone, el);

					$scope.init();
				}
			},
				{
					text: 'Back',
					type: 'button-positive'
				}]
		});
	};

	$scope.wrongAnswer = function () {
		$ionicPopup.show({
			title: "Sorry, your answer is incorrect",
			template: '<div>Nahhhh, you can get it! Click the button below to try again</div>',
			buttons: [
				{
					text: 'Try Again',
					type: 'button-assertive'
				}]
		});
	};

	$scope.loadQuestion = function () {
		response.innerHTML = "";
		question.innerHTML = "What is the description of " + $scope.cards[quest_ctr]["name"] + "?";
		var randomNums = [-1, -1, -1, -1];
		var randomNum = Math.floor(4 * Math.random());
		randomNums[randomNum] = quest_ctr; 
		for (i = 0; i < 3; i++) {

			while (randomNum == randomNums[0] || randomNum == randomNums[1] ||
			randomNum == randomNums[2] || randomNum == randomNums[3]) {
				randomNum = Math.floor($scope.cards.length * Math.random());
			}
			if (randomNums[0] == -1) {
				randomNums[0] = randomNum;
			} else if (randomNums[1] == -1) {
				randomNums[1] = randomNum;
			} else if (randomNums[2] == -1) {
				randomNums[2] = randomNum;
			} else if (randomNums[3] == -1) {
				randomNums[3] = randomNum;
			}
		}
		for (var i = 0; i < 4; i++) {
			(options[i]).innerHTML = $scope.cards[randomNums[i]]["short_desc"];
		}
		var answer = $scope.cards[quest_ctr]["short_desc"];
		$scope.waitForClicks(answer);

	};

	$scope.waitForClicks = function (answer) {
		for (var i = 0; i < 4; i++) {
			options[i].addEventListener("click", function () {
				if (this.innerHTML == answer && quest_ctr == $scope.cards.length - 1) {
					$scope.done();
				} else if (this.innerHTML == answer) {
					$scope.correctAnswer();
					$scope.score += 1;
				}
				else if (this.innerHTML != answer) {
						$scope.score -= 1;
						$scope.wrongAnswer();
				}
			});
		}
	};

	$scope.done = function () {
		$ionicPopup.show({
			title: "You finished the quiz!",
			template: '<div>Your final score is</div>' + $scope.score,
			buttons: [
				{
					text: 'Done',
					type: 'button-assertive'
				}]
		});
	}
});