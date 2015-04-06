'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Video Schema
 */
var VideoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Video name',
		trim: true
	},
  url: {
		type: String,
		default: '',
		required: 'Please fill Video url',
		trim: true
	},
  embed: {
		type: String,
		default: '',
		required: 'Please fill Video embed',
		trim: true
	},
  description: {
		type: String,
		default: '',
		required: 'Please fill Video description',
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

mongoose.model('Video', VideoSchema);
