'use strict';

// Papers controller
angular.module('papers').controller('PapersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Papers', '$modal', '$log', 
	function($scope, $stateParams, $location, Authentication, Papers, $modal, $log) {
		this.authentication = Authentication;

    // Open a modal window to delete a paper
    this.modalDelete = function (size, ctrl, selectedPaper) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/papers/views/delete-paper-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.paper = selectedPaper;

          $scope.deletePaper = function () {
            ctrl.remove($scope.paper);
            $modalInstance.close($scope.paper);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size,
        scope: $scope,
        resolve: {
          paper: function () {
            return $scope.selectedPaper;
          }
        }
      });

      modalInstance.result.then(function (selectedPaper) {
        $scope.selected = selectedPaper;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };
    
    // Open a modal window to update a paper
    this.modalUpdate = function (size, ctrl, selectedPaper) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/papers/views/update-paper-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.paper = selectedPaper;

          $scope.updatePaper = function() {
            ctrl.update($scope.paper);
            if (!$scope.error) {
              $modalInstance.close($scope.paper);
            }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size,
        scope: $scope,
        resolve: {
          paper: function () {
            return $scope.selectedPaper;
          }
        }
      });

      modalInstance.result.then(function (selectedPaper) {
        $scope.selected = selectedPaper;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

		// Create new Paper
		this.create = function() {
			// Create new Paper object
			var paper = new Papers ({
				name: this.name,
        authors: this.authors,
        url: this.url,
        publication_date: this.publication_date,
        collect: this.collect,
        doi: this.doi, 
        tags: this.tags
			});

			// Redirect after save
			paper.$save(function(response) {
				$location.path('papers');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Paper
		this.remove = function(paper) {
			if ( paper ) { 
				paper.$remove();

				for (var i in this.papers) {
					if (this.papers [i] === paper) {
						this.papers.splice(i, 1);
					}
				}
			} else {
				this.paper.$remove(function() {
					$location.path('papers');
				});
			}
		};

		// Update existing Paper
		this.update = function(paper) {
			paper.$update(function() {
				$location.path('papers');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Papers
		this.find = function() {
			this.papers = Papers.query();
		};

		// Find existing Paper
		this.findOne = function() {
			this.paper = Papers.get({ 
				paperId: $stateParams.paperId
			});
		};
	}
]);
