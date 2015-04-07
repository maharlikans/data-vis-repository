'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Paper Schema
 */
var PaperSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Paper name',
		trim: true
	},
  authors: {
		type: String,
		default: '',
		required: 'Please fill Paper authors (at least one)',
		trim: true
	},
  url: {
		type: String,
		default: '',
		required: 'Please fill Paper url',
		trim: true
	},
  publication_date: {
		type: Date,
		default: '',
		required: 'Please fill Paper publication date (year only)',
		trim: true
	},
  collect: {
		type: String,
		default: '',
		trim: true
	},
  doi: {
		type: String,
		default: '',
		trim: true
	},
  tags: [{
    type: String,
		default: '',
  }],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Paper', PaperSchema);
