'use strict';


angular.module('core').controller('HomeController', ['$scope', '$stateParams', '$location','Authentication', 'Links', 'Papers', 'Videos', '$modal', '$log', '$controller', 
	function($scope, $stateParams, $location, Authentication, Links, Papers, Videos, $modal, $log, $controller) {
		// This provides Authentication context.
		this.authentication = Authentication;
    this.items = [];

    this.linksCtrl = $controller('LinksController', {$scope : $scope});
    this.papersCtrl = $controller('PapersController', {$scope : $scope});
    this.videosCtrl = $controller('VideosController', {$scope : $scope});

    // Open a modal window to delete an item
    this.modalDelete = function (size, ctrl, selectedItem) {

      var modalInstance = null;

      switch(selectedItem.type) {
        case 'link':
          modalInstance = $modal.open({
            templateUrl: 'modules/links/views/delete-link-confirmation.client.view.html',
            controller: function ($scope, $modalInstance) {
              $scope.link = selectedItem;

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
              item: function () {
                return $scope.selectedItem;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
          break;
        case 'paper':
          modalInstance = $modal.open({
            templateUrl: 'modules/papers/views/delete-paper-confirmation.client.view.html',
            controller: function ($scope, $modalInstance) {
              $scope.paper = selectedItem;

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
              item: function () {
                return $scope.selectedItem;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
          break;
        case 'video':
          modalInstance = $modal.open({
            templateUrl: 'modules/videos/views/delete-video-confirmation.client.view.html',
            controller: function ($scope, $modalInstance) {
              $scope.video = selectedItem;

              $scope.deleteVideo = function () {
                ctrl.remove($scope.video);
                $modalInstance.close($scope.video);
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            },
            size: size,
            scope: $scope,
            resolve: {
              item: function () {
                return $scope.selectedItem;
              }
            }
          });
          break;
        default:
          break;
      }

    };
    
    // Open a modal window to update an item
    this.modalUpdate = function (size, ctrl, selectedItem) {

      var modalInstance = null;

      switch(selectedItem.type) {
        case 'link':
          modalInstance = $modal.open({
            templateUrl: 'modules/links/views/update-link-confirmation.client.view.html',
            controller: function ($scope, $modalInstance) {
              $scope.link = selectedItem;

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
                return $scope.selectedItem;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
          break;
        case 'paper':
          modalInstance = $modal.open({
            templateUrl: 'modules/papers/views/update-paper-confirmation.client.view.html',
            controller: function ($scope, $modalInstance) {
              $scope.paper = selectedItem;

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
                return $scope.selectedItem;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
          break;
        case 'video':
          modalInstance = $modal.open({
            templateUrl: 'modules/videos/views/update-video-confirmation.client.view.html',
            controller: function ($scope, $modalInstance) {
              $scope.video = selectedItem;

              $scope.updateVideo = function() {
                ctrl.update($scope.video);
                if (!$scope.error) {
                  $modalInstance.close($scope.video);
                }
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            },
            size: size,
            scope: $scope,
            resolve: {
              video: function () {
                return $scope.selectedItem;
              }
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
          break;
        default:
          break;
      }

    };

    // Remove existing Item
		this.remove = function(item) {
			if ( item ) { 
				item.$remove();

				for (var i in this.items) {
					if (this.items [i] === item) {
						this.items.splice(i, 1);
					}
				}
			} else {
				this.item.$remove(function() {
					$location.path('/');
				});
			}
		};

		// Update existing Item
		this.update = function(item) {

			item.$update(function() {
				$location.path('/');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		this.find = function(items) {
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
