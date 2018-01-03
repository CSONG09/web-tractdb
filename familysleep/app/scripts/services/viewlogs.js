'use strict';

/**
 * @ngdoc service
 * @name FamilySleep.viewLogs
 * @description
 * # viewLogs
 * Factory in the FamilySleep.
 This will keep track of logs across the app
 */

		 /*
				logSession = {
						'pages' : [
								{'page' : '', id : '', date' : },
								{},
						],
						'sessionTimeStamps': [],
						'users' : [],
						'startTime': ,
						'endTime':
				}
				logs = {
						startTime : {
								'users' : [],
								'timeStamp': {
										'startTime': ,
										'endTime':
								}
								'pages' : [
										{'page' : '', id : '', 'date' : },
										{},
								]
						},
						...
				}
				*/

				var module = angular.module(
					'FamilySleep'
					)

				module.factory(
					'viewLogs', 
					['$timeout', '$uibModal', 'personaFactory', '$log', '$rootScope', 'recorderFactory', '$http', 'BASEURL_PYRAMID',
					function ($timeout, $uibModal, personaFactory, $log, $rootScope, recorderFactory, $http, BASEURL_PYRAMID) {
						var factory = {};

						factory.logs = {};
						factory.logSession = null;
						factory.doc_id = 'viewLogs';
						factory.doc_rev = null;
						factory.counter = 1;
//could keep track of the ids that have been selected before

		// factory.prompts = [
		//     {
		//         id: '1',
		//         text: "What did you learn about your sleep habits from the system?"
		//     },
		//     {
		//         id: '2',
		//         text: "Look at another family member's sleep. What did you learn about their sleep?"
		//     },
		//     {
		//         id: '3',
		//         text: "Look at your sleep and mood for this week. How is your mood with respect to your sleep?"
		//     },
		//     {
		//         id: '4',
		//         text: "Two family members required.Look at family weekly sleep together, pick a day. Tell us what you learn from each other's sleep"
		//     },
		//     {
		//         id: '5',
		//         text: "Look at your sleep and mood for this week. How is your mood with respect to your sleep?"
		//     },
		//     {
		//         id: '6',
		//         text: "One parent and one child required. Look at today's sleep and mood. Talk to each other about your sleep and mood."
		//     },
		//     {
		//         id: '7',
		//         text: "Children Required. What have you learned about your sleep?"
		//     },
		//     {
		//         id: '8',
		//         text: "Children Required. What have you learned your family's sleep?"
		//     },
		//     {
		//         id: '9',
		//         text: "At one parent and one child required. Think about how you viewed your sleep and mood before using [system]. What have you learned about each other?"
		//     },
		//     {
		//         id: '10',
		//         text: "At one parent and one child required. What have you learned about each other since using [the system]?"
		//     }
		// ];


		factory.logLastPage = function (currentTime) {
			if(factory.logSession != null && factory.logSession.sessionTimeStamps[factory.logSession.pages.length-1] == currentTime) {	  
				factory.logs[factory.logSession.startTime] = {
					'users' : factory.logSession.users,
					'timeStamp': {
						'startTime': factory.logSession.startTime,
						'endTime': currentTime
					},
					'pages' : factory.logSession.pages
				}
				factory.putData();
				//sending audio data when user forget to stop recording.
				if($rootScope.recordRecording || $rootScope.recordPausing) {
					$rootScope.onStopRecord();
				} 

				factory.logSession = null;
			}
		}

		factory.putData = function(){
			var new_doc = {
				"_id" : "viewLogs" + factory.counter.toString(),
				"viewLogs": factory.logs
			};
			var date_format = moment(factory.logSession.startTime).format('YYYY_MM_DD_kk_mm');
			
			// BASEURL_PYRAMID + '/document/viewLogs'
			$http(
			{
				method: 'PUT',
				url: BASEURL_PYRAMID + '/document/viewLogs' + date_format,
				data: new_doc
			}
			).then (function success (response){
				//factory.doc_id = "viewLogs" + factory.counter.toString();
				factory.counter++;
				//factory.doc_rev = response.data._rev;
			}).catch (function error (response){
				console.log("error in PUT");
				console.log(response.status);
				//if error schedule next put?
			});
		}

		/*
			if logSession is null: (start session)
					initialize logSession = {};
					logSession.startTime = date;
					logSession.pages.add({page, date})
	
			else 

			start x min timer, once times up:
					check with session to see if date == logSession.page.last.date
					if different, means user clicked after this, we don't do anything
					if same, means user haven't clicked for 2 mins. we treat it as the last click"  
							save last click,
							save the whole thing to logs.
							*/

		// id=null

		factory.logPage = function (page, date, id) { 
			if (typeof(id)==='undefined') id = null;
			var currentTime = new Date();

			if (factory.logSession == null) {
				factory.logSession = {
					'pages': [],
					'sessionTimeStamps': [],
					'users' : [],
					'startTime': null,
					'endTime': null
				};
				factory.logSession.startTime = currentTime;  
				$timeout(factory.popup, 5 * 1000); 
			}
			factory.logSession.pages.push({'page': page, 'id' : id, 'date': date});
			factory.logSession.sessionTimeStamps.push(currentTime);
			$timeout(factory.logLastPage, 3 * 10000, true, currentTime); //changed to 30 seconds wait before logging interaction
		}

		factory.popup = function() {
			factory.famMems = personaFactory.getAllNames();
			factory.famIDs = personaFactory.getAllIDs();
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'app/views/templates/logmodalcontent.html',
				backdrop: 'static',
				keyboard: false,
				controller: 'LogModalInstanceCtrl',
				controllerAs: '$ctrl',
				windowClass:'app-modal-window',
				resolve: {
					famMems: function() {
						return factory.famMems;
					},
					famID: function(){
						return '';
					}
				}
			});
			modalInstance.result.then(function (selectedItems) {
				/***** BUG///PROBLEM HERE factory.logSession in logLastPage
				gets set to null even if the popup have not been replied
				NEED TO FIGURE OUT WHAT HAPPENS HERE****/
				/* peoblem about be fixed */
				if (factory.logSession == null) {
					var currentTime = new Date();
					factory.logSession = {
						'pages': [],
						'sessionTimeStamps': [],
						'users' : [],
						'startTime': null,
						'endTime': null
					};
					factory.logSession.startTime = currentTime;  
					factory.logSession.sessionTimeStamps.push(currentTime);
					$timeout(factory.logLastPage, 3 * 10000, true, currentTime);
				}
				 //changed to 30 seconds wait before logging interaction
				 factory.logSession.users = selectedItems.users;
				 recorderFactory.users = selectedItems.users;
				 recorderFactory.prompt = selectedItems.prompt;
				 recorderFactory.promptId = selectedItems.promptId;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
		}

		return factory;
	}]);


angular.module('FamilySleep').controller('LogModalInstanceCtrl', function ($uibModalInstance, $scope, famMems, famID) {
	var $ctrl = this;
	$ctrl.famMems = famMems;
	$ctrl.buttonState = false;
	$ctrl.page = 1;

	$ctrl.record = false;
	var prompts = [
	"What did you learn about your sleep habits from the system?",
	"Look at another family member's sleep. What did you learn about their sleep?",
	"Look at your sleep and mood for this week. How is your mood with respect to your sleep?",
	"Two family members required.Look at family weekly sleep together, pick a day. Tell us what you learn from each other's sleep",
	"Look at your sleep and mood for this week. How is your mood with respect to your sleep?",
	"One parent and one child required. Look at today's sleep and mood. Talk to each other about your sleep and mood.",
	"Recommended child to participate. What have you learned about your sleep?",
	"Recommended child to participate. What have you learned your family's sleep?",
	"Recommended for one parent and one child. Think about how you viewed your sleep and mood before using DreamCatcher. What have you learned about each other?",
	"Recommended for one parent and one child. What have you learned about each other since using DreamCatcher?"
	];

	var getRandomInteger = function(){
		return Math.floor(Math.random() * prompts.length);
	};

	$ctrl.promptId = getRandomInteger();
	$ctrl.prompt = prompts[$ctrl.promptId];

	$ctrl.incrPage = function() {
		$ctrl.page++;
	}

	$ctrl.decrPage = function() {
		$ctrl.page--;
	}

  // for checkbox buttons in logmodal instance
  $ctrl.checkFam = [];
  for (var i = 0; i < $ctrl.famMems.length; i++) {
	$ctrl.checkFam[i] = ({name: $ctrl.famMems[i], checked : false});
  }

  // checks that at least one button is clicked in logmodal to activate OK button
  $ctrl.isOK = function () {
	for (var i = 0; i < $ctrl.checkFam.length; i++) {
		if ($ctrl.checkFam[i].checked === true) {
			$ctrl.buttonState = true;
			break;
		} else {
			$ctrl.buttonState = false;
		}
	}
  };

  $ctrl.ok = function () {
	var selectedNames = [];
	for (var i = 0; i < $ctrl.checkFam.length; i++) {
		if ($ctrl.checkFam[i].checked === true) {
			selectedNames.push($ctrl.checkFam[i].name)
		}
	}
	$uibModalInstance.close({users: selectedNames, promptId: $ctrl.promptId, prompt: $ctrl.prompt});
	if ($ctrl.record) {
		$scope.onRecord();
		$scope.$parent.recordStoppedClear = false;
		$scope.$parent.recordRecording = true;
	}
  };

  $ctrl.cancel = function () {
	$uibModalInstance.dismiss('cancel');
  };
});


angular.module('FamilySleep').directive('carouselControls', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$timeout(function() {
				var carouselScope = element.isolateScope();

				scope.goNext = function() {
					carouselScope.next();
				};
				scope.goPrev = function() {
					carouselScope.prev();
				};
			});
		}
	};       
}]
);
