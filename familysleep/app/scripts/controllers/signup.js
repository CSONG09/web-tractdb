'use strict';

angular.module('FamilySleep') // make sure this is set to whatever it is in your client/scripts/app.js
	.controller('SignupCtrl', ['$scope', '$http', '$sanitize', '$location', 'personaFactory', 'selfReportState', 'dateFactory', 'tractdbFactory', 'BASEURL_PYRAMID',
	function ($scope, $http, $sanitize, $location, personaFactory, selfReportState, dateFactory, tractdbFactory, BASEURL_PYRAMID) {
		
		// Here we're creating some local references
		// so that we don't have to type $scope every
		// damn time
		var user,
				signup,
				members;
		var member = {};
		//var singleSelfReportMood = {};
		var count = 1;

		// Here we're creating a scope for our Signup page.
		// This will hold our data and methods for this page.
		$scope.member = member;
		$scope.signup = signup = {};
		$scope.signup.user = user = {};
		$scope.signup.user.members = members = []; //might want to make this an object
		$scope.members = [];
		$scope.isAddMemberForm = true; //change it back to false
		$scope.profilePicItems = [
			{name:'p1',
			path:'app/images/avatars/momcircle.png'},
			{name:'p2',
			path:'app/images//avatars/mo1.png'},
			{name:'p3',
			path:'app/images/avatars/mo2.png'},
			{name:'p4',
			path:'app/images/avatars/mo3.png'},
			{name:'p5',
			path:'app/images/avatars/mo4.png'},
			{name:'p6',
			path:'app/images/avatars/dadcircle.png'},
			{name:'p7',
			path:'app/images/avatars/d1.png'},
			{name:'p8',
			path:'app/images/avatars/d2.png'},
			{name:'p9',
			path:'app/images/avatars/d3.png'},
			{name:'p10',
			path:'app/images/avatars/d4.png'},
			{name:'p11',
			path:'app/images/avatars/girlcircle.png'},
			{name:'p12',
			path:'app/images/avatars/f4.png'},
			{name:'p13',
			path:'app/images/avatars/f2.png'},
			{name:'p14',
			path:'app/images/avatars/f3.png'},
			{name:'p15',
			path:'app/images/avatars/f1.png'},
			{name:'p16',
			path:'app/images/avatars/boycircle.png'},
			{name:'p17',
			path:'app/images/avatars/m1.png'},
			{name:'p18',
			path:'app/images/avatars/m2.png'},
			{name:'p19',
			path:'app/images/avatars/m3.png'},
			{name:'p20',
			path:'app/images/avatars/m5.png'}
		];
		$scope.suggestedSleep;

		$scope.famTypes = ["Father", "Mother", "Daughter", "Son", "Grandfather", "GrandMother", ""];

		// set activePicItem class to profile pictures for styling clicked/active images
		$scope.activeProfilePicMenu = "None";
		$scope.setActivePic = function(profilePicItem) {
			$scope.activeProfilePicMenu = profilePicItem;
		}

		$scope.fitbitDevices = [];
		$http({
			method: 'GET',
			url: BASEURL_PYRAMID + '/document/fitbit_tokens',
			headers: {'Content-Type': 'application/json'},
			data: ''
		}).then(function onSuccess(response) {
			response.data.fitbit_tokens.forEach(function(tokenCurrent) {
				$scope.fitbitDevices.push(tokenCurrent.user_id);
			});
			$scope.fitbitDevices.sort();
		}, function onError(response) {
		});

		// In our signup.html, we'll be using the ng-model
		// attribute to populate this object.

		//todo: I think this goes here:
		//personaFactory.observe($scope, viewModel.updateFamilyInfo);

		//changing Views
		function changeView(){
			var view = '/familydailyview';
			$location.path(view);
		}

		// signup.setTargetHours = function (age){
		// 	//we got targeted hours from the following webpage:
		// 	//https://sleepfoundation.org/press-release/national-sleep-foundation-recommends-new-sleep-times
		// 	//var age = parseInt(a, 10);
		// 	if(age >= 6 || age <= 13){
		// 		return "9 to 11";
		// 	} else if (age >= 14 || age <=17){
		// 		return "8 to 10";
		// 	} else if (age >= 18 || age <= 64){
		// 		return 8;
		// 	} else if (age >= 65){
		// 		return 8;
		// 	} else {
		// 		return 8;
		// 	}
		// }

		$scope.setTargetHours = function (age){
			//we got targeted hours from the following webpage:
			//https://sleepfoundation.org/press-release/national-sleep-foundation-recommends-new-sleep-times
			//var age = parseInt(a, 10);
			if(age >= 6 && age <= 13){

				return "9 to 11";
			} else if (age >= 14 && age <=17){
				return "8 to 10";
			} else if (age >= 18 && age <= 64){
				return "7 to 9";
			} else if (age >= 65){
				return "7 to 9";
			} else {
				return "8";
			}
		}
		signup.addNewMember = function() {
			if (
				!member.name ||
				!member.type ||
				!member.profilePic ||
				!member.age ||
				!member.targetedHours ||
				!member.fitbit
			) {
				alert('Please fill out all form fields.');
				return false;
			} else {
				member.pid = 'm' + count;
				count++;
				//console.log("inadd New Member")
				//console.log(member);

				//adding new family members to the personas in personaFactory
				
				//member.targetedHours = targethours;
				var newMember = angular.copy(member);
				members.push(newMember);
				console.log('in addNewMember printing personas');
				//console.log(personaFactory.personas);
				// if(Object.keys(personaFactory.personas).length == 0){
					
				// }
				if(personaFactory.personas == null){
					personaFactory.personas = {};
					personaFactory.personas[newMember.pid] = newMember;
					console.log("add new members to personas");
					console.log(personaFactory.personas);
				}
				 else {
					personaFactory.personas[newMember.pid] = newMember;	
					console.log("add new members to personas");
					console.log(personaFactory.personas);
				}

				//initializing new family member's mood state
				selfReportState.initializeSingle (newMember.pid);
			}
			
			member.name = "";
			member.type = "";
			member.profilePic = "";
			member.fitbit = "";
			member.pid = "";
			member.age = 0;
			member.targetedHours = 0;
		}

		signup.addFamily = function() {
			if (
				!user.famId ||
				!user.lastname ||
				!user.password1 ||
				!user.password2
			) {
				alert('Please fill out all form fields.');
				return false;
			}

			// make sure the passwords match match
			if (user.password1 !== user.password2) {
				alert('Your passwords must match.');
				return false;
			}
			console.log("Adding FamID :: IN add member")
			console.log(user);
			//DON'T NEED to use localStorage any longer
			/*
			var result = localStorageService.set('FamilyInfo', user);
            if(result) {
              console.log('writing to local storage family Infoworked!-------------------------');
            }*/
			$scope.isAddMemberForm = true;
			//personaFactory.personas = {};
			//personaFactory.retrieveData();
		}

		signup.cancel = function() {
			user.famId = '';
			user.lastname = '';
			user.password1 = '';
			user.password2 = '';
			$scope.isAddMemberForm = false;
			$scope.members = [];
			count = 0;
		}

		signup.cancelFromMember = function(){
			user.famId = '';
			user.lastname = '';
			user.password1 = '';
			user.password2 = '';
			$scope.isAddMemberForm = false;
			$scope.members = [];

			//need to clear factory fields
			personaFactory.personas = {};
			selfReportState.states = null;
			count = 0;
		}

		// This is our method that will post to our server.
		signup.submit = function () {
	
			signup.addNewMember();
			//console.log("testing all personas were added before PUT");

			personaFactory.putData();
			
			// console.log("after the PUT");
			// console.log(personaFactory.personas);

			//console.log('testing selfReportState get');
			selfReportState.putNewData();
			//selfReportState.putData();
            var date = dateFactory.getDateString();
            //test without this below
            tractdbFactory.setQuery('familydaily', null, date);
			changeView();
		};

		//personaFactory.observe($scope, signup.submit);
		
	}]);