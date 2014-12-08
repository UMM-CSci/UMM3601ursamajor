'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SubmissionSchema = new Schema({
    title: String,
    format: String,
    abstract: String,
    presentationType: String,
    formatChange: Boolean,
    presenterInfo: {first: String, last: String, email: String},
    copresenterOneInfo: {first: String, last: String, email: String},
    copresenterTwoInfo: {first: String, last: String, email: String},
    discipline: String,
    sponsors: [String],
    adviserInfo: {first: String, last: String, email: String},
    coadviserOneInfo: {first: String, last: String, email: String},
    coadviserTwoInfo: {first: String, last: String, email: String},
    featured: Boolean,
    mediaServicesEquipment: String,
    specialRequirements: String,
    //presenterTeeSize: String,
    otherInfo: String,
    approval: Boolean,
    cc: {
        type: Boolean,
        default: false
    },
    rejection: Boolean,
    status: {strict: String, priority: Number, text: String},
    timestamp: String,
    group: Number,
    roomAssignment: String,
    resubmissionData: {comment: String, parentSubmission: String, isPrimary: Boolean, resubmitFlag: Boolean},
    comments: [
        {
            commentText: String,
            selectionText: String,
            commenter: String,
            responses: [{response: String, responder: String, timestamp: String}],
            indicator: Number,
            beginner: Number,
            ender: Number,
            timestamp: String,
            origin: String
        }
    ],
    reviewVotes: {
        Accepted: [String],
        Minor: [String],
        Major: [String],
        TotalRewrite: [String]
    }

});

module.exports = mongoose.model('Submission', SubmissionSchema);
