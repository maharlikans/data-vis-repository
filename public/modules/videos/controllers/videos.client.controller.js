'use strict';

// Videos controller
angular.module('videos').controller('VideosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Videos', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Videos, $modal, $log) {
		$scope.authentication = Authentication;

    // Open a modal window to delete a video
    this.modalDelete = function (size, selectedVideo) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/videos/views/delete-video-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.video = selectedVideo;

          $scope.deleteVideo = function () {
            $scope.remove($scope.video);
            $modalInstance.close($scope.video);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size,
        scope: $scope,
        resolve: {
          video: function () {
            return $scope.selectedVideo;
          }
        }
      });

      modalInstance.result.then(function (selectedVideo) {
        $scope.selected = selectedVideo;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };
    
    // Open a modal window to update a video
    this.modalUpdate = function (size, selectedVideo) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/videos/views/update-video-confirmation.client.view.html',
        controller: function ($scope, $modalInstance) {
          $scope.video = selectedVideo;

          $scope.updateVideo = function() {
            $scope.update($scope.video);
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
            return $scope.selectedVideo;
          }
        }
      });

      modalInstance.result.then(function (selectedVideo) {
        $scope.selected = selectedVideo;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });

    };

		// Create new Video
		this.create = function() {
			// Create new Video object
			var video = new Videos ({
				name: this.name,
        url: this.url,
        embed: this.embed,
        description: this.description,
        tags: this.tags
			});

			// Redirect after save
			video.$save(function(response) {
				$location.path('videos');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Video
    this.remove = function(video) {
			if ( video ) { 
				video.$remove();

				for (var i in this.videos) {
					if (this.videos [i] === video) {
						this.videos.splice(i, 1);
					}
				}
			} else {
				this.video.$remove(function() {
					$location.path('videos');
				});
			}
		};

		// Update existing Video
		this.update = function(video) {
			video.$update(function() {
				$location.path('videos');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Videos
		this.find = function() {
			this.videos = Videos.query();
		};

		// Find existing Video
		this.findOne = function() {
			this.video = Videos.get({ 
				videoId: $stateParams.videoId
			});
		};
	}
])
.filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
}]);
