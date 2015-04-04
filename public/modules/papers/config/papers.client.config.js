'use strict';

// Configuring the Articles module
angular.module('papers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Papers', 'papers', 'dropdown', '/papers(/create)?');
		Menus.addSubMenuItem('topbar', 'papers', 'List Papers', 'papers');
		Menus.addSubMenuItem('topbar', 'papers', 'New Paper', 'papers/create');
	}
]);