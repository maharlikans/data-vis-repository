'use strict';

// Papers controller
angular.module('papers').controller('PapersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Papers',
	function($scope, $stateParams, $location, Authentication, Papers) {
		$scope.authentication = Authentication;

		// Create new Paper
		$scope.create = function() {
			// Create new Paper object
			var paper = new Papers ({
				name: this.name
			});

			// Redirect after save
			paper.$save(function(response) {
				$location.path('papers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Paper
		$scope.remove = function(paper) {
			if ( paper ) { 
				paper.$remove();

				for (var i in $scope.papers) {
					if ($scope.papers [i] === paper) {
						$scope.papers.splice(i, 1);
					}
				}
			} else {
				$scope.paper.$remove(function() {
					$location.path('papers');
				});
			}
		};

		// Update existing Paper
		$scope.update = function() {
			var paper = $scope.paper;

			paper.$update(function() {
				$location.path('papers/' + paper._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Papers
		$scope.find = function() {
			$scope.papers = Papers.query();
		};

		// Find existing Paper
		$scope.findOne = function() {
			$scope.paper = Papers.get({ 
				paperId: $stateParams.paperId
			});
		};
	}
]);