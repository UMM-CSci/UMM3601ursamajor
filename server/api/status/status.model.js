'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StatusSchema = new Schema({
    strict: String,
    color: {red: Number, green: Number, blue: Number, alpha: Number},
    emailSubject: String,
    emailBody: String,
    priority: Number,
    required: Boolean
});

module.exports = mongoose.model('Status', StatusSchema);