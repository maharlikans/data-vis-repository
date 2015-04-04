'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Paper = mongoose.model('Paper'),
	_ = require('lodash');

/**
 * Create a Paper
 */
exports.create = function(req, res) {
	var paper = new Paper(req.body);
	paper.user = req.user;

	paper.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(paper);
		}
	});
};

/**
 * Show the current Paper
 */
exports.read = function(req, res) {
	res.jsonp(req.paper);
};

/**
 * Update a Paper
 */
exports.update = function(req, res) {
	var paper = req.paper ;

	paper = _.extend(paper , req.body);

	paper.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(paper);
		}
	});
};

/**
 * Delete an Paper
 */
exports.delete = function(req, res) {
	var paper = req.paper ;

	paper.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(paper);
		}
	});
};

/**
 * List of Papers
 */
exports.list = function(req, res) { 
	Paper.find().sort('-created').populate('user', 'displayName').exec(function(err, papers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(papers);
		}
	});
};

/**
 * Paper middleware
 */
exports.paperByID = function(req, res, next, id) { 
	Paper.findById(id).populate('user', 'displayName').exec(function(err, paper) {
		if (err) return next(err);
		if (! paper) return next(new Error('Failed to load Paper ' + id));
		req.paper = paper ;
		next();
	});
};

/**
 * Paper authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.paper.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
