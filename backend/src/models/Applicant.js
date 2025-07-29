// Import mongoose from our in-memory database implementation
const { mongoose } = require('../inMemoryDb');

const applicantSchema = new mongoose.Schema({
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
  profile: {
    truaScore: {
      type: Number,
      required: true,
      min: 0,
      max: 360
    },
    disqualifiers: {
      felony: {
        type: Boolean,
        default: false
      },
      dui: {
        type: Boolean,
        default: false
      },
      suspendedLicense: {
        type: Boolean,
        default: false
      },
      misdemeanor: {
        type: Boolean,
        default: false
      },
      warrants: {
        type: Boolean,
        default: false
      }
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    description: {
      type: String
    }
  }],
  education: [{
    degree: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    graduationDate: {
      type: Date,
      required: true
    }
  }],
  // Verifiable credentials held by this applicant
  verifiableCredentials: [{
    type: {
      type: String,
      enum: ['EducationCredential', 'EmploymentCredential', 'SkillCredential', 'BackgroundCheckCredential'],
      required: true
    },
    issuer: {
      type: String, // DID of the issuer
      required: true
    },
    issuanceDate: {
      type: Date,
      required: true
    },
    expirationDate: {
      type: Date
    },
    credentialId: {
      type: String,
      required: true
    },
    credentialSubject: {
      // The actual credential data, stored as JSON
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    proof: {
      // Cryptographic proof of the credential
      type: mongoose.Schema.Types.Mixed,
      required: true
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

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;