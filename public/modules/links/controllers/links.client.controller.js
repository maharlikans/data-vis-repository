'use strict';

// Links controller
angular.module('links').controller('LinksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Links', '$modal', '$log', 
	function($scope, $stateParams, $location, Authentication, Links, $modal, $log) {
		$scope.authentication = Authentication;

    // Open a modal window to delete a link
    $scope.modalDelete = function (size, selectedLink) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/links/views/delete-link-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.link = selectedLink;

          $scope.deleteLink = function () {
            $scope.remove($scope.link);
            $modalInstance.close($scope.link);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size,
        scope: $scope,
        resolve: {
          link: function () {
            return $scope.selectedLink;
          }
        }
      });

      modalInstance.result.then(function (selectedLink) {
        $scope.selected = selectedLink;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };
    
    // Open a modal window to update a link
    $scope.modalUpdate = function (size, selectedLink) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/links/views/update-link-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.link = selectedLink;

          $scope.updateLink = function() {
            $scope.update($scope.link);
            if (!$scope.error) {
              $modalInstance.close($scope.link);
            }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size,
        scope: $scope,
        resolve: {
          link: function () {
            return $scope.selectedLink;
          }
        }
      });

      modalInstance.result.then(function (selectedLink) {
        $scope.selected = selectedLink;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

		// Create new Link
		$scope.create = function() {
			// Create new Link object
			var link = new Links ({
				name: this.name,
        url: this.url,
        description: this.description,
        img: this.img
			});

			// Redirect after save
			link.$save(function(response) {
				$location.path('links');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Link
		$scope.remove = function(link) {
			if ( link ) { 
				link.$remove();

				for (var i in $scope.links) {
					if ($scope.links [i] === link) {
						$scope.links.splice(i, 1);
					}
				}
			} else {
				$scope.link.$remove(function() {
					$location.path('links');
				});
			}
		};

		// Update existing Link
		$scope.update = function(link) {

			link.$update(function() {
				$location.path('links');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Links
		$scope.find = function() {
			$scope.links = Links.query();
		};

		// Find existing Link
		$scope.findOne = function() {
			$scope.link = Links.get({ 
				linkId: $stateParams.linkId
			});
		};
	}
]);
