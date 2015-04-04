'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var papers = require('../../app/controllers/papers.server.controller');

	// Papers Routes
	app.route('/papers')
		.get(papers.list)
		.post(users.requiresLogin, papers.create);

	app.route('/papers/:paperId')
		.get(papers.read)
		.put(users.requiresLogin, papers.hasAuthorization, papers.update)
		.delete(users.requiresLogin, papers.hasAuthorization, papers.delete);

	// Finish by binding the Paper middleware
	app.param('paperId', papers.paperByID);
};
