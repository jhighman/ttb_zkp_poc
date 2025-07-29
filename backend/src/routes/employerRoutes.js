const express = require('express');
const { employerController } = require('../controllers');

const router = express.Router();

// GET /api/employers - Get all employers
router.get('/', employerController.getAllEmployers);

// GET /api/employers/:id - Get a single employer by ID
router.get('/:id', employerController.getEmployerById);

// GET /api/employers/did/:did - Get a single employer by DID
router.get('/did/:did', employerController.getEmployerByDid);

// GET /api/employers/:id/profile - Get employer public profile
router.get('/:id/profile', employerController.getEmployerProfile);

// POST /api/employers - Create a new employer
router.post('/', employerController.createEmployer);

// PUT /api/employers/:id - Update an employer
router.put('/:id', employerController.updateEmployer);

// DELETE /api/employers/:id - Delete an employer
router.delete('/:id', employerController.deleteEmployer);

// POST /api/employers/:id/credentials - Issue a verifiable credential
router.post('/:id/credentials', employerController.issueCredential);

// PUT /api/employers/:id/credentials/:credentialId/revoke - Revoke a credential
router.put('/:id/credentials/:credentialId/revoke', employerController.revokeCredential);

module.exports = router;