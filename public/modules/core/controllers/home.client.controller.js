'use strict';


angular.module('core').controller('HomeController', ['$scope', '$stateParams', '$location','Authentication', 'Links', 'Papers', 'Videos', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Links, Papers, Videos, $modal, $log) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.items = [];

		$scope.find = function(items) {
      var populate = function(elements) {
        for(var i = 0; i < elements.length; i++) {
          items.push(elements[i]);
        }
      };

      var links = Links.query(populate);
      var papers = Papers.query(populate);
      var videos = Videos.query(populate);
		};
	}
]);
