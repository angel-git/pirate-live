(function() {
  angular.module('myApp', ['ui.router', 'contact']).run([
    '$rootScope', '$state', function($rootScope, $state) {
      return $rootScope.$state = $state;
    }
  ]).config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state('contact', {
      url: "/contact",
      templateUrl: "view/contact.html",
      controller: 'ContactController'
    });
    $stateProvider.state('admin', {
      url: "/admin",
      templateUrl: "view/admin.html",
      controller: 'AdminController'
    });
    return $stateProvider.state('home', {
      url: "/",
      templateUrl: "view/home.html"
    });
  });

}).call(this);
