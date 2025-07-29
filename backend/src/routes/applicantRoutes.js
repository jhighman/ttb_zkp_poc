const express = require('express');
const { applicantController } = require('../controllers');

const router = express.Router();

// GET /api/applicants - Get all applicants
router.get('/', applicantController.getAllApplicants);

// GET /api/applicants/:id - Get a single applicant by ID
router.get('/:id', applicantController.getApplicantById);

// GET /api/applicants/:id/profile - Get applicant public profile
router.get('/:id/profile', applicantController.getApplicantProfile);

// POST /api/applicants - Create a new applicant
router.post('/', applicantController.createApplicant);

// PUT /api/applicants/:id - Update an applicant
router.put('/:id', applicantController.updateApplicant);

// DELETE /api/applicants/:id - Delete an applicant
router.delete('/:id', applicantController.deleteApplicant);

module.exports = router;