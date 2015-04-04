'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Paper = mongoose.model('Paper'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, paper;

/**
 * Paper routes tests
 */
describe('Paper CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Paper
		user.save(function() {
			paper = {
				name: 'Paper Name'
			};

			done();
		});
	});

	it('should be able to save Paper instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Paper
				agent.post('/papers')
					.send(paper)
					.expect(200)
					.end(function(paperSaveErr, paperSaveRes) {
						// Handle Paper save error
						if (paperSaveErr) done(paperSaveErr);

						// Get a list of Papers
						agent.get('/papers')
							.end(function(papersGetErr, papersGetRes) {
								// Handle Paper save error
								if (papersGetErr) done(papersGetErr);

								// Get Papers list
								var papers = papersGetRes.body;

								// Set assertions
								(papers[0].user._id).should.equal(userId);
								(papers[0].name).should.match('Paper Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Paper instance if not logged in', function(done) {
		agent.post('/papers')
			.send(paper)
			.expect(401)
			.end(function(paperSaveErr, paperSaveRes) {
				// Call the assertion callback
				done(paperSaveErr);
			});
	});

	it('should not be able to save Paper instance if no name is provided', function(done) {
		// Invalidate name field
		paper.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Paper
				agent.post('/papers')
					.send(paper)
					.expect(400)
					.end(function(paperSaveErr, paperSaveRes) {
						// Set message assertion
						(paperSaveRes.body.message).should.match('Please fill Paper name');
						
						// Handle Paper save error
						done(paperSaveErr);
					});
			});
	});

	it('should be able to update Paper instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Paper
				agent.post('/papers')
					.send(paper)
					.expect(200)
					.end(function(paperSaveErr, paperSaveRes) {
						// Handle Paper save error
						if (paperSaveErr) done(paperSaveErr);

						// Update Paper name
						paper.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Paper
						agent.put('/papers/' + paperSaveRes.body._id)
							.send(paper)
							.expect(200)
							.end(function(paperUpdateErr, paperUpdateRes) {
								// Handle Paper update error
								if (paperUpdateErr) done(paperUpdateErr);

								// Set assertions
								(paperUpdateRes.body._id).should.equal(paperSaveRes.body._id);
								(paperUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Papers if not signed in', function(done) {
		// Create new Paper model instance
		var paperObj = new Paper(paper);

		// Save the Paper
		paperObj.save(function() {
			// Request Papers
			request(app).get('/papers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Paper if not signed in', function(done) {
		// Create new Paper model instance
		var paperObj = new Paper(paper);

		// Save the Paper
		paperObj.save(function() {
			request(app).get('/papers/' + paperObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', paper.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Paper instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Paper
				agent.post('/papers')
					.send(paper)
					.expect(200)
					.end(function(paperSaveErr, paperSaveRes) {
						// Handle Paper save error
						if (paperSaveErr) done(paperSaveErr);

						// Delete existing Paper
						agent.delete('/papers/' + paperSaveRes.body._id)
							.send(paper)
							.expect(200)
							.end(function(paperDeleteErr, paperDeleteRes) {
								// Handle Paper error error
								if (paperDeleteErr) done(paperDeleteErr);

								// Set assertions
								(paperDeleteRes.body._id).should.equal(paperSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Paper instance if not signed in', function(done) {
		// Set Paper user 
		paper.user = user;

		// Create new Paper model instance
		var paperObj = new Paper(paper);

		// Save the Paper
		paperObj.save(function() {
			// Try deleting Paper
			request(app).delete('/papers/' + paperObj._id)
			.expect(401)
			.end(function(paperDeleteErr, paperDeleteRes) {
				// Set message assertion
				(paperDeleteRes.body.message).should.match('User is not logged in');

				// Handle Paper error error
				done(paperDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Paper.remove().exec();
		done();
	});
});