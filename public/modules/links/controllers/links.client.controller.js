'use strict';

// Links controller
angular.module('links').controller('LinksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Links', '$modal', '$log', 
	function($scope, $stateParams, $location, Authentication, Links, $modal, $log) {
		this.authentication = Authentication;

    // Open a modal window to delete a link
    this.modalDelete = function (size, ctrl, selectedLink) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/links/views/delete-link-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.link = selectedLink;

          $scope.deleteLink = function () {
            ctrl.remove($scope.link);
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
    this.modalUpdate = function (size, ctrl, selectedLink) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/links/views/update-link-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.link = selectedLink;

          $scope.updateLink = function() {
            ctrl.update($scope.link);
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
		this.create = function() {
			// Create new Link object
			var link = new Links ({
				name: this.name,
        url: this.url,
        description: this.description,
        img: this.img,
        tags: this.tags
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
		this.remove = function(link) {
			if ( link ) { 
				link.$remove();

				for (var i in this.links) {
					if (this.links [i] === link) {
						this.links.splice(i, 1);
					}
				}
			} else {
				this.link.$remove(function() {
					$location.path('links');
				});
			}
		};

		// Update existing Link
		this.update = function(link) {

			link.$update(function() {
				$location.path('links');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Links
		this.find = function() {
			this.links = Links.query();
		};

		// Find existing Link
		this.findOne = function() {
			this.link = Links.get({ 
				linkId: $stateParams.linkId
			});
		};
	}
]);
