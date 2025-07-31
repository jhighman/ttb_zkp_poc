const { Job, Employer } = require('../models');
const { stores } = require('../inMemoryDb');
const crypto = require('crypto');

// Helper function to sign a job posting with employer's private key
// In a real implementation, this would use the employer's actual private key
// For this demo, we'll simulate it with a mock key
const signJobPosting = (jobData, employerDid) => {
  // In a real implementation, we would:
  // 1. Retrieve the employer's private key associated with their DID
  // 2. Create a canonical representation of the job data
  // 3. Sign it with the private key
  
  // For demo purposes, we'll create a mock signature
  const mockPrivateKey = crypto.createHash('sha256').update(employerDid).digest('hex');
  
  // Create a canonical representation of the job data
  const canonicalData = JSON.stringify({
    title: jobData.title,
    company: jobData.company,
    description: jobData.description,
    requirements: jobData.requirements,
    employerDid: employerDid,
    timestamp: new Date().toISOString()
  });
  
  // Create a signature
  const sign = crypto.createHmac('sha256', mockPrivateKey);
  sign.update(canonicalData);
  const signature = sign.digest('hex');
  
  return {
    signature,
    verificationMethod: `${employerDid}#keys-1`,
    canonicalData
  };
};

// Helper function to verify a job posting signature
const verifyJobSignature = (job) => {
  if (!job.signature || !job.verificationMethod || !job.employerDid) {
    return false;
  }
  
  try {
    // In a real implementation, we would:
    // 1. Resolve the DID to get the public key
    // 2. Verify the signature using the public key
    
    // For demo purposes, we'll simulate verification
    const mockPrivateKey = crypto.createHash('sha256').update(job.employerDid).digest('hex');
    
    // Recreate the canonical data
    const canonicalData = JSON.stringify({
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      employerDid: job.employerDid,
      timestamp: job.timestamp || new Date(job.postedDate).toISOString()
    });
    
    // Verify the signature
    const sign = crypto.createHmac('sha256', mockPrivateKey);
    sign.update(canonicalData);
    const expectedSignature = sign.digest('hex');
    
    return job.signature === expectedSignature;
  } catch (error) {
    console.error('Error verifying job signature:', error);
    return false;
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    // Get jobs directly from the in-memory store
    const jobs = stores.jobs.slice();
    
    // Sort by postedDate in descending order
    jobs.sort((a, b) => {
      const dateA = new Date(a.postedDate || 0);
      const dateB = new Date(b.postedDate || 0);
      return dateB - dateA;
    });
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    // Find job by ID in the in-memory store
    const job = stores.jobs.find(job => job._id === req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Increment view count
    job.views += 1;
    
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
};
// Create a new job
exports.createJob = async (req, res) => {
  try {
    // For demo purposes, use a default employer if not provided
    let employerId = req.body.employerId;
    let employer;
    
    if (!employerId) {
      // Check if we have any employers in the store
      if (stores.employers && stores.employers.length > 0) {
        employer = stores.employers[0];
        employerId = employer._id;
      } else {
        // Create a default employer if none exists
        employer = {
          _id: '1',
          name: 'Trua Technologies',
          did: 'did:web:trua.example.com',
          email: 'jobs@trua.example.com'
        };
        
        // Add to the store if it doesn't exist
        if (!stores.employers) {
          stores.employers = [];
        }
        stores.employers.push(employer);
      }
    } else {
      // Find the employer to get their DID
      employer = stores.employers.find(emp => emp._id === employerId);
      
      if (!employer) {
        return res.status(404).json({ message: 'Employer not found' });
      }
    }
    
    // Extract job data, removing employerId if present
    const { employerId: _, ...jobData } = req.body;
    
    // Create a new job with a unique ID
    const newJob = {
      ...jobData,
      employer: employerId,
      employerDid: employer.did,
      _id: String(stores.jobs.length + 1),
      postedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applications: 0,
      views: 0,
      timestamp: new Date().toISOString()
    };
    
    // Sign the job posting
    const { signature, verificationMethod } = signJobPosting(newJob, employer.did);
    newJob.signature = signature;
    newJob.verificationMethod = verificationMethod;
    
    // Add to the in-memory store
    stores.jobs.push(newJob);
    
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: 'Error creating job', error: error.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    // Find the job index in the in-memory store
    const jobIndex = stores.jobs.findIndex(job => job._id === req.params.id);
    
    if (jobIndex === -1) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Update the job
    const updatedJob = {
      ...stores.jobs[jobIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    // Replace the job in the in-memory store
    stores.jobs[jobIndex] = updatedJob;
    
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: 'Error updating job', error: error.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    // Find the job index in the in-memory store
    const jobIndex = stores.jobs.findIndex(job => job._id === req.params.id);
    
    if (jobIndex === -1) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Remove the job from the in-memory store
    const deletedJob = stores.jobs.splice(jobIndex, 1)[0];
    
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};

// Search jobs
exports.searchJobs = async (req, res) => {
  try {
    const { title, location, type, minSalary, skills } = req.query;
    
    const query = {};
    
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (type) {
      query.type = type;
    }
    
    if (minSalary) {
      query['salary.min'] = { $gte: parseInt(minSalary) };
    }
    
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills = { $in: skillsArray };
    }
    
    // Only show active jobs
    query.status = 'Active';
    
    // Get jobs directly from the in-memory store
    let jobs = stores.jobs.slice();
    
    // Apply filters
    if (Object.keys(query).length > 0) {
      jobs = jobs.filter(job => {
        // Check title
        if (query.title && !job.title.toLowerCase().includes(query.title.toLowerCase())) {
          return false;
        }
        
        // Check location
        if (query.location && !job.location.toLowerCase().includes(query.location.toLowerCase())) {
          return false;
        }
        
        // Check type
        if (query.type && job.type !== query.type) {
          return false;
        }
        
        // Check minSalary
        if (query['salary.min'] && job.salary.min < query['salary.min'].$gte) {
          return false;
        }
        
        // Check skills
        if (query.skills && !job.skills.some(skill => query.skills.$in.includes(skill))) {
          return false;
        }
        
        // Check status
        if (query.status && job.status !== query.status) {
          return false;
        }
        
        return true;
      });
    }
    
    // Sort by postedDate in descending order
    jobs.sort((a, b) => {
      const dateA = new Date(a.postedDate || 0);
      const dateB = new Date(b.postedDate || 0);
      return dateB - dateA;
    });
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error searching jobs', error: error.message });
  }
};

// Verify a job signature
exports.verifyJobSignature = async (req, res) => {
  try {
    const job = stores.jobs.find(job => job._id === req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const isVerified = verifyJobSignature(job);
    
    res.status(200).json({
      jobId: job._id,
      isVerified,
      verificationMethod: job.verificationMethod || null,
      employerDid: job.employerDid || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying job signature', error: error.message });
  }
};

// Get jobs with verification status
exports.getJobsWithVerificationStatus = async (req, res) => {
  try {
    // Get jobs directly from the in-memory store
    const jobs = stores.jobs.slice();
    
    // Add verification status to each job
    const jobsWithVerification = jobs.map(job => {
      const isVerified = verifyJobSignature(job);
      return {
        ...job,
        isVerified
      };
    });
    
    // Sort by postedDate in descending order
    jobsWithVerification.sort((a, b) => {
      const dateA = new Date(a.postedDate || 0);
      const dateB = new Date(b.postedDate || 0);
      return dateB - dateA;
    });
    
    res.status(200).json(jobsWithVerification);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs with verification status', error: error.message });
  }
};