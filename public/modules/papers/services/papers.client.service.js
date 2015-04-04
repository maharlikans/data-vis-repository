'use strict';

//Papers service used to communicate Papers REST endpoints
angular.module('papers').factory('Papers', ['$resource',
	function($resource) {
		return $resource('papers/:paperId', { paperId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);