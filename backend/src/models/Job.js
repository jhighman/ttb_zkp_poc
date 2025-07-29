// Import mongoose from our in-memory database implementation
const { mongoose } = require('../inMemoryDb');

const jobSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary']
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  requirements: {
    minTruaScore: {
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
  postedDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Filled', 'Expired', 'Draft'],
    default: 'Active'
  },
  applications: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;