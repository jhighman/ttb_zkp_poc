// ApplicationModal Component
// This component is responsible for handling the job application process

class ApplicationModal {
    /**
     * Show the application modal for a job
     * @param {Object} job - The job data
     * @param {Object} zkpVerifier - The ZKP verifier instance
     * @param {Object} didService - The DID service instance
     */
    static show(job, zkpVerifier, didService) {
        // Check if zkpVerifier is available
        if (!zkpVerifier) {
            console.error('ZKP Verifier not initialized');
            JobBoardNotifications.showError('ZKP verification system is not available. Please try again later.');
            return;
        }
        
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'application-modal-container';
        modalContainer.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'glass-card rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto neon-border';
        
        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'flex justify-between items-start mb-6';
        
        // Modal title
        const modalTitle = document.createElement('h3');
        modalTitle.className = 'text-2xl font-bold text-neon-blue';
        modalTitle.textContent = `Apply to ${job.title} at ${job.company}`;
        modalHeader.appendChild(modalTitle);
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'text-blue-300 hover:text-neon-blue text-xl';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            modalContainer.remove();
        });
        modalHeader.appendChild(closeButton);
        
        modalContent.appendChild(modalHeader);
        
        // Job details summary
        const jobSummary = document.createElement('div');
        jobSummary.className = 'mb-6 p-4 bg-dark-bg/50 rounded-lg';
        
        const jobLocation = document.createElement('div');
        jobLocation.className = 'text-sm text-blue-300 mb-2';
        
        // Build job details text with location and type
        let jobDetailsText = `<span class="mr-1">📍</span> ${job.location} | <span class="mr-1">⏰</span> ${job.type}`;
        
        // Add salary information if available
        if (job.salaryMin !== undefined || job.salaryMax !== undefined) {
            jobDetailsText += ' | <span class="mr-1">💰</span> ';
            
            if (job.salaryMin !== undefined && job.salaryMax !== undefined) {
                jobDetailsText += `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
            } else if (job.salaryMin !== undefined) {
                jobDetailsText += `From $${job.salaryMin.toLocaleString()}`;
            } else if (job.salaryMax !== undefined) {
                jobDetailsText += `Up to $${job.salaryMax.toLocaleString()}`;
            }
        }
        
        jobLocation.innerHTML = jobDetailsText;
        jobSummary.appendChild(jobLocation);
        
        const credentialsRequired = document.createElement('div');
        credentialsRequired.className = 'text-sm text-blue-300 mb-2';
        credentialsRequired.textContent = 'Required Credentials:';
        jobSummary.appendChild(credentialsRequired);
        
        const credentialsList = document.createElement('div');
        credentialsList.className = 'flex flex-wrap gap-2';
        
        job.requiredCredentials.forEach(credential => {
            const credentialBadge = document.createElement('span');
            credentialBadge.className = 'text-xs bg-neon-gradient text-dark-bg px-2 py-1 rounded-full';
            credentialBadge.textContent = credential;
            credentialsList.appendChild(credentialBadge);
        });
        
        jobSummary.appendChild(credentialsList);
        modalContent.appendChild(jobSummary);
        
        // Application form
        const applicationForm = document.createElement('form');
        applicationForm.id = 'application-form';
        applicationForm.className = 'space-y-6';
        
        // DID selection
        const didGroup = document.createElement('div');
        
        const didLabel = document.createElement('label');
        didLabel.className = 'block text-blue-300 mb-2';
        didLabel.htmlFor = 'applicant-did';
        didLabel.textContent = 'Select Your Decentralized Identifier (DID)';
        didGroup.appendChild(didLabel);
        
        // Get available DIDs
        const holderDids = didService.getHolderDids();
        
        // Create select dropdown
        const didSelect = document.createElement('select');
        didSelect.id = 'applicant-did';
        didSelect.className = 'w-full bg-dark-bg/50 border border-blue-500/30 rounded-lg p-3 text-blue-100 focus:outline-none focus:border-neon-blue';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select a DID --';
        didSelect.appendChild(defaultOption);
        
        // Add options for each holder DID
        holderDids.forEach(holder => {
            const option = document.createElement('option');
            option.value = holder.id;
            option.textContent = `${holder.displayName} (${holder.id})`;
            didSelect.appendChild(option);
        });
        
        didGroup.appendChild(didSelect);
        
        const didHelp = document.createElement('div');
        didHelp.className = 'text-xs text-blue-400 mt-1';
        didHelp.textContent = 'Your DID will be used to verify your credentials without revealing personal information.';
        didGroup.appendChild(didHelp);
        
        applicationForm.appendChild(didGroup);
        
        // Verify DID button
        const verifyDidButton = document.createElement('button');
        verifyDidButton.type = 'button';
        verifyDidButton.id = 'verify-did-button';
        verifyDidButton.className = 'w-full bg-neon-gradient text-dark-bg py-3 rounded-lg font-bold hover:scale-105 transition-transform';
        verifyDidButton.textContent = 'Verify DID & Credentials';
        verifyDidButton.addEventListener('click', async () => {
            const did = didSelect.value.trim();
            if (!did) {
                JobBoardNotifications.showError('Please enter your DID');
                return;
            }
            
            // Show loading state
            verifyDidButton.disabled = true;
            verifyDidButton.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Verifying...';
            
            try {
                // Fetch DID document
                const didDocument = await didService.fetchDidDocument(did);
                
                // Display DID verification result
                didVerificationResult.style.display = 'block';
                didVerificationStatus.textContent = 'DID Verified';
                didVerificationStatus.className = 'text-neon-green font-bold';
                
                // Display DID document
                didDocumentDisplay.textContent = JSON.stringify(didDocument, null, 2);
                
                // Show ZKP section
                zkpSection.style.display = 'block';
                
                // Hide verify button, show apply button
                verifyDidButton.style.display = 'none';
                applyButton.style.display = 'block';
                
            } catch (error) {
                console.error('Error verifying DID:', error);
                JobBoardNotifications.showError('Failed to verify DID. Please check your DID and try again.');
                
                // Reset button
                verifyDidButton.disabled = false;
                verifyDidButton.textContent = 'Verify DID & Credentials';
            }
        });
        
        applicationForm.appendChild(verifyDidButton);
        
        // DID verification result (hidden initially)
        const didVerificationResult = document.createElement('div');
        didVerificationResult.className = 'mt-6 p-4 bg-dark-bg/50 rounded-lg';
        didVerificationResult.style.display = 'none';
        
        const didVerificationHeader = document.createElement('div');
        didVerificationHeader.className = 'flex items-center justify-between mb-2';
        
        const didVerificationTitle = document.createElement('div');
        didVerificationTitle.className = 'text-blue-300';
        didVerificationTitle.textContent = 'DID Verification:';
        didVerificationHeader.appendChild(didVerificationTitle);
        
        const didVerificationStatus = document.createElement('div');
        didVerificationStatus.className = 'text-yellow-400 font-bold';
        didVerificationStatus.textContent = 'Pending';
        didVerificationHeader.appendChild(didVerificationStatus);
        
        didVerificationResult.appendChild(didVerificationHeader);
        
        const didDocumentTitle = document.createElement('div');
        didDocumentTitle.className = 'text-xs text-blue-300 mt-4 mb-2';
        didDocumentTitle.textContent = 'DID Document:';
        didVerificationResult.appendChild(didDocumentTitle);
        
        const didDocumentDisplay = document.createElement('pre');
        didDocumentDisplay.className = 'text-xs bg-dark-bg/70 p-3 rounded overflow-x-auto text-blue-100';
        didDocumentDisplay.style.maxHeight = '150px';
        didVerificationResult.appendChild(didDocumentDisplay);
        
        applicationForm.appendChild(didVerificationResult);
        
        // ZKP section (hidden initially)
        const zkpSection = document.createElement('div');
        zkpSection.className = 'mt-6';
        zkpSection.style.display = 'none';
        
        const zkpTitle = document.createElement('h4');
        zkpTitle.className = 'text-lg font-bold text-neon-blue mb-4';
        zkpTitle.textContent = 'Zero-Knowledge Proof Verification';
        zkpSection.appendChild(zkpTitle);
        
        const zkpDescription = document.createElement('p');
        zkpDescription.className = 'text-blue-100 mb-4';
        zkpDescription.textContent = 'Generate a zero-knowledge proof to verify you have the required credentials without revealing any personal information.';
        zkpSection.appendChild(zkpDescription);
        
        // Required credentials list
        const requiredCredsList = document.createElement('div');
        requiredCredsList.className = 'mb-4';
        
        const requiredCredsTitle = document.createElement('div');
        requiredCredsTitle.className = 'text-sm text-blue-300 mb-2';
        requiredCredsTitle.textContent = 'Required Credentials for ZKP:';
        requiredCredsList.appendChild(requiredCredsTitle);
        
        job.requiredCredentials.forEach(credential => {
            const credRow = document.createElement('div');
            credRow.className = 'flex items-center space-x-2 mb-2';
            
            const credCheck = document.createElement('span');
            credCheck.className = 'text-yellow-400';
            credCheck.textContent = '⟳';
            credRow.appendChild(credCheck);
            
            const credName = document.createElement('span');
            credName.className = 'text-blue-100';
            credName.textContent = credential;
            credRow.appendChild(credName);
            
            requiredCredsList.appendChild(credRow);
        });
        
        zkpSection.appendChild(requiredCredsList);
        
        // Generate ZKP button
        const generateZkpButton = document.createElement('button');
        generateZkpButton.type = 'button';
        generateZkpButton.className = 'w-full bg-blue-500/30 text-blue-100 py-3 rounded-lg font-bold hover:bg-blue-500/50 transition-colors mb-4';
        generateZkpButton.textContent = 'Generate Zero-Knowledge Proof';
        generateZkpButton.addEventListener('click', async () => {
            // Show loading state
            generateZkpButton.disabled = true;
            generateZkpButton.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Generating Proof...';
            
            try {
                // Get DID
                const did = didInput.value.trim();
                
                // Generate ZKP
                const proof = await zkpVerifier.generateProof(did, job.requiredCredentials);
                
                // Update credential checks
                const credChecks = requiredCredsList.querySelectorAll('.text-yellow-400');
                credChecks.forEach(check => {
                    check.className = 'text-neon-green';
                    check.textContent = '✓';
                });
                
                // Show proof result
                zkpResultDisplay.textContent = JSON.stringify(proof, null, 2);
                zkpResultContainer.style.display = 'block';
                
                // Enable apply button
                applyButton.disabled = false;
                
                // Update button
                generateZkpButton.className = 'w-full bg-neon-green/20 text-neon-green py-3 rounded-lg font-bold transition-colors mb-4';
                generateZkpButton.innerHTML = '<span class="mr-2">✓</span> Proof Generated Successfully';
                
            } catch (error) {
                console.error('Error generating ZKP:', error);
                JobBoardNotifications.showError('Failed to generate zero-knowledge proof. Please try again.');
                
                // Reset button
                generateZkpButton.disabled = false;
                generateZkpButton.textContent = 'Generate Zero-Knowledge Proof';
            }
        });
        
        zkpSection.appendChild(generateZkpButton);
        
        // ZKP result container (hidden initially)
        const zkpResultContainer = document.createElement('div');
        zkpResultContainer.className = 'bg-dark-bg/50 p-3 rounded-lg';
        zkpResultContainer.style.display = 'none';
        
        const zkpResultTitle = document.createElement('div');
        zkpResultTitle.className = 'text-xs text-blue-300 mb-2';
        zkpResultTitle.textContent = 'Generated Proof:';
        zkpResultContainer.appendChild(zkpResultTitle);
        
        const zkpResultDisplay = document.createElement('pre');
        zkpResultDisplay.className = 'text-xs bg-dark-bg/70 p-3 rounded overflow-x-auto text-blue-100';
        zkpResultDisplay.style.maxHeight = '100px';
        zkpResultContainer.appendChild(zkpResultDisplay);
        
        zkpSection.appendChild(zkpResultContainer);
        
        applicationForm.appendChild(zkpSection);
        
        // Apply button (hidden initially)
        const applyButton = document.createElement('button');
        applyButton.type = 'button';
        applyButton.className = 'w-full bg-neon-gradient text-dark-bg py-3 rounded-lg font-bold hover:scale-105 transition-transform mt-6';
        applyButton.textContent = 'Submit Application';
        applyButton.style.display = 'none';
        applyButton.disabled = true;
        applyButton.addEventListener('click', async () => {
            // Show loading state
            applyButton.disabled = true;
            applyButton.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Submitting...';
            
            try {
                // Get DID
                const did = didInput.value.trim();
                
                // Submit application
                const applicationData = {
                    jobId: job.id,
                    applicantDid: did,
                    timestamp: new Date().toISOString()
                };
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                JobBoardNotifications.showNotification('Application submitted successfully!', 'success');
                
                // Close modal
                modalContainer.remove();
                
            } catch (error) {
                console.error('Error submitting application:', error);
                JobBoardNotifications.showError('Failed to submit application. Please try again.');
                
                // Reset button
                applyButton.disabled = false;
                applyButton.textContent = 'Submit Application';
            }
        });
        
        applicationForm.appendChild(applyButton);
        
        modalContent.appendChild(applicationForm);
        modalContainer.appendChild(modalContent);
        
        // Add to body
        document.body.appendChild(modalContainer);
        
        // Focus on DID select
        setTimeout(() => {
            didSelect.focus();
        }, 100);
    }
}

// Export the ApplicationModal class
window.ApplicationModal = ApplicationModal;

// Log that the ApplicationModal component is loaded
console.log('ApplicationModal component loaded');