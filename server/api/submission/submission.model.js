'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SubmissionSchema = new Schema({
    title: String,
    format: String,
    abstract: String,
    presentationType: String,
    formatChange: Boolean, // Are people willing to give submission in another format.
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
    otherInfo: String,
    approval: Boolean,
    cc: Boolean,
    rejection: Boolean, // Rejection means a submission was entirely turned down.
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
