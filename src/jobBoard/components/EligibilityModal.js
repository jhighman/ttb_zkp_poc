// EligibilityModal Component
// This component is responsible for handling the job eligibility check process

class EligibilityModal {
    /**
     * Show the eligibility modal for a job
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
        modalContainer.id = 'eligibility-modal-container';
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
        modalTitle.textContent = `Check Eligibility for ${job.title} at ${job.company}`;
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
        
        // Eligibility check form
        const eligibilityForm = document.createElement('form');
        eligibilityForm.id = 'eligibility-form';
        eligibilityForm.className = 'space-y-6';
        
        // DID selection
        const didGroup = document.createElement('div');
        
        const didLabel = document.createElement('label');
        didLabel.className = 'block text-blue-300 mb-2';
        didLabel.htmlFor = 'applicant-did';
        didLabel.textContent = 'Select Your Decentralized Identifier (DID)';
        didGroup.appendChild(didLabel);
        
        // Get available DIDs and log them for debugging
        const holderDids = didService.getHolderDids();
        console.log('Available DIDs for dropdown:', holderDids);
        
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
        
        eligibilityForm.appendChild(didGroup);
        
        // Check eligibility button
        const checkEligibilityButton = document.createElement('button');
        checkEligibilityButton.type = 'button';
        checkEligibilityButton.id = 'check-eligibility-button';
        checkEligibilityButton.className = 'w-full bg-neon-gradient text-dark-bg py-3 rounded-lg font-bold hover:scale-105 transition-transform';
        checkEligibilityButton.textContent = 'Check Eligibility with ZKP';
        checkEligibilityButton.addEventListener('click', async () => {
            const did = didSelect.value.trim();
            if (!did) {
                JobBoardNotifications.showError('Please select your DID');
                return;
            }
            
            // Show loading state
            checkEligibilityButton.disabled = true;
            checkEligibilityButton.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Checking...';
            
            try {
                // Fetch DID document
                const didDocument = await didService.fetchDidDocument(did);
                console.log('Fetched DID document:', didDocument);
                
                // Extract applicant data from DID document
                const applicantData = {
                    did: did,
                    profile: didDocument.profile || {
                        truaScore: 0,
                        disqualifiers: {
                            felony: false,
                            dui: false,
                            suspendedLicense: false,
                            misdemeanor: false,
                            warrants: false
                        }
                    }
                };
                console.log('Applicant data:', applicantData);
                
                // Extract job requirements
                const jobRequirements = {
                    minTruaScore: 270, // Default value
                    disqualifiers: {
                        felony: job.requiredCredentials.includes('No Felony'),
                        dui: job.requiredCredentials.includes('No DUI'),
                        // For suspendedLicense, we're checking if the job requires a valid license
                        // If it does, then having a suspended license would be a disqualifier
                        suspendedLicense: job.requiredCredentials.includes('Valid License'),
                        misdemeanor: job.requiredCredentials.includes('No Misdemeanor'),
                        warrants: job.requiredCredentials.includes('No Warrants')
                    }
                };
                
                // Log detailed information for debugging
                console.log('Job requirements (detailed):');
                console.log('- Minimum TruaScore:', jobRequirements.minTruaScore);
                console.log('- No Felony required:', jobRequirements.disqualifiers.felony);
                console.log('- No DUI required:', jobRequirements.disqualifiers.dui);
                console.log('- Valid License required:', jobRequirements.disqualifiers.suspendedLicense);
                console.log('- No Misdemeanor required:', jobRequirements.disqualifiers.misdemeanor);
                console.log('- No Warrants required:', jobRequirements.disqualifiers.warrants);
                
                console.log('Applicant profile (detailed):');
                console.log('- TruaScore:', applicantData.profile.truaScore);
                console.log('- Has Felony:', applicantData.profile.disqualifiers.felony);
                console.log('- Has DUI:', applicantData.profile.disqualifiers.dui);
                console.log('- Has Suspended License:', applicantData.profile.disqualifiers.suspendedLicense);
                console.log('- Has Misdemeanor:', applicantData.profile.disqualifiers.misdemeanor);
                console.log('- Has Warrants:', applicantData.profile.disqualifiers.warrants);
                
                console.log('Job requirements:', jobRequirements);
                console.log('Applicant data:', applicantData);
                console.log('Job requirements:', jobRequirements);
                console.log('Required credentials:', job.requiredCredentials);
                
                // Generate ZKP proof
                const proofResult = await zkpVerifier.generateProof(applicantData, jobRequirements);
                console.log('Proof result:', proofResult);
                
                // Display eligibility result
                eligibilityResultContainer.style.display = 'block';
                
                if (proofResult.isEligible) {
                    eligibilityStatus.textContent = 'Eligible';
                    eligibilityStatus.className = 'text-green-400 font-bold';
                    
                    // Build qualification details for demo purposes
                    const qualificationDetails = [];
                    
                    // TruaScore
                    qualificationDetails.push(`TruaScore (${applicantData.profile.truaScore}) exceeds minimum requirement (${jobRequirements.minTruaScore})`);
                    
                    // Background checks
                    if (jobRequirements.disqualifiers.felony && !applicantData.profile.disqualifiers.felony) {
                        qualificationDetails.push('No felony convictions (required)');
                    }
                    
                    if (jobRequirements.disqualifiers.misdemeanor && !applicantData.profile.disqualifiers.misdemeanor) {
                        qualificationDetails.push('No misdemeanor convictions (required)');
                    }
                    
                    if (jobRequirements.disqualifiers.dui && !applicantData.profile.disqualifiers.dui) {
                        qualificationDetails.push('No DUI record (required)');
                    }
                    
                    if (jobRequirements.disqualifiers.suspendedLicense && !applicantData.profile.disqualifiers.suspendedLicense) {
                        qualificationDetails.push('Valid driver\'s license (required)');
                    }
                    
                    if (!applicantData.profile.disqualifiers.warrants) {
                        qualificationDetails.push('No outstanding warrants');
                    }
                    
                    // We no longer need to build qualification details HTML here
                    // as it's now included in the Zero-Knowledge Privacy section
                    let qualificationDetailsHtml = '';
                    
                    eligibilityResultContent.innerHTML = `
                        <div class="bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/50 rounded-xl p-6 text-center">
                            <div class="text-6xl mb-4">✅</div>
                            <h3 class="text-3xl font-bold text-green-400 mb-4 font-mono">ELIGIBLE</h3>
                            <p class="text-green-200 text-lg mb-4">You meet all job requirements!</p>
                            <div class="bg-white/5 rounded-lg p-4 text-sm">
                                <h5 class="font-bold text-green-300 mb-3 font-mono">Privacy-Preserving Result:</h5>
                                <p class="text-green-200 mb-3">
                                    The Zero-Knowledge Proof has verified you meet all requirements
                                    without revealing your specific qualifications or background details.
                                </p>
                                <div class="space-y-2 mt-2 font-mono">
                                    <div class="flex items-center justify-center space-x-2">
                                        <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                                        <span>TruaScore requirement satisfied</span>
                                    </div>
                                    <div class="flex items-center justify-center space-x-2">
                                        <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                                        <span>All background requirements verified</span>
                                    </div>
                                </div>
                                ${qualificationDetailsHtml}
                            </div>
                        </div>
                    `;
                } else {
                    eligibilityStatus.textContent = 'Not Eligible';
                    eligibilityStatus.className = 'text-red-400 font-bold';
                    
                    // We no longer need to build disqualification reasons HTML here
                    // as it's now included in the Zero-Knowledge Privacy section
                    let disqualificationReasonsHtml = '';
                    
                    eligibilityResultContent.innerHTML = `
                        <div class="bg-gradient-to-r from-red-400/20 to-pink-500/20 border border-red-400/50 rounded-xl p-6 text-center">
                            <div class="text-6xl mb-4">❌</div>
                            <h3 class="text-3xl font-bold text-red-400 mb-4 font-mono">NOT ELIGIBLE</h3>
                            <p class="text-red-200 text-lg mb-4">You do not meet all job requirements.</p>
                            <div class="bg-white/5 rounded-lg p-4 text-sm">
                                <h5 class="font-bold text-red-300 mb-3 font-mono">Privacy-Preserving Result:</h5>
                                <p class="text-red-200 mb-3">
                                    The Zero-Knowledge Proof has determined you don't meet one or more job requirements,
                                    without revealing which specific requirement wasn't met.
                                </p>
                                <div class="flex items-center justify-center space-x-2 mt-2 font-mono">
                                    <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                                    <span>Requirements verification failed</span>
                                </div>
                                ${disqualificationReasonsHtml}
                            </div>
                        </div>
                    `;
                }
                
                // Add enhanced privacy explanation with DID-specific details
                const privacyExplanation = document.createElement('div');
                privacyExplanation.className = 'mt-6 bg-glass rounded-xl p-6 border border-neon-blue/30';
                
                // Prepare DID-specific details for the privacy explanation
                let didSpecificDetails = '';
                
                if (proofResult.isEligible) {
                    // For eligible applicants, show qualification details
                    const qualificationDetails = [];
                    
                    // TruaScore
                    qualificationDetails.push(`TruaScore (${applicantData.profile.truaScore}) exceeds minimum requirement (${jobRequirements.minTruaScore})`);
                    
                    // Background checks
                    if (jobRequirements.disqualifiers.felony && !applicantData.profile.disqualifiers.felony) {
                        qualificationDetails.push('No felony convictions (required)');
                    }
                    
                    if (jobRequirements.disqualifiers.misdemeanor && !applicantData.profile.disqualifiers.misdemeanor) {
                        qualificationDetails.push('No misdemeanor convictions (required)');
                    }
                    
                    if (jobRequirements.disqualifiers.dui && !applicantData.profile.disqualifiers.dui) {
                        qualificationDetails.push('No DUI record (required)');
                    }
                    
                    if (jobRequirements.disqualifiers.suspendedLicense && !applicantData.profile.disqualifiers.suspendedLicense) {
                        qualificationDetails.push('Valid driver\'s license (required)');
                    }
                    
                    if (!applicantData.profile.disqualifiers.warrants) {
                        qualificationDetails.push('No outstanding warrants');
                    }
                    
                    if (qualificationDetails.length > 0) {
                        didSpecificDetails = `
                            <div class="mt-6 bg-green-400/10 rounded-lg p-4 text-left">
                                <h5 class="font-bold text-green-300 mb-2 font-mono">Your Qualification Details (Demo Only):</h5>
                                <ul class="text-green-200 text-sm space-y-1 list-disc pl-5">
                                    ${qualificationDetails.map(detail => `<li>${detail}</li>`).join('')}
                                </ul>
                                <p class="text-xs text-green-300 mt-2 italic">
                                    Note: In a real ZKP implementation, these specific details would remain private.
                                    This information is shown for demonstration purposes only.
                                </p>
                            </div>
                        `;
                    }
                } else {
                    // For ineligible applicants, show disqualification reasons
                    const disqualificationReasons = [];
                    
                    // Check TruaScore
                    if (applicantData.profile.truaScore < jobRequirements.minTruaScore) {
                        disqualificationReasons.push(`TruaScore (${applicantData.profile.truaScore}) below minimum requirement (${jobRequirements.minTruaScore})`);
                    }
                    
                    // Check disqualifiers
                    if (jobRequirements.disqualifiers.felony && applicantData.profile.disqualifiers.felony) {
                        disqualificationReasons.push('Felony conviction present (job requires no felonies)');
                    }
                    
                    if (jobRequirements.disqualifiers.misdemeanor && applicantData.profile.disqualifiers.misdemeanor) {
                        disqualificationReasons.push('Misdemeanor conviction present (job requires no misdemeanors)');
                    }
                    
                    if (jobRequirements.disqualifiers.dui && applicantData.profile.disqualifiers.dui) {
                        disqualificationReasons.push('DUI record present (job requires no DUIs)');
                    }
                    
                    if (jobRequirements.disqualifiers.suspendedLicense && applicantData.profile.disqualifiers.suspendedLicense) {
                        disqualificationReasons.push('Suspended license (job requires valid license)');
                    }
                    
                    if (applicantData.profile.disqualifiers.warrants) {
                        disqualificationReasons.push('Outstanding warrants present (automatic disqualifier)');
                    }
                    
                    if (disqualificationReasons.length > 0) {
                        didSpecificDetails = `
                            <div class="mt-6 bg-red-400/10 rounded-lg p-4 text-left">
                                <h5 class="font-bold text-red-300 mb-2 font-mono">Your Disqualification Reasons (Demo Only):</h5>
                                <ul class="text-red-200 text-sm space-y-1 list-disc pl-5">
                                    ${disqualificationReasons.map(reason => `<li>${reason}</li>`).join('')}
                                </ul>
                                <p class="text-xs text-red-300 mt-2 italic">
                                    Note: In a real ZKP implementation, these specific reasons would remain private.
                                    This information is shown for demonstration purposes only.
                                </p>
                            </div>
                        `;
                    }
                }
                
                privacyExplanation.innerHTML = `
                    <div class="flex items-center space-x-3 mb-4">
                        <span class="text-3xl">🔐</span>
                        <h4 class="text-xl font-bold text-neon-blue font-mono">Zero-Knowledge Privacy</h4>
                    </div>
                    
                    <p class="text-blue-200 mb-4">
                        This eligibility check uses Zero-Knowledge Proofs (ZKPs) to protect your privacy while verifying your qualifications.
                    </p>
                    
                    <div class="bg-white/5 rounded-lg p-4 mb-4">
                        <h5 class="font-bold text-neon-blue mb-3 font-mono">How It Works:</h5>
                        <ol class="space-y-3 text-blue-200">
                            <li class="flex items-start">
                                <span class="bg-neon-blue text-dark-bg rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                                <div>
                                    <span class="font-bold">You control your data</span>
                                    <p class="text-sm text-blue-300">Your sensitive information stays in your DID document and is never shared with employers.</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <span class="bg-neon-blue text-dark-bg rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                                <div>
                                    <span class="font-bold">Mathematical proof generation</span>
                                    <p class="text-sm text-blue-300">A cryptographic proof is created that verifies you meet the requirements without revealing your actual data.</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <span class="bg-neon-blue text-dark-bg rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                                <div>
                                    <span class="font-bold">Verification without exposure</span>
                                    <p class="text-sm text-blue-300">The employer can verify the proof is valid without learning anything about your private information.</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-4 text-sm">
                        <div class="bg-white/5 rounded-lg p-4">
                            <h5 class="font-bold text-green-400 mb-2 font-mono">✅ What Employer Learns:</h5>
                            <ul class="space-y-2 text-green-200">
                                <li class="flex items-start">
                                    <span class="w-4 h-4 bg-green-400/20 border border-green-400 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">✓</span>
                                    <span>You are eligible for the job (yes/no)</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-4 h-4 bg-green-400/20 border border-green-400 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">✓</span>
                                    <span>The proof was mathematically verified</span>
                                </li>
                            </ul>
                        </div>
                        <div class="bg-white/5 rounded-lg p-4">
                            <h5 class="font-bold text-red-400 mb-2 font-mono">🔒 What Remains Private:</h5>
                            <ul class="space-y-2 text-red-200">
                                <li class="flex items-start">
                                    <span class="w-4 h-4 bg-red-400/20 border border-red-400 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">×</span>
                                    <span>Your exact TruaScore (${applicantData.profile.truaScore})</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-4 h-4 bg-red-400/20 border border-red-400 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">×</span>
                                    <span>Specific disqualifiers in your record (felonies, misdemeanors, etc.)</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-4 h-4 bg-red-400/20 border border-red-400 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">×</span>
                                    <span>Which specific requirement caused disqualification</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-4 h-4 bg-red-400/20 border border-red-400 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">×</span>
                                    <span>Details about your criminal history, driving record, or background</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    ${didSpecificDetails}
                    
                    <div class="mt-4 bg-neon-blue/10 rounded-lg p-3 border border-neon-blue/30">
                        <p class="text-center text-sm text-neon-blue font-mono">
                            "Prove without revealing" — The power of Zero-Knowledge Proofs
                        </p>
                    </div>
                `;
                
                eligibilityResultContent.appendChild(privacyExplanation);
                
                // Show apply button if eligible
                if (proofResult.isEligible) {
                    applyButton.style.display = 'block';
                }
                
                // Reset check button
                checkEligibilityButton.disabled = false;
                checkEligibilityButton.textContent = 'Check Eligibility with ZKP';
                
            } catch (error) {
                console.error('Error checking eligibility:', error);
                JobBoardNotifications.showError('Failed to check eligibility. Please try again.');
                
                // Reset button
                checkEligibilityButton.disabled = false;
                checkEligibilityButton.textContent = 'Check Eligibility with ZKP';
            }
        });
        
        eligibilityForm.appendChild(checkEligibilityButton);
        
        // Eligibility result container (hidden initially)
        const eligibilityResultContainer = document.createElement('div');
        eligibilityResultContainer.className = 'mt-6 p-4 bg-dark-bg/50 rounded-lg';
        eligibilityResultContainer.style.display = 'none';
        
        const eligibilityResultHeader = document.createElement('div');
        eligibilityResultHeader.className = 'flex items-center justify-between mb-4';
        
        const eligibilityResultTitle = document.createElement('div');
        eligibilityResultTitle.className = 'text-blue-300 font-bold';
        eligibilityResultTitle.textContent = 'Eligibility Result:';
        eligibilityResultHeader.appendChild(eligibilityResultTitle);
        
        const eligibilityStatus = document.createElement('div');
        eligibilityStatus.className = 'text-yellow-400 font-bold';
        eligibilityStatus.textContent = 'Checking...';
        eligibilityResultHeader.appendChild(eligibilityStatus);
        
        eligibilityResultContainer.appendChild(eligibilityResultHeader);
        
        const eligibilityResultContent = document.createElement('div');
        eligibilityResultContainer.appendChild(eligibilityResultContent);
        
        eligibilityForm.appendChild(eligibilityResultContainer);
        
        // Apply button (hidden initially)
        const applyButton = document.createElement('button');
        applyButton.type = 'button';
        applyButton.className = 'w-full bg-neon-gradient text-dark-bg py-3 rounded-lg font-bold hover:scale-105 transition-transform mt-6';
        applyButton.textContent = 'Apply for This Job';
        applyButton.style.display = 'none';
        applyButton.addEventListener('click', () => {
            // Close this modal
            modalContainer.remove();
            
            // Show application modal
            ApplicationModal.show(job, zkpVerifier, didService);
        });
        
        eligibilityForm.appendChild(applyButton);
        
        modalContent.appendChild(eligibilityForm);
        modalContainer.appendChild(modalContent);
        
        // Add to body
        document.body.appendChild(modalContainer);
        
        // Focus on DID select
        setTimeout(() => {
            didSelect.focus();
        }, 100);
    }
}

// Export the EligibilityModal class
window.EligibilityModal = EligibilityModal;

// Log that the EligibilityModal component is loaded
console.log('EligibilityModal component loaded');