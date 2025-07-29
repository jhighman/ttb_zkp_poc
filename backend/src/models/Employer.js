// Import mongoose from our in-memory database implementation
const { mongoose } = require('../inMemoryDb');

const employerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  did: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // Format: did:method:specific-identifier
    match: [/^did:[a-z0-9]+:[a-zA-Z0-9.%-]+$/, 'Please enter a valid DID']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  industry: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  // Verifiable credentials issued by this employer
  issuedCredentials: [{
    type: {
      type: String,
      enum: ['EmploymentCredential', 'SkillCredential', 'ReferenceCredential'],
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applicant',
      required: true
    },
    issuanceDate: {
      type: Date,
      default: Date.now
    },
    expirationDate: {
      type: Date
    },
    credentialId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['Active', 'Revoked', 'Expired'],
      default: 'Active'
    }
  }]
}, {
  timestamps: true
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;