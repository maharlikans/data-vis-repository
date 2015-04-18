'use strict';


angular.module('core').controller('HomeController', ['$scope', '$stateParams', '$location','Authentication', 'Links', 'Papers', 'Videos', '$modal', '$log', 'LinksController', 
	function($scope, $stateParams, $location, Authentication, Links, Papers, Videos, $modal, $log, $controller) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    $scope.items = [];

    // Open a modal window to delete a link
    $scope.modalDelete = function (size, selectedItem) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/links/views/delete-link-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.link = selectedItem;

          $scope.deleteItem = function () {
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
            return $scope.selectedItem;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };
    
    // Open a modal window to update a link
    $scope.modalUpdate = function (size, selectedItem) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/links/views/update-link-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.link = selectedItem;

          $scope.updateItem = function() {
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
            return $scope.selectedItem;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

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
