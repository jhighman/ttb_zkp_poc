const { Applicant } = require('../models');

// Get all applicants
exports.getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find();
    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicants', error: error.message });
  }
};

// Get a single applicant by ID
exports.getApplicantById = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.status(200).json(applicant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicant', error: error.message });
  }
};

// Create a new applicant
exports.createApplicant = async (req, res) => {
  try {
    const newApplicant = new Applicant(req.body);
    const savedApplicant = await newApplicant.save();
    res.status(201).json(savedApplicant);
  } catch (error) {
    res.status(400).json({ message: 'Error creating applicant', error: error.message });
  }
};

// Update an applicant
exports.updateApplicant = async (req, res) => {
  try {
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedApplicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    
    res.status(200).json(updatedApplicant);
  } catch (error) {
    res.status(400).json({ message: 'Error updating applicant', error: error.message });
  }
};

// Delete an applicant
exports.deleteApplicant = async (req, res) => {
  try {
    const deletedApplicant = await Applicant.findByIdAndDelete(req.params.id);
    
    if (!deletedApplicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    
    res.status(200).json({ message: 'Applicant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting applicant', error: error.message });
  }
};

// Get applicant profile (public version without sensitive data)
exports.getApplicantProfile = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    
    // Create a public version of the profile without sensitive data
    const publicProfile = {
      name: applicant.name,
      skills: applicant.skills,
      experience: applicant.experience.map(exp => ({
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description
      })),
      education: applicant.education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        graduationDate: edu.graduationDate
      }))
    };
    
    res.status(200).json(publicProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicant profile', error: error.message });
  }
};