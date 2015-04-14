'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Idea Schema
 */
var IdeaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Idea name',
		trim: true
	},
  description: {
    type: String,
		default: '',
		required: 'Please fill Idea description',
		trim: true
  },
  technologies: [{
    type: String,
		default: '',
  }],
  tags: [{
    type: String,
		default: '',
  }],
  type: {
    type: String,
		default: 'idea',
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

mongoose.model('Idea', IdeaSchema);
