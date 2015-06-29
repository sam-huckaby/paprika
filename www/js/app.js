// angular.module is a global place for creating, registering and retrieving Angular modules
// 'paprika' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'paprika.services' is found in services.js
// 'paprika.controllers' is found in controllers.js
angular.module('paprika', ['ionic', 'paprika.controllers', 'paprika.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('paprika', {
    url: "/paprika",
    abstract: true,
    templateUrl: "templates/paprika.html"
  })

  // Each tab has its own nav history stack:

  .state('paprika.lists', {
    url: '/lists',
    views: {
      'paprika-lists': {
        templateUrl: 'templates/paprika-lists.html',
        controller: 'ListsPageCtrl'
      }
    }
  })

  .state('paprika.lists.edit', {
    url: '/edit',
    views: {
        'paprika-lists@paprika': {
          controller: "editListCtrl",
          templateUrl: "templates/paprika-edit.html"
        }
      },
    params: {
      list: null
    }
  })

  .state('paprika.lists.view', {
    url: '/view',
    views: {
        'paprika-lists@paprika': {
          controller: "viewListCtrl",
          templateUrl: "templates/paprika-view.html"
        }
      },
    params: {
      list: null
    }
  })

  .state('paprika.stats', {
    url: '/stats',
    views: {
      'paprika-stats': {
        templateUrl: 'templates/paprika-stats.html',
        controller: 'StatsPageCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/paprika/lists');

});
