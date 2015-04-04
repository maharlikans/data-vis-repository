'use strict';

//Setting up route
angular.module('papers').config(['$stateProvider',
	function($stateProvider) {
		// Papers state routing
		$stateProvider.
		state('listPapers', {
			url: '/papers',
			templateUrl: 'modules/papers/views/list-papers.client.view.html'
		}).
		state('createPaper', {
			url: '/papers/create',
			templateUrl: 'modules/papers/views/create-paper.client.view.html'
		}).
		state('viewPaper', {
			url: '/papers/:paperId',
			templateUrl: 'modules/papers/views/view-paper.client.view.html'
		}).
		state('editPaper', {
			url: '/papers/:paperId/edit',
			templateUrl: 'modules/papers/views/edit-paper.client.view.html'
		});
	}
]);