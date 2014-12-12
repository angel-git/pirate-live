(function() {
  angular.module('contact', []).controller('ContactController', function($scope) {
    return $scope.contactPerson = {
      person: 'Angel'
    };
  });

}).call(this);
