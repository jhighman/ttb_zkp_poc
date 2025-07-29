const express = require('express');
const { applicationController } = require('../controllers');

const router = express.Router();

// GET /api/applications - Get all applications
router.get('/', applicationController.getAllApplications);

// GET /api/applications/:id - Get a single application by ID
router.get('/:id', applicationController.getApplicationById);

// GET /api/applications/job/:jobId - Get applications for a specific job
router.get('/job/:jobId', applicationController.getApplicationsByJob);

// GET /api/applications/applicant/:applicantId - Get applications for a specific applicant
router.get('/applicant/:applicantId', applicationController.getApplicationsByApplicant);

// POST /api/applications - Create a new application
router.post('/', applicationController.createApplication);

// PUT /api/applications/:id - Update an application
router.put('/:id', applicationController.updateApplication);

// DELETE /api/applications/:id - Delete an application
router.delete('/:id', applicationController.deleteApplication);

// POST /api/applications/:applicationId/verify - Verify eligibility using ZKP
router.post('/:applicationId/verify', applicationController.verifyEligibility);

module.exports = router;