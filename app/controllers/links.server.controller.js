'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Link = mongoose.model('Link'),
	_ = require('lodash');

/**
 * Create a Link
 */
exports.create = function(req, res) {
	var link = new Link(req.body);
	link.user = req.user;

	link.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(link);
		}
	});
};

/**
 * Show the current Link
 */
exports.read = function(req, res) {
	res.jsonp(req.link);
};

/**
 * Update a Link
 */
exports.update = function(req, res) {
	var link = req.link ;

	link = _.extend(link , req.body);

	link.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(link);
		}
	});
};

/**
 * Delete an Link
 */
exports.delete = function(req, res) {
	var link = req.link ;

	link.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(link);
		}
	});
};

/**
 * List of Links
 */
exports.list = function(req, res) { 
	Link.find().sort('-created').populate('user', 'displayName').exec(function(err, links) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(links);
		}
	});
};

/**
 * Link middleware
 */
exports.linkByID = function(req, res, next, id) { 
	Link.findById(id).populate('user', 'displayName').exec(function(err, link) {
		if (err) return next(err);
		if (! link) return next(new Error('Failed to load Link ' + id));
		req.link = link ;
		next();
	});
};

/**
 * Link authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.link.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
