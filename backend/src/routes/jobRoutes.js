const express = require('express');
const { jobController } = require('../controllers');

const router = express.Router();

// GET /api/jobs - Get all jobs
router.get('/', jobController.getAllJobs);

// GET /api/jobs/search - Search jobs
router.get('/search', jobController.searchJobs);

// GET /api/jobs/:id - Get a single job by ID
router.get('/:id', jobController.getJobById);

// POST /api/jobs - Create a new job
router.post('/', jobController.createJob);

// PUT /api/jobs/:id - Update a job
router.put('/:id', jobController.updateJob);

// DELETE /api/jobs/:id - Delete a job
router.delete('/:id', jobController.deleteJob);

module.exports = router;