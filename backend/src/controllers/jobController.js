const { Job } = require('../models');
const { stores } = require('../inMemoryDb');

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
    // Create a new job with a unique ID
    const newJob = {
      ...req.body,
      _id: String(stores.jobs.length + 1),
      postedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applications: 0,
      views: 0
    };
    
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