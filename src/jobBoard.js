// Job Board Component for ZKP Job Eligibility Demo
// This component will interact with the backend APIs to display job listings

class JobBoard {
    constructor() {
        this.jobs = [];
        this.apiBaseUrl = 'http://localhost:5050/api';
        this.currentApplicant = null;
        this.zkpVerifier = null; // Will be set after initialization
    }

    // Initialize the job board
    async init() {
        try {
            // Create container for job board
            const mainContent = document.getElementById('main-content') || document.body;
            
            const jobBoardContainer = document.createElement('div');
            jobBoardContainer.id = 'job-board-container';
            jobBoardContainer.className = 'glass-card rounded-2xl p-8 neon-border mb-12';
            
            // Add header with title and create job button
            const headerDiv = document.createElement('div');
            headerDiv.className = 'flex justify-between items-center mb-8';
            
            // Add title
            const title = document.createElement('h2');
            title.className = 'text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent font-mono';
            title.textContent = '🔍 Job Listings';
            headerDiv.appendChild(title);
            
            // Add create job button
            const createJobButton = document.createElement('button');
            createJobButton.id = 'create-job-button';
            createJobButton.className = 'bg-neon-gradient text-dark-bg px-4 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform flex items-center space-x-2';
            createJobButton.innerHTML = '<span>➕</span><span>Create Job</span>';
            createJobButton.addEventListener('click', () => this.showCreateJobModal());
            headerDiv.appendChild(createJobButton);
            
            jobBoardContainer.appendChild(headerDiv);
            
            // Add job listings container
            const jobListingsContainer = document.createElement('div');
            jobListingsContainer.id = 'job-listings';
            jobListingsContainer.className = 'space-y-6';
            jobBoardContainer.appendChild(jobListingsContainer);
            
            // Add loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'job-loading';
            loadingIndicator.className = 'flex justify-center items-center py-8';
            loadingIndicator.innerHTML = `
                <div class="w-12 h-12 border-4 border-neon-blue/30 border-t-neon-blue rounded-full"></div>
                <span class="ml-4 text-neon-blue font-mono">Loading jobs...</span>
            `;
            jobListingsContainer.appendChild(loadingIndicator);
            
            // Add to main content
            mainContent.appendChild(jobBoardContainer);
            
            // Fetch jobs from API
            await this.fetchJobs();
            
            // Add event listeners
            this.addEventListeners();
        } catch (error) {
            console.error('Error initializing job board:', error);
            this.showError('Failed to initialize job board. Please try again later.');
        }
    }
    
    // Fetch jobs from API
    async fetchJobs() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/jobs`);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            this.jobs = await response.json();
            this.renderJobs();
        } catch (error) {
            console.error('Error fetching jobs:', error);
            
            // For demo purposes, use sample data if API fails
            this.useSampleData();
            this.renderJobs();
        }
    }
    
    // Use sample data for demo purposes
    useSampleData() {
        this.jobs = [
            {
                _id: '1',
                title: 'Senior Software Engineer',
                company: 'Trua Technologies',
                location: 'Remote',
                type: 'Full-time',
                description: 'Join our team to build privacy-preserving verification systems using Zero-Knowledge Proofs.',
                salary: {
                    min: 120000,
                    max: 180000,
                    currency: 'USD'
                },
                requirements: {
                    minTruaScore: 300,
                    disqualifiers: {
                        felony: true,
                        dui: false,
                        suspendedLicense: false,
                        misdemeanor: false,
                        warrants: true
                    }
                },
                skills: ['JavaScript', 'Node.js', 'ZKP', 'Cryptography'],
                postedDate: new Date('2025-07-15').toISOString(),
                expiryDate: new Date('2025-08-15').toISOString(),
                status: 'Active',
                applications: 5,
                views: 120
            },
            {
                _id: '2',
                title: 'Blockchain Developer',
                company: 'CryptoTrust Inc.',
                location: 'San Francisco, CA',
                type: 'Full-time',
                description: 'Develop and implement blockchain solutions for our financial services clients.',
                salary: {
                    min: 130000,
                    max: 190000,
                    currency: 'USD'
                },
                requirements: {
                    minTruaScore: 280,
                    disqualifiers: {
                        felony: true,
                        dui: false,
                        suspendedLicense: false,
                        misdemeanor: false,
                        warrants: true
                    }
                },
                skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'JavaScript'],
                postedDate: new Date('2025-07-10').toISOString(),
                expiryDate: new Date('2025-08-10').toISOString(),
                status: 'Active',
                applications: 8,
                views: 95
            },
            {
                _id: '3',
                title: 'Privacy Engineer',
                company: 'SecureData Systems',
                location: 'Boston, MA',
                type: 'Full-time',
                description: 'Design and implement privacy-preserving systems for sensitive data handling.',
                salary: {
                    min: 110000,
                    max: 160000,
                    currency: 'USD'
                },
                requirements: {
                    minTruaScore: 290,
                    disqualifiers: {
                        felony: true,
                        dui: true,
                        suspendedLicense: true,
                        misdemeanor: false,
                        warrants: true
                    }
                },
                skills: ['Cryptography', 'Data Privacy', 'Python', 'C++'],
                postedDate: new Date('2025-07-05').toISOString(),
                expiryDate: new Date('2025-08-05').toISOString(),
                status: 'Active',
                applications: 3,
                views: 78
            }
        ];
    }
    
    // Render jobs in the UI
    renderJobs() {
        const jobListingsContainer = document.getElementById('job-listings');
        
        // Remove loading indicator
        const loadingIndicator = document.getElementById('job-loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        // Clear existing jobs
        jobListingsContainer.innerHTML = '';
        
        if (this.jobs.length === 0) {
            const noJobsMessage = document.createElement('div');
            noJobsMessage.className = 'text-center py-8 text-blue-300';
            noJobsMessage.textContent = 'No jobs found. Please check back later.';
            jobListingsContainer.appendChild(noJobsMessage);
            return;
        }
        
        // Add each job
        this.jobs.forEach(job => {
            const jobCard = this.createJobCard(job);
            jobListingsContainer.appendChild(jobCard);
        });
    }
    
    // Create a job card element
    createJobCard(job) {
        const jobCard = document.createElement('div');
        jobCard.className = 'bg-glass rounded-xl p-6 border border-white/10';
        jobCard.dataset.jobId = job._id;
        
        // Format salary
        const salaryRange = `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`;
        
        // Format posted date
        const postedDate = new Date(job.postedDate);
        const postedDateStr = postedDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        jobCard.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-2xl font-bold text-white mb-1">${job.title}</h3>
                    <p class="text-blue-300">${job.company} • ${job.location}</p>
                </div>
                <div class="bg-neon-gradient text-dark-bg px-3 py-1 rounded-lg font-mono text-sm">
                    ${job.type}
                </div>
            </div>
            
            <p class="text-blue-200 mb-4">${job.description}</p>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-white/5 rounded-lg p-3">
                    <div class="text-xs text-blue-300 mb-1">Salary Range</div>
                    <div class="text-white font-mono">${salaryRange}</div>
                </div>
                <div class="bg-white/5 rounded-lg p-3">
                    <div class="text-xs text-blue-300 mb-1">Min TruaScore</div>
                    <div class="text-white font-mono">${job.requirements.minTruaScore} / 360</div>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="text-xs text-blue-300 mb-2">Required Skills</div>
                <div class="flex flex-wrap gap-2">
                    ${job.skills.map(skill => `
                        <span class="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs">${skill}</span>
                    `).join('')}
                </div>
            </div>
            
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <div class="text-xs text-blue-300">Posted ${postedDateStr}</div>
                <button class="apply-button bg-neon-gradient text-dark-bg px-4 py-2 rounded-lg font-bold text-sm">
                    Apply with ZKP
                </button>
            </div>
        `;
        
        return jobCard;
    }
    
    // Add event listeners
    addEventListeners() {
        document.addEventListener('click', event => {
            if (event.target.classList.contains('apply-button') || 
                event.target.closest('.apply-button')) {
                const button = event.target.classList.contains('apply-button') ? 
                    event.target : event.target.closest('.apply-button');
                const jobCard = button.closest('[data-job-id]');
                const jobId = jobCard.dataset.jobId;
                this.handleApplyClick(jobId);
            }
        });
    }
    
    // Handle apply button click
    async handleApplyClick(jobId) {
        const job = this.jobs.find(j => j._id === jobId);
        if (!job) return;
        
        // Create and show the application modal
        this.showApplicationModal(job);
    }
    
    // Show application modal
    showApplicationModal(job) {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'zkp-application-modal';
        modalContainer.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/70 p-4';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'glass-card rounded-2xl p-6 neon-border max-w-2xl w-full mx-auto relative overflow-y-auto max-h-[80vh]';
        
        // Create header with close button
        const modalHeader = document.createElement('div');
        modalHeader.className = 'flex justify-between items-center mb-4 pb-3 border-b border-white/10 sticky top-0 bg-card-bg z-10';
        modalHeader.innerHTML = `
            <h3 class="text-xl font-bold text-white">Apply with Zero-Knowledge Proof</h3>
        `;
        
        // Create a subtle close button
        const closeButton = document.createElement('button');
        closeButton.className = 'text-white/70 hover:text-white px-2 py-1 rounded text-sm flex items-center transition-colors';
        closeButton.innerHTML = '<span class="mr-1">✕</span> Close';
        
        // Add the close button to the header
        modalHeader.appendChild(closeButton);
        
        // Add event listener to close button
        closeButton.addEventListener('click', () => {
            console.log('Close button clicked');
            modalContainer.remove();
        });
        
        // Also allow clicking outside the modal to close it
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                console.log('Outside modal clicked');
                modalContainer.remove();
            }
        });
        
        // Add the header to the modal content
        modalContent.appendChild(modalHeader);
        
        // Add job details to the header
        const jobDetails = document.createElement('p');
        jobDetails.className = 'text-blue-300 mt-2';
        jobDetails.textContent = `Job: ${job.title} at ${job.company}`;
        modalHeader.appendChild(jobDetails);
        
        // Create applicant selection section
        const applicantSection = document.createElement('div');
        applicantSection.className = 'mb-6';
        applicantSection.innerHTML = `
            <h4 class="text-lg font-bold text-white mb-3">Select Your Profile</h4>
            <div class="bg-glass rounded-xl p-4 border border-white/10 mb-4">
                <select id="applicant-select" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono">
                    <option value="0">👍 Applicant A: Score=320, No disqualifiers</option>
                    <option value="1">⚠️ Applicant B: Score=250, Has DUI</option>
                    <option value="2">❌ Applicant C: Score=290, Has felony</option>
                    <option value="3">✅ Applicant D: Score=340, Has old misdemeanor</option>
                    <option value="4">🚫 Applicant E: Score=180, Multiple issues</option>
                </select>
            </div>
            <div id="applicant-details" class="bg-white/5 rounded-lg p-4 text-sm text-blue-200">
                <p>Select an applicant profile to see details</p>
            </div>
        `;
        
        // Create ZKP verification section
        const zkpSection = document.createElement('div');
        zkpSection.className = 'mb-6';
        zkpSection.innerHTML = `
            <h4 class="text-lg font-bold text-white mb-3">Zero-Knowledge Proof Verification</h4>
            <div class="bg-glass rounded-xl p-4 border border-white/10">
                <p class="text-blue-200 mb-4">
                    This will generate a cryptographic proof that you meet the job requirements without revealing your actual TruaScore or disqualifier details.
                </p>
                <div id="zkp-status" class="hidden mb-4 p-4 rounded-lg"></div>
                <button id="generate-proof-btn" class="w-full bg-neon-gradient text-dark-bg px-4 py-3 rounded-lg font-bold hover:scale-105 transition-transform">
                    Generate ZKP Proof
                </button>
            </div>
        `;
        
        // Add content to modal
        modalContent.appendChild(applicantSection);
        modalContent.appendChild(zkpSection);
        
        // Add modal to container
        modalContainer.appendChild(modalContent);
        
        // Add to document
        document.body.appendChild(modalContainer);
        
        // Add event listeners
        this.addModalEventListeners(job);
        
        // No bottom close button needed anymore
        
        // Add a keyboard event listener to close on Escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                console.log('Escape key pressed');
                modalContainer.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }
    
    // Add event listeners to the application modal
    addModalEventListeners(job) {
        // Applicant selection
        const applicantSelect = document.getElementById('applicant-select');
        const applicantDetails = document.getElementById('applicant-details');
        
        // Generate proof button
        const generateProofBtn = document.getElementById('generate-proof-btn');
        const zkpStatus = document.getElementById('zkp-status');
        
        // Applicant profiles (same as in the ZKP demo)
        const applicantProfiles = [
            {
                id: '1',
                name: "Applicant A",
                email: "applicanta@example.com",
                profile: {
                    truaScore: 320,
                    disqualifiers: {
                        felony: false,
                        dui: false,
                        suspendedLicense: false,
                        misdemeanor: false,
                        warrants: false
                    }
                }
            },
            {
                id: '2',
                name: "Applicant B",
                email: "applicantb@example.com",
                profile: {
                    truaScore: 250,
                    disqualifiers: {
                        felony: false,
                        dui: true,
                        suspendedLicense: false,
                        misdemeanor: false,
                        warrants: false
                    }
                }
            },
            {
                id: '3',
                name: "Applicant C",
                email: "applicantc@example.com",
                profile: {
                    truaScore: 290,
                    disqualifiers: {
                        felony: true,
                        dui: false,
                        suspendedLicense: false,
                        misdemeanor: false,
                        warrants: false
                    }
                }
            },
            {
                id: '4',
                name: "Applicant D",
                email: "applicantd@example.com",
                profile: {
                    truaScore: 340,
                    disqualifiers: {
                        felony: false,
                        dui: false,
                        suspendedLicense: false,
                        misdemeanor: true,
                        warrants: false
                    }
                }
            },
            {
                id: '5',
                name: "Applicant E",
                email: "applicante@example.com",
                profile: {
                    truaScore: 180,
                    disqualifiers: {
                        felony: true,
                        dui: true,
                        suspendedLicense: false,
                        misdemeanor: true,
                        warrants: true
                    }
                }
            }
        ];
        
        // Update applicant details when selection changes
        applicantSelect.addEventListener('change', () => {
            const selectedIndex = parseInt(applicantSelect.value);
            const applicant = applicantProfiles[selectedIndex];
            
            // Update applicant details
            applicantDetails.innerHTML = `
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-blue-300">Name:</span>
                        <span class="text-white">${applicant.name}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-blue-300">TruaScore:</span>
                        <span class="text-white">${applicant.profile.truaScore} / 360</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-blue-300">Felony:</span>
                        <span class="${applicant.profile.disqualifiers.felony ? 'text-red-400' : 'text-green-400'}">
                            ${applicant.profile.disqualifiers.felony ? 'Yes' : 'No'}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-blue-300">DUI:</span>
                        <span class="${applicant.profile.disqualifiers.dui ? 'text-red-400' : 'text-green-400'}">
                            ${applicant.profile.disqualifiers.dui ? 'Yes' : 'No'}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-blue-300">Suspended License:</span>
                        <span class="${applicant.profile.disqualifiers.suspendedLicense ? 'text-red-400' : 'text-green-400'}">
                            ${applicant.profile.disqualifiers.suspendedLicense ? 'Yes' : 'No'}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-blue-300">Misdemeanor:</span>
                        <span class="${applicant.profile.disqualifiers.misdemeanor ? 'text-red-400' : 'text-green-400'}">
                            ${applicant.profile.disqualifiers.misdemeanor ? 'Yes' : 'No'}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-blue-300">Warrants:</span>
                        <span class="${applicant.profile.disqualifiers.warrants ? 'text-red-400' : 'text-green-400'}">
                            ${applicant.profile.disqualifiers.warrants ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-white/10">
                    <div class="text-xs text-blue-300 mb-2">Note: This information is private and will not be shared with the employer.</div>
                </div>
            `;
        });
        
        // Trigger change event to populate initial details
        applicantSelect.dispatchEvent(new Event('change'));
        
        // Generate proof button click
        generateProofBtn.addEventListener('click', async () => {
            // Get selected applicant
            const selectedIndex = parseInt(applicantSelect.value);
            const applicant = applicantProfiles[selectedIndex];
            
            // Get job requirements
            const jobRequirements = {
                minTruaScore: job.requirements.minTruaScore,
                disqualifiers: job.requirements.disqualifiers
            };
            
            // Update UI
            generateProofBtn.disabled = true;
            generateProofBtn.innerHTML = `
                <div class="flex items-center justify-center space-x-2">
                    <span>Generating proof...</span>
                </div>
            `;
            
            zkpStatus.className = 'mb-4 p-4 rounded-lg bg-blue-500/20 border border-blue-500/30';
            zkpStatus.innerHTML = `
                <div class="flex items-center space-x-3">
                    <span class="text-blue-300">Generating zero-knowledge proof...</span>
                </div>
                <div class="mt-4 flex justify-center">
                    <button id="cancel-zkp-btn" class="px-4 py-2 bg-red-600 text-white rounded-lg">Cancel</button>
                </div>
            `;
            zkpStatus.classList.remove('hidden');
            
            // Add cancel button functionality
            document.getElementById('cancel-zkp-btn').addEventListener('click', () => {
                console.log('ZKP generation cancelled');
                generateProofBtn.disabled = false;
                generateProofBtn.textContent = 'Generate ZKP Proof';
                zkpStatus.classList.add('hidden');
            });
            
            try {
                // Generate ZKP proof
                const proofResult = await this.zkpVerifier.generateProof(applicant, jobRequirements);
                
                // Update UI based on result
                if (proofResult.isEligible) {
                    // Verify the proof
                    const verificationResult = await this.zkpVerifier.verifyProof(
                        proofResult.proof,
                        proofResult.publicSignals
                    );
                    
                    if (verificationResult.isValid) {
                        // Submit application
                        const applicationResult = await this.zkpVerifier.submitApplication(
                            job._id,
                            applicant.id,
                            proofResult.proof,
                            proofResult.publicSignals
                        );
                        
                        // Show success message
                        zkpStatus.className = 'mb-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30';
                        zkpStatus.innerHTML = `
                            <div class="text-center">
                                <div class="text-4xl mb-2">✅</div>
                                <h4 class="text-lg font-bold text-green-400 mb-2">Application Successful!</h4>
                                <p class="text-green-300 mb-4">Your zero-knowledge proof was verified and your application has been submitted.</p>
                                <div class="bg-white/10 p-3 rounded text-xs text-green-200 font-mono">
                                    The employer only knows you're eligible, not your actual TruaScore or disqualifier details.
                                </div>
                            </div>
                        `;
                        
                        // Update button
                        generateProofBtn.innerHTML = 'Application Submitted';
                        generateProofBtn.className = 'w-full bg-green-500 text-white px-4 py-3 rounded-lg font-bold cursor-not-allowed';
                    } else {
                        // Show verification error
                        zkpStatus.className = 'mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30';
                        zkpStatus.innerHTML = `
                            <div class="text-center">
                                <div class="text-4xl mb-2">❌</div>
                                <h4 class="text-lg font-bold text-red-400 mb-2">Verification Failed</h4>
                                <p class="text-red-300">The zero-knowledge proof could not be verified. Please try again.</p>
                            </div>
                        `;
                        
                        // Reset button
                        generateProofBtn.disabled = false;
                        generateProofBtn.innerHTML = 'Try Again';
                    }
                } else {
                    // Show not eligible message
                    zkpStatus.className = 'mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30';
                    zkpStatus.innerHTML = `
                        <div class="text-center">
                            <div class="text-4xl mb-2">❌</div>
                            <h4 class="text-lg font-bold text-red-400 mb-2">Not Eligible</h4>
                            <p class="text-red-300 mb-4">You do not meet the requirements for this job.</p>
                            <div class="bg-white/10 p-3 rounded text-xs text-red-200 font-mono">
                                The employer only knows you're not eligible, not why or your specific details.
                            </div>
                        </div>
                    `;
                    
                    // Reset button
                    generateProofBtn.disabled = false;
                    generateProofBtn.innerHTML = 'Try Different Profile';
                }
            } catch (error) {
                console.error('Error in ZKP process:', error);
                
                // Show error message
                zkpStatus.className = 'mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30';
                zkpStatus.innerHTML = `
                    <div class="text-center">
                        <div class="text-4xl mb-2">⚠️</div>
                        <h4 class="text-lg font-bold text-red-400 mb-2">Error</h4>
                        <p class="text-red-300">An error occurred during the ZKP process: ${error.message}</p>
                    </div>
                `;
                
                // Reset button
                generateProofBtn.disabled = false;
                generateProofBtn.innerHTML = 'Try Again';
            }
        });
    }
    
    // Show error message
    showError(message) {
        const jobListingsContainer = document.getElementById('job-listings');
        
        // Remove loading indicator
        const loadingIndicator = document.getElementById('job-loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        // Display error message
        jobListingsContainer.innerHTML = `
            <div class="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
                <div class="text-3xl mb-4">⚠️</div>
                <h3 class="text-xl font-bold text-red-400 mb-2">Error</h3>
                <p class="text-red-300">${message}</p>
            </div>
        `;
    }
    
    // Show create job modal
    showCreateJobModal() {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'create-job-modal';
        modalContainer.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/70 p-4';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'glass-card rounded-2xl p-6 neon-border max-w-2xl w-full mx-auto relative overflow-y-auto max-h-[80vh]';
        
        // Add a subtle close button
        const closeButton = document.createElement('button');
        closeButton.className = 'absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white rounded-full text-lg';
        closeButton.innerHTML = '✕';
        closeButton.style.zIndex = '9999';
        
        // Add event listeners to both buttons
        const closeModal = () => {
            modalContainer.remove();
        };
        
        closeButton.addEventListener('click', closeModal);
        bottomCloseButton.addEventListener('click', closeModal);
        
        // Also allow clicking outside the modal to close it
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });
        
        // Add modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'mb-6 pb-4 border-b border-white/10';
        modalHeader.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-2">Create New Job</h3>
            <p class="text-blue-300">Fill in the details to create a new job listing</p>
        `;
        
        // Create form
        const form = document.createElement('form');
        form.id = 'create-job-form';
        form.className = 'space-y-6';
        
        // Basic job details
        form.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-mono text-blue-200 mb-2">Job Title</label>
                    <input type="text" id="job-title" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono" required>
                </div>
                <div>
                    <label class="block text-sm font-mono text-blue-200 mb-2">Company</label>
                    <input type="text" id="job-company" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono" required>
                </div>
                <div>
                    <label class="block text-sm font-mono text-blue-200 mb-2">Location</label>
                    <input type="text" id="job-location" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono" required>
                </div>
                <div>
                    <label class="block text-sm font-mono text-blue-200 mb-2">Job Type</label>
                    <select id="job-type" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-mono text-blue-200 mb-2">Description</label>
                    <textarea id="job-description" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono h-24" required></textarea>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-mono text-blue-200 mb-2">Minimum Salary (USD)</label>
                    <input type="number" id="job-salary-min" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono" required>
                </div>
                <div>
                    <label class="block text-sm font-mono text-blue-200 mb-2">Maximum Salary (USD)</label>
                    <input type="number" id="job-salary-max" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono" required>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-mono text-blue-200 mb-2">Minimum TruaScore (0-360)</label>
                <div class="flex items-center space-x-4">
                    <input type="range" id="job-min-score" min="0" max="360" value="270"
                           class="flex-1 h-2 bg-crypto-blue-900 rounded-lg appearance-none cursor-pointer slider">
                    <div class="bg-neon-gradient text-dark-bg px-4 py-2 rounded-lg font-mono font-bold min-w-[60px] text-center" id="job-score-display">270</div>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-mono text-blue-200 mb-4">Disqualifiers:</label>
                <div class="space-y-3">
                    <label class="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-neon-blue/30">
                        <input type="checkbox" id="job-disq-felony" checked class="sr-only">
                        <div class="checkbox-custom"></div>
                        <span class="flex-1 text-sm">Has felony in last 5 years</span>
                    </label>
                    <label class="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-neon-blue/30">
                        <input type="checkbox" id="job-disq-dui" class="sr-only">
                        <div class="checkbox-custom"></div>
                        <span class="flex-1 text-sm">Has DUI in last 3 years</span>
                    </label>
                    <label class="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-neon-blue/30">
                        <input type="checkbox" id="job-disq-license" class="sr-only">
                        <div class="checkbox-custom"></div>
                        <span class="flex-1 text-sm">Has suspended license</span>
                    </label>
                    <label class="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-neon-blue/30">
                        <input type="checkbox" id="job-disq-misdemeanor" class="sr-only">
                        <div class="checkbox-custom"></div>
                        <span class="flex-1 text-sm">Has misdemeanor in last 3 years</span>
                    </label>
                    <label class="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-neon-blue/30">
                        <input type="checkbox" id="job-disq-warrants" class="sr-only">
                        <div class="checkbox-custom"></div>
                        <span class="flex-1 text-sm">Has outstanding warrants</span>
                    </label>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-mono text-blue-200 mb-2">Skills (comma separated)</label>
                <input type="text" id="job-skills" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono" placeholder="JavaScript, Node.js, ZKP, Cryptography">
            </div>
            
            <div class="pt-4 border-t border-white/10">
                <button type="submit" id="submit-job-btn" class="w-full bg-neon-gradient text-dark-bg px-4 py-3 rounded-lg font-bold hover:scale-105 transition-transform">
                    Create Job
                </button>
            </div>
        `;
        
        // Add content to modal
        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(form);
        
        // No bottom close button needed anymore
        
        // Add modal to container
        modalContainer.appendChild(modalContent);
        
        // Add to document
        document.body.appendChild(modalContainer);
        
        // Add event listeners
        this.addCreateJobEventListeners();
    }
    
    // Add event listeners for create job modal
    addCreateJobEventListeners() {
        const form = document.getElementById('create-job-form');
        const scoreSlider = document.getElementById('job-min-score');
        const scoreDisplay = document.getElementById('job-score-display');
        
        // Update score display when slider changes
        if (scoreSlider && scoreDisplay) {
            scoreSlider.addEventListener('input', () => {
                scoreDisplay.textContent = scoreSlider.value;
            });
        }
        
        // Handle form submission
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Get form values
                const title = document.getElementById('job-title').value;
                const company = document.getElementById('job-company').value;
                const location = document.getElementById('job-location').value;
                const type = document.getElementById('job-type').value;
                const description = document.getElementById('job-description').value;
                const salaryMin = parseInt(document.getElementById('job-salary-min').value);
                const salaryMax = parseInt(document.getElementById('job-salary-max').value);
                const minTruaScore = parseInt(document.getElementById('job-min-score').value);
                const skillsInput = document.getElementById('job-skills').value;
                const skills = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill);
                
                // Get disqualifiers
                const disqualifiers = {
                    felony: document.getElementById('job-disq-felony').checked,
                    dui: document.getElementById('job-disq-dui').checked,
                    suspendedLicense: document.getElementById('job-disq-license').checked,
                    misdemeanor: document.getElementById('job-disq-misdemeanor').checked,
                    warrants: document.getElementById('job-disq-warrants').checked
                };
                
                // Create job object
                const newJob = {
                    title,
                    company,
                    location,
                    type,
                    description,
                    salary: {
                        min: salaryMin,
                        max: salaryMax,
                        currency: 'USD'
                    },
                    requirements: {
                        minTruaScore,
                        disqualifiers
                    },
                    skills,
                    postedDate: new Date().toISOString(),
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                    status: 'Active',
                    applications: 0,
                    views: 0
                };
                
                // Submit job
                try {
                    const submitBtn = document.getElementById('submit-job-btn');
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `
                        <div class="flex items-center justify-center space-x-2">
                            <span>Creating job...</span>
                        </div>
                    `;
                    
                    // Try to submit to API
                    try {
                        const response = await fetch(`${this.apiBaseUrl}/jobs`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newJob)
                        });
                        
                        if (!response.ok) {
                            throw new Error(`API error: ${response.status}`);
                        }
                        
                        const createdJob = await response.json();
                        this.jobs.push(createdJob);
                    } catch (error) {
                        console.error('Error creating job via API:', error);
                        // For demo purposes, add to local jobs array
                        newJob._id = (this.jobs.length + 1).toString();
                        this.jobs.push(newJob);
                    }
                    
                    // Re-render jobs
                    this.renderJobs();
                    
                    // Close modal
                    const modal = document.getElementById('create-job-modal');
                    if (modal) {
                        modal.remove();
                    }
                    
                    // Show success message
                    this.showNotification('Job created successfully!', 'success');
                } catch (error) {
                    console.error('Error creating job:', error);
                    this.showNotification('Error creating job. Please try again.', 'error');
                    
                    // Reset button
                    const submitBtn = document.getElementById('submit-job-btn');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Create Job';
                    }
                }
            });
        }
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500/90' :
            type === 'error' ? 'bg-red-500/90' :
            'bg-blue-500/90'
        }`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-xl">${
                    type === 'success' ? '✅' :
                    type === 'error' ? '❌' :
                    'ℹ️'
                }</span>
                <span class="text-white font-mono">${message}</span>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Export the JobBoard class
window.JobBoard = JobBoard;