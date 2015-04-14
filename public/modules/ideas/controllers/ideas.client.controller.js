'use strict';

// Ideas controller
angular.module('ideas').controller('IdeasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ideas', '$modal', '$log', 
	function($scope, $stateParams, $location, Authentication, Ideas, $modal, $log) {
		$scope.authentication = Authentication;

    // Open a modal window to delete a idea
    $scope.modalDelete = function (size, selectedIdea) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/ideas/views/delete-idea-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.idea = selectedIdea;

          $scope.deleteIdea = function () {
            $scope.remove($scope.idea);
            $modalInstance.close($scope.idea);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size,
        scope: $scope,
        resolve: {
          idea: function () {
            return $scope.selectedIdea;
          }
        }
      });

      modalInstance.result.then(function (selectedIdea) {
        $scope.selected = selectedIdea;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };
    
    // Open a modal window to update a idea
    $scope.modalUpdate = function (size, selectedIdea) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/ideas/views/update-idea-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.idea = selectedIdea;

          $scope.updateIdea = function() {
            $scope.update($scope.idea);
            if (!$scope.error) {
              $modalInstance.close($scope.idea);
            }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size,
        scope: $scope,
        resolve: {
          idea: function () {
            return $scope.selectedIdea;
          }
        }
      });

      modalInstance.result.then(function (selectedIdea) {
        $scope.selected = selectedIdea;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

		// Create new Idea
		$scope.create = function() {
			// Create new Idea object
			var idea = new Ideas ({
				name: this.name,
        url: this.url,
        description: this.description,
        img: this.img,
        tags: this.tags
			});

			// Redirect after save
			idea.$save(function(response) {
				$location.path('ideas');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Idea
		$scope.remove = function(idea) {
			if ( idea ) { 
				idea.$remove();

				for (var i in $scope.ideas) {
					if ($scope.ideas [i] === idea) {
						$scope.ideas.splice(i, 1);
					}
				}
			} else {
				$scope.idea.$remove(function() {
					$location.path('ideas');
				});
			}
		};

		// Update existing Idea
		$scope.update = function(idea) {

			idea.$update(function() {
				$location.path('ideas');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ideas
		$scope.find = function() {
			$scope.ideas = Ideas.query();
		};

		// Find existing Idea
		$scope.findOne = function() {
			$scope.idea = Ideas.get({ 
				ideaId: $stateParams.ideaId
			});
		};
	}
]);
