'use strict';

var _ = require('lodash');
var Submission = require('./submission.model');

// Get list of submissions
exports.index = function(req, res) {
  Submission.find(function (err, submissions) {
    if(err) { return handleError(res, err); }
    return res.json(200, submissions);
  });
};

// Get a single submission
exports.show = function(req, res) {
  Submission.findById(req.params.id, function (err, submission) {
    if(err) { return handleError(res, err); }
    if(!submission) { return res.send(404); }
    return res.json(submission);
  });
};

// Creates a new submission in the DB.
exports.create = function(req, res) {
  Submission.create(req.body, function(err, submission) {
    if(err) { return handleError(res, err); }
    return res.json(201, submission);
  });
};

//// Updates an existing submission in the DB.
//exports.update = function(req, res) {
//  if(req.body._id) { delete req.body._id; }
//  Submission.findById(req.params.id, function (err, submission) {
//    if (err) { return handleError(res, err); }
//    if(!submission) { return res.send(404); }
//    var updated = _.merge(submission, req.body);
//    updated.save(function (err) {
//      if (err) { return handleError(res, err); }
//      return res.json(200, submission);
//    });
//  });
//};


// Updates an existing submission in the DB.
exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    Submission.findById(req.params.id, function (err, submission) {
        if (err) { return handleError(res, err); }
        if(!submission) { return res.send(404); }
        console.log(req.body)
        var updated = _.merge(submission, req.body);
        if(
            _.has(req.body, 'comments')){
            updated.comments = req.body.comments;
        } else if (!(_.has(req.body, 'comments'))){
            updated.comments = submission.comments;
            console.log(submission.comments);
        }
        updated.save(function (err, product, numberAffected) {
            console.log(numberAffected)
            if (err) { return handleError(res, err); }
            return res.json(200, submission);
        });
    });
};

// Deletes a submission from the DB.
exports.destroy = function(req, res) {
  Submission.findById(req.params.id, function (err, submission) {
    if(err) { return handleError(res, err); }
    if(!submission) { return res.send(404); }
    submission.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}