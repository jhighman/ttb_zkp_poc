// Import mongoose from our in-memory database implementation
const { mongoose } = require('../inMemoryDb');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicant',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Verified', 'Rejected', 'Accepted', 'Withdrawn'],
    default: 'Applied'
  },
  zkpVerification: {
    verified: {
      type: Boolean,
      default: false
    },
    proofGenerated: {
      type: Boolean,
      default: false
    },
    proofVerified: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date
    }
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index to ensure an applicant can only apply once to a job
applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;