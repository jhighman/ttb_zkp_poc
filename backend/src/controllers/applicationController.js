const { Application, Job, Applicant } = require('../models');

// Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title company')
      .populate('applicantId', 'name email');
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Get a single application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('applicantId');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application', error: error.message });
  }
};

// Create a new application
exports.createApplication = async (req, res) => {
  try {
    const { jobId, applicantId } = req.body;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if applicant exists
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    
    // Check if application already exists
    const existingApplication = await Application.findOne({ jobId, applicantId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Application already exists' });
    }
    
    // Create new application
    const newApplication = new Application({
      jobId,
      applicantId,
      status: 'Applied',
      appliedDate: new Date()
    });
    
    const savedApplication = await newApplication.save();
    
    // Increment application count for the job
    job.applications += 1;
    await job.save();
    
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(400).json({ message: 'Error creating application', error: error.message });
  }
};

// Update an application
exports.updateApplication = async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(400).json({ message: 'Error updating application', error: error.message });
  }
};

// Delete an application
exports.deleteApplication = async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(req.params.id);
    
    if (!deletedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Decrement application count for the job
    const job = await Job.findById(deletedApplication.jobId);
    if (job) {
      job.applications = Math.max(0, job.applications - 1);
      await job.save();
    }
    
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error: error.message });
  }
};

// Get applications for a specific job
exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const applications = await Application.find({ jobId })
      .populate('applicantId', 'name email');
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Get applications for a specific applicant
exports.getApplicationsByApplicant = async (req, res) => {
  try {
    const { applicantId } = req.params;
    
    const applications = await Application.find({ applicantId })
      .populate('jobId', 'title company location');
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Verify eligibility using ZKP
exports.verifyEligibility = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { zkpProof } = req.body;
    
    const application = await Application.findById(applicationId)
      .populate('jobId')
      .populate('applicantId');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // In a real implementation, we would verify the ZKP proof here
    // For this demo, we'll simulate the verification
    
    // Update application with verification result
    application.zkpVerification = {
      verified: true, // In a real implementation, this would be the result of the verification
      proofGenerated: true,
      proofVerified: true,
      timestamp: new Date()
    };
    
    application.status = 'Verified';
    
    await application.save();
    
    res.status(200).json({
      message: 'Eligibility verified successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying eligibility', error: error.message });
  }
};