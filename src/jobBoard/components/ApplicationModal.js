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
                
                // Auto-verify credentials
                await autoVerifyCredentials();
                
                
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
        zkpTitle.textContent = 'Application Data Sharing';
        zkpSection.appendChild(zkpTitle);
        
        const zkpDescription = document.createElement('p');
        zkpDescription.className = 'text-blue-100 mb-4';
        zkpDescription.textContent = 'Control what information from your Trua profile you want to share with this employer. Required credentials will be verified using Zero-Knowledge Proofs without revealing the actual data.';
        zkpSection.appendChild(zkpDescription);
        
        // Selective Disclosure Section
        const selectiveDisclosureSection = document.createElement('div');
        selectiveDisclosureSection.className = 'mb-6 p-4 bg-dark-bg/50 rounded-lg';
        
        const selectiveDisclosureTitle = document.createElement('h5');
        selectiveDisclosureTitle.className = 'text-md font-bold text-neon-blue mb-3';
        selectiveDisclosureTitle.textContent = 'Trua Profile Data Sharing';
        selectiveDisclosureSection.appendChild(selectiveDisclosureTitle);
        
        const selectiveDisclosureDescription = document.createElement('p');
        selectiveDisclosureDescription.className = 'text-blue-100 text-sm mb-4';
        selectiveDisclosureDescription.textContent = 'Select which parts of your Trua profile you want to share with this employer. This gives you control over your personal data while still allowing verification of required credentials.';
        selectiveDisclosureSection.appendChild(selectiveDisclosureDescription);
        
        // Create disclosure options
        const disclosureOptions = document.createElement('div');
        disclosureOptions.className = 'grid grid-cols-1 md:grid-cols-2 gap-3';
        
        // Define disclosure categories
        const disclosureCategories = [
            {
                id: 'education',
                label: 'Education Details',
                description: 'Your degrees, institutions, graduation dates',
                defaultChecked: false
            },
            {
                id: 'experience',
                label: 'Work Experience',
                description: 'Your previous employers and roles',
                defaultChecked: false
            },
            {
                id: 'certifications',
                label: 'Professional Certifications',
                description: 'Your professional qualifications and licenses',
                defaultChecked: false
            },
            {
                id: 'skills',
                label: 'Skills & Technologies',
                description: 'Your technical and professional skills',
                defaultChecked: false
            },
            {
                id: 'criminal',
                label: 'Criminal Background',
                description: 'Your criminal history status',
                defaultChecked: false
            },
            {
                id: 'truascore',
                label: 'TruaScore',
                description: 'Your exact TruaScore value',
                defaultChecked: false
            }
        ];
        
        // Create checkbox for each disclosure category
        disclosureCategories.forEach(category => {
            const optionContainer = document.createElement('div');
            optionContainer.className = 'flex items-start space-x-2 bg-dark-bg/30 p-3 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `disclosure-${category.id}`;
            checkbox.className = 'mt-1';
            checkbox.checked = category.defaultChecked;
            optionContainer.appendChild(checkbox);
            
            const labelContainer = document.createElement('div');
            
            const label = document.createElement('label');
            label.htmlFor = `disclosure-${category.id}`;
            label.className = 'text-blue-100 font-medium block';
            label.textContent = category.label;
            labelContainer.appendChild(label);
            
            const description = document.createElement('span');
            description.className = 'text-blue-300 text-xs block';
            description.textContent = category.description;
            labelContainer.appendChild(description);
            
            optionContainer.appendChild(labelContainer);
            disclosureOptions.appendChild(optionContainer);
        });
        
        selectiveDisclosureSection.appendChild(disclosureOptions);
        
        // Add privacy note
        const privacyNote = document.createElement('div');
        privacyNote.className = 'text-xs text-blue-400 mt-4 italic';
        privacyNote.innerHTML = '<span class="font-bold">Data Privacy:</span> Only the information you explicitly select above will be shared with the employer. Unselected data remains completely private. Required credentials will still be verified using Zero-Knowledge Proofs, which confirm you meet the requirements without revealing your actual data.';
        selectiveDisclosureSection.appendChild(privacyNote);
        
        zkpSection.appendChild(selectiveDisclosureSection);
        
        // Required credentials list
        const requiredCredsList = document.createElement('div');
        requiredCredsList.className = 'mb-4 p-4 bg-dark-bg/50 rounded-lg';
        
        const requiredCredsTitle = document.createElement('div');
        requiredCredsTitle.className = 'text-md font-bold text-neon-blue mb-3';
        requiredCredsTitle.textContent = 'Required Credentials (Verified Privately):';
        requiredCredsList.appendChild(requiredCredsTitle);
        
        const requiredCredsDescription = document.createElement('p');
        requiredCredsDescription.className = 'text-blue-100 text-sm mb-4';
        requiredCredsDescription.textContent = 'The following credentials are required for this job. They will be verified using Zero-Knowledge Proofs, which confirms you meet the requirements without revealing your actual data.';
        requiredCredsList.appendChild(requiredCredsDescription);
        
        const credentialItemsList = document.createElement('div');
        credentialItemsList.className = 'space-y-2';
        
        job.requiredCredentials.forEach(credential => {
            const credRow = document.createElement('div');
            credRow.className = 'flex items-center space-x-2 bg-dark-bg/30 p-2 rounded-lg';
            
            const credCheck = document.createElement('span');
            credCheck.className = 'text-yellow-400 w-5 h-5 flex items-center justify-center';
            credCheck.textContent = '⟳';
            credRow.appendChild(credCheck);
            
            const credName = document.createElement('span');
            credName.className = 'text-blue-100';
            credName.textContent = credential;
            credRow.appendChild(credName);
            
            credentialItemsList.appendChild(credRow);
        });
        
        requiredCredsList.appendChild(credentialItemsList);
        zkpSection.appendChild(requiredCredsList);
        
        // Disclosure summary container (hidden initially)
        const disclosureSummaryContainer = document.createElement('div');
        disclosureSummaryContainer.className = 'mb-4 p-4 bg-dark-bg/50 rounded-lg';
        disclosureSummaryContainer.style.display = 'none';
        zkpSection.appendChild(disclosureSummaryContainer);
        
        // Auto-verify credentials without requiring user interaction
        const autoVerifyCredentials = async () => {
            try {
                // Get DID
                const did = didSelect.value.trim();
                
                // Get selected disclosure options
                const selectedDisclosures = {};
                disclosureCategories.forEach(category => {
                    const checkbox = document.getElementById(`disclosure-${category.id}`);
                    selectedDisclosures[category.id] = checkbox.checked;
                });
                
                // Create a mock applicant data object with the required structure
                const applicantData = {
                    did: did,
                    profile: {
                        truaScore: 85, // Default high score for demo purposes
                        disqualifiers: {
                            felony: false,
                            dui: false,
                            suspendedLicense: false,
                            misdemeanor: false,
                            warrants: false
                        }
                    }
                };
                
                // Create job requirements object
                const jobRequirements = {
                    minTruaScore: 70,
                    disqualifiers: {
                        felony: job.requiredCredentials.includes('No Felony'),
                        dui: job.requiredCredentials.includes('No DUI'),
                        suspendedLicense: job.requiredCredentials.includes('No Suspended License'),
                        misdemeanor: job.requiredCredentials.includes('No Misdemeanor'),
                        warrants: job.requiredCredentials.includes('No Warrants')
                    }
                };
                
                // Generate ZKP
                const proof = await zkpVerifier.generateProof(applicantData, jobRequirements);
                
                // Update credential checks
                const credChecks = credentialItemsList.querySelectorAll('.text-yellow-400');
                credChecks.forEach(check => {
                    check.className = 'text-neon-green w-5 h-5 flex items-center justify-center';
                    check.textContent = '✓';
                });
                
                // Show proof result
                zkpResultDisplay.textContent = JSON.stringify(proof, null, 2);
                zkpResultContainer.style.display = 'block';
                
                // Create disclosure summary
                disclosureSummaryContainer.innerHTML = '';
                
                // Add disclosure summary title
                const summaryTitle = document.createElement('h5');
                summaryTitle.className = 'text-md font-bold text-neon-blue mb-3';
                summaryTitle.textContent = 'Trua Profile Data Sharing Summary';
                disclosureSummaryContainer.appendChild(summaryTitle);
                
                // Create two columns for shared and private info
                const summaryColumns = document.createElement('div');
                summaryColumns.className = 'grid md:grid-cols-2 gap-4';
                
                // Shared information column
                const sharedColumn = document.createElement('div');
                sharedColumn.className = 'bg-dark-bg/30 p-4 rounded-lg border border-green-500/30';
                
                const sharedTitle = document.createElement('h6');
                sharedTitle.className = 'text-green-400 font-bold mb-2 text-sm';
                sharedTitle.textContent = 'Trua Profile Data You Are Sharing:';
                sharedColumn.appendChild(sharedTitle);
                
                const sharedList = document.createElement('ul');
                sharedList.className = 'text-green-200 text-xs space-y-1';
                
                // Add ZKP verification as always shared
                const zkpItem = document.createElement('li');
                zkpItem.className = 'flex items-center space-x-2';
                zkpItem.innerHTML = '<span class="text-green-400">✓</span> <span>ZKP Verification of Required Credentials</span>';
                sharedList.appendChild(zkpItem);
                
                // Add selected disclosures
                let hasSharedItems = false;
                disclosureCategories.forEach(category => {
                    if (selectedDisclosures[category.id]) {
                        hasSharedItems = true;
                        const item = document.createElement('li');
                        item.className = 'flex items-center space-x-2';
                        item.innerHTML = `<span class="text-green-400">✓</span> <span>${category.label}</span>`;
                        sharedList.appendChild(item);
                    }
                });
                
                if (!hasSharedItems) {
                    const noExtraItem = document.createElement('li');
                    noExtraItem.className = 'text-green-200/70 italic';
                    noExtraItem.textContent = 'No additional information shared';
                    sharedList.appendChild(noExtraItem);
                }
                
                sharedColumn.appendChild(sharedList);
                summaryColumns.appendChild(sharedColumn);
                
                // Private information column
                const privateColumn = document.createElement('div');
                privateColumn.className = 'bg-dark-bg/30 p-4 rounded-lg border border-red-500/30';
                
                const privateTitle = document.createElement('h6');
                privateTitle.className = 'text-red-400 font-bold mb-2 text-sm';
                privateTitle.textContent = 'Trua Profile Data Kept Private:';
                privateColumn.appendChild(privateTitle);
                
                const privateList = document.createElement('ul');
                privateList.className = 'text-red-200 text-xs space-y-1';
                
                // Add unselected disclosures
                let hasPrivateItems = false;
                disclosureCategories.forEach(category => {
                    if (!selectedDisclosures[category.id]) {
                        hasPrivateItems = true;
                        const item = document.createElement('li');
                        item.className = 'flex items-center space-x-2';
                        item.innerHTML = `<span class="text-red-400">×</span> <span>${category.label}</span>`;
                        privateList.appendChild(item);
                    }
                });
                
                if (!hasPrivateItems) {
                    const allSharedItem = document.createElement('li');
                    allSharedItem.className = 'text-red-200/70 italic';
                    allSharedItem.textContent = 'All information is being shared';
                    privateList.appendChild(allSharedItem);
                }
                
                privateColumn.appendChild(privateList);
                summaryColumns.appendChild(privateColumn);
                
                disclosureSummaryContainer.appendChild(summaryColumns);
                
                // Add privacy note
                const privacyNote = document.createElement('p');
                privacyNote.className = 'text-xs text-blue-300 mt-3';
                privacyNote.innerHTML = '<span class="font-bold">Privacy Protection:</span> Required credentials are verified using Zero-Knowledge Proofs, which confirm you meet the requirements without revealing your actual data. Only the information you explicitly select above will be shared with the employer.';
                disclosureSummaryContainer.appendChild(privacyNote);
                
                // Show disclosure summary
                disclosureSummaryContainer.style.display = 'block';
                
                // Enable apply button
                applyButton.disabled = false;
            } catch (error) {
                console.error('Error auto-verifying credentials:', error);
                JobBoardNotifications.showError('Failed to verify credentials. Please try again.');
            }
        };
        
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
                const did = didSelect.value.trim();
                
                // Get selected disclosure options
                const selectedDisclosures = {};
                disclosureCategories.forEach(category => {
                    const checkbox = document.getElementById(`disclosure-${category.id}`);
                    selectedDisclosures[category.id] = checkbox.checked;
                });
                
                // Submit application with selective disclosure
                const applicationData = {
                    jobId: job.id,
                    applicantDid: did,
                    timestamp: new Date().toISOString(),
                    zkpVerified: true,
                    disclosures: selectedDisclosures
                };
                
                console.log('Submitting application with selective disclosure:', applicationData);
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                JobBoardNotifications.showNotification('Application submitted successfully!', 'success');
                
                // Close current modal
                modalContainer.remove();
                
                // Show confirmation modal
                ApplicationModal.showConfirmationModal(job);
                
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
    
    /**
     * Show a confirmation modal after successful application submission
     * @param {Object} job - The job data
     */
    static showConfirmationModal(job) {
        // Create modal container
        const confirmationModalContainer = document.createElement('div');
        confirmationModalContainer.id = 'confirmation-modal-container';
        confirmationModalContainer.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'glass-card rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto neon-border';
        
        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'flex justify-between items-start mb-6';
        
        // Modal title
        const modalTitle = document.createElement('h3');
        modalTitle.className = 'text-2xl font-bold text-neon-green';
        modalTitle.textContent = 'Application Accepted!';
        modalHeader.appendChild(modalTitle);
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'text-blue-300 hover:text-neon-blue text-xl';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            confirmationModalContainer.remove();
        });
        modalHeader.appendChild(closeButton);
        
        modalContent.appendChild(modalHeader);
        
        // Confirmation message
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'mb-6 p-6 bg-dark-bg/50 rounded-lg text-center';
        
        const messageIcon = document.createElement('div');
        messageIcon.className = 'text-5xl mb-4 text-neon-green';
        messageIcon.innerHTML = '✓';
        confirmationMessage.appendChild(messageIcon);
        
        const messageTitle = document.createElement('h4');
        messageTitle.className = 'text-xl font-bold text-neon-green mb-2';
        messageTitle.textContent = `Thank you for applying to ${job.title} at ${job.company}!`;
        confirmationMessage.appendChild(messageTitle);
        
        const messageText = document.createElement('p');
        messageText.className = 'text-blue-100 mb-4';
        messageText.innerHTML = `Your application has been received and is being processed. The employer will review your credentials and contact you if they wish to proceed with your application.<br><br>Your privacy is protected through our Zero-Knowledge Proof technology, ensuring that only the information you chose to share is visible to the employer.`;
        confirmationMessage.appendChild(messageText);
        
        modalContent.appendChild(confirmationMessage);
        
        // Next steps
        const nextSteps = document.createElement('div');
        nextSteps.className = 'mb-6 p-4 bg-dark-bg/50 rounded-lg';
        
        const nextStepsTitle = document.createElement('h5');
        nextStepsTitle.className = 'text-md font-bold text-neon-blue mb-3';
        nextStepsTitle.textContent = 'What happens next?';
        nextSteps.appendChild(nextStepsTitle);
        
        const stepsList = document.createElement('ul');
        stepsList.className = 'space-y-2 text-blue-100';
        
        const steps = [
            'The employer will review your application and verified credentials',
            'If interested, they will contact you using the communication method in your DID',
            'You may be asked to provide additional information or schedule an interview',
            'All further communication will maintain the same level of privacy protection'
        ];
        
        steps.forEach(step => {
            const stepItem = document.createElement('li');
            stepItem.className = 'flex items-start space-x-2';
            stepItem.innerHTML = `<span class="text-neon-blue">•</span> <span>${step}</span>`;
            stepsList.appendChild(stepItem);
        });
        
        nextSteps.appendChild(stepsList);
        modalContent.appendChild(nextSteps);
        
        // Return to job board button
        const returnButton = document.createElement('button');
        returnButton.type = 'button';
        returnButton.className = 'w-full bg-neon-gradient text-dark-bg py-3 rounded-lg font-bold hover:scale-105 transition-transform';
        returnButton.textContent = 'Return to Job Board';
        returnButton.addEventListener('click', () => {
            confirmationModalContainer.remove();
        });
        
        modalContent.appendChild(returnButton);
        
        confirmationModalContainer.appendChild(modalContent);
        
        // Add to body
        document.body.appendChild(confirmationModalContainer);
    }
}

// Export the ApplicationModal class
window.ApplicationModal = ApplicationModal;

// Log that the ApplicationModal component is loaded
console.log('ApplicationModal component loaded');