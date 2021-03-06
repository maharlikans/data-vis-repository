'use strict';

// Configuring the Articles module
angular.module('links').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Links', 'links', 'dropdown', '/links(/create)?');
		Menus.addSubMenuItem('topbar', 'links', 'List Links', 'links');
		Menus.addSubMenuItem('topbar', 'links', 'New Link', 'links/create');
	}
]);