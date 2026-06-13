const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
	applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
	coverLetter: { type: String },
	status: { type: String, default: 'submitted' },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
