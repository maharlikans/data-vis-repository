'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Link Schema
 */
var LinkSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Link name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Link', LinkSchema);