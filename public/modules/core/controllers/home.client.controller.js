'use strict';


angular.module('core').controller('HomeController', ['$scope', '$stateParams', '$location','Authentication', 'Links', 'Papers', 'Videos', '$modal', '$log', '$controller', 
	function($scope, $stateParams, $location, Authentication, Links, Papers, Videos, $modal, $log, $controller) {
		// This provides Authentication context.
		this.authentication = Authentication;
    $scope.items = [];

    this.linksCtrl = $controller('LinksController', {$scope : $scope});
    this.papersCtrl = $controller('PapersController', {$scope : $scope});
    this.videosCtrl = $controller('VideosController', {$scope : $scope});

    // Open a modal window to delete a link
    this.modalDelete = function (size, ctrl, selectedItem) {

      var modalInstance = null;

      switch(selectedItem.type) {
        case 'link':
          modalInstance = ctrl.linksCtrl.modalDelete(size, linksCtrl, selectedItem);
          break;
        case 'paper':
          modalInstance = ctrl.papersCtrl.modalDelete(size, linksCtrl, selectedItem);
          break;
        case 'video':
          modalInstance = ctrl.videosCtrl.modalDelete(size, videosCtrl, selectedItem);
          break;
        default:
          break;
      }

    };
    
    // Open a modal window to update a link
    $scope.modalUpdate = function (size, selectedItem) {

      switch(selectedItem.type) {
        case 'link':
          ctrl.linksCtrl.modalUpdate(size, linksCtrl, selectedItem);
          break;
        case 'paper':
          ctrl.papersCtrl.modalUpdate(size, linksCtrl, selectedItem);
          break;
        case 'video':
          ctrl.videosCtrl.modalUpdate(size, videosCtrl, selectedItem);
          break;
        default:
          break;
      }

    };

		this.find = function() {
      this.populate = function(elements) {
        var items = [];
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
