const { Employer } = require('../models');

// Get all employers
exports.getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find();
    res.status(200).json(employers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employers', error: error.message });
  }
};

// Get a single employer by ID
exports.getEmployerById = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employer', error: error.message });
  }
};

// Get a single employer by DID
exports.getEmployerByDid = async (req, res) => {
  try {
    const employer = await Employer.findOne({ did: req.params.did });
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employer', error: error.message });
  }
};

// Create a new employer
exports.createEmployer = async (req, res) => {
  try {
    const newEmployer = new Employer(req.body);
    const savedEmployer = await newEmployer.save();
    res.status(201).json(savedEmployer);
  } catch (error) {
    res.status(400).json({ message: 'Error creating employer', error: error.message });
  }
};

// Update an employer
exports.updateEmployer = async (req, res) => {
  try {
    const updatedEmployer = await Employer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedEmployer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    
    res.status(200).json(updatedEmployer);
  } catch (error) {
    res.status(400).json({ message: 'Error updating employer', error: error.message });
  }
};

// Delete an employer
exports.deleteEmployer = async (req, res) => {
  try {
    const deletedEmployer = await Employer.findByIdAndDelete(req.params.id);
    
    if (!deletedEmployer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    
    res.status(200).json({ message: 'Employer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employer', error: error.message });
  }
};

// Get employer public profile
exports.getEmployerProfile = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    
    // Create a public version of the profile
    const publicProfile = {
      name: employer.name,
      did: employer.did,
      website: employer.website,
      description: employer.description,
      industry: employer.industry,
      location: employer.location
    };
    
    res.status(200).json(publicProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employer profile', error: error.message });
  }
};

// Issue a verifiable credential
exports.issueCredential = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    
    // Validate credential data
    const { type, subject, credentialId, expirationDate, credentialData } = req.body;
    
    if (!type || !subject || !credentialId || !credentialData) {
      return res.status(400).json({ message: 'Missing required credential fields' });
    }
    
    // Create new credential
    const newCredential = {
      type,
      subject,
      credentialId,
      issuanceDate: new Date(),
      expirationDate: expirationDate || null,
      status: 'Active'
    };
    
    // Add credential to employer's issued credentials
    employer.issuedCredentials.push(newCredential);
    await employer.save();
    
    res.status(201).json(newCredential);
  } catch (error) {
    res.status(400).json({ message: 'Error issuing credential', error: error.message });
  }
};

// Revoke a credential
exports.revokeCredential = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    
    const { credentialId } = req.params;
    
    // Find the credential
    const credentialIndex = employer.issuedCredentials.findIndex(
      cred => cred.credentialId === credentialId
    );
    
    if (credentialIndex === -1) {
      return res.status(404).json({ message: 'Credential not found' });
    }
    
    // Update credential status
    employer.issuedCredentials[credentialIndex].status = 'Revoked';
    await employer.save();
    
    res.status(200).json({ message: 'Credential revoked successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error revoking credential', error: error.message });
  }
};