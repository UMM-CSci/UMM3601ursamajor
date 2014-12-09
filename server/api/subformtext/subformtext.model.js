'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SubformtextSchema = new Schema({
  title: String,
  adviserDisclaimer: String,
  ursSummary: String,
  notes1: String,
  nameDisclaimer: String,
  header1: String,
  criteria: String,
  header2: String,
  notes2: String,
  artistCriteria: String,
  humanitiesCriteria: String,
  scienceCriteria: String,
  notes3: String,
  submissionTitle: String,
  submissionFormat: String,
  submissionAbstract: String,
  submissionAbstractNotes: String,
  submissionPresentationType: String,
  submissionFormatChange: String,
  submissionChangeNotes: String,
  submissionPresenter: String,
  submissionCopresenterOne: String,
  submissionCopresenterTwo: String,
  submissionSponsors: String,
  submissionSponsorsNotes: String,
  submissionAdviser: String,
  submissionCoadviserOne: String,
  submissionCoadviserTwo: String,
  submissionAdviserNotes: String,
  submissionFeatured: String,
  submissionMediaServices: String,
  submissionSpecialRequirements: String,
  //submissionTee: String,
  //submissionTeeNotes: String,
  submissionOther: String
});

module.exports = mongoose.model('Subformtext', SubformtextSchema);