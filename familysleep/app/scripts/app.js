'use strict';

angular
    .module('FamilySleep', [
        'angular-toArrayFilter',
        'chart.js',
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMaterial',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'tractdb.config'
    ])
    .config(function ($routeProvider, $locationProvider) {
        //can't get the removing hash to work
        //$locationProvider.html5Mode(true); //escaping hashtags all over the place
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/familydailyview.html',
                controller: 'FamilyDailyViewCtrl',
                controllerAs: 'viewModel'
            })
            .when('/about', {
                templateUrl: 'app/views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/signup', {
                templateUrl: 'app/views/signup.html',
                controller: 'SignupCtrl'
            })
            .when('/familydailyview', {
                templateUrl: 'app/views/familydailyview.html',
                controller: 'FamilyDailyViewCtrl',
                controllerAs: 'viewModel'
            })
            .when('/sdview/:id', {
                templateUrl: 'app/views/sdview.html',
                controller: 'SdviewCtrl',
                controllerAs: 'viewModel'
            })
            .when('/singleweeklyview/:id', {
                templateUrl: 'app/views/singleweeklyview.html',
                controller: 'SingleweeklyviewCtrl',
                controllerAs: 'viewModel'
            })
            .when('/famweeklyview', {
                templateUrl: 'app/views/famweeklyview.html',
                controller: 'FamweeklyviewCtrl',
                controllerAs: 'viewModel'
            })
            .when('/fambarview', {
                templateUrl: 'app/views/fambarview.html',
                controller: 'FambarviewCtrl'
            })
            .otherwise({ //I want to add an error page when we don't get to the right page
                redirectTo: '/404.html'
            });
    });
