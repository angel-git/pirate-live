angular.module('myApp', ['ui.router','contact'])
.run (['$rootScope', '$state', ($rootScope, $state) ->
  $rootScope.$state = $state;
])
.config ($stateProvider, $urlRouterProvider) ->
  #For any unmatched url, redirect to /home
  $urlRouterProvider.otherwise("/");

  $stateProvider.state 'contact',
    url: "/contact",
    templateUrl: "view/contact.html",
    controller: 'ContactController'
  $stateProvider.state 'admin',
    url: "/admin",
    templateUrl: "view/admin.html",
    controller: 'AdminController'
  $stateProvider.state 'home',
    url: "/",
    templateUrl: "view/home.html"
