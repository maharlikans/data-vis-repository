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
  url: {
    type: String,
		default: '',
		required: 'Please fill Link url',
		trim: true
  },
  description: {
    type: String,
		default: '',
		required: 'Please fill Link description',
		trim: true
  },
  img: {
    type: String,
		default: '',
		required: 'Please fill Link url',
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

mongoose.model('Link', LinkSchema);
