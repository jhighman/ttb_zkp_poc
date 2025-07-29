/**
 * CreateJobModal Component
 * Responsible for rendering the create job modal
 */

class CreateJobModal {
    /**
     * Show the create job modal
     * @param {Function} onJobCreated - Callback function when a job is created
     */
    static show(onJobCreated) {
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
        
        // Add event listener to close button
        const closeModal = () => {
            modalContainer.remove();
        };
        
        closeButton.addEventListener('click', closeModal);
        
        // Also allow clicking outside the modal to close it
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });

        // Add a keyboard event listener to close on Escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
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
                    <label class="block text-sm font-mono text-blue-200 mb-2">Minimum Salary (USD, optional)</label>
                    <input type="number" id="job-salary-min" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono" placeholder="e.g., 50000">
                </div>
                <div>
                    <label class="block text-sm font-mono text-blue-200 mb-2">Maximum Salary (USD, optional)</label>
                    <input type="number" id="job-salary-max" class="w-full bg-crypto-blue-900 border border-white/20 rounded-lg px-4 py-3 text-white font-mono" placeholder="e.g., 100000">
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
        
        // Add modal to container
        modalContainer.appendChild(modalContent);
        
        // Add to document
        document.body.appendChild(modalContainer);
        
        // Add event listeners
        CreateJobModal.addEventListeners(onJobCreated, closeModal);
    }
    
    /**
     * Add event listeners for the create job modal
     * @param {Function} onJobCreated - Callback function when a job is created
     * @param {Function} closeModal - Function to close the modal
     */
    static addEventListeners(onJobCreated, closeModal) {
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
                
                // Make salary fields optional
                const salaryMinInput = document.getElementById('job-salary-min').value;
                const salaryMaxInput = document.getElementById('job-salary-max').value;
                const salaryMin = salaryMinInput ? parseInt(salaryMinInput) : null;
                const salaryMax = salaryMaxInput ? parseInt(salaryMaxInput) : null;
                
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
                        min: salaryMin !== null ? salaryMin : undefined,
                        max: salaryMax !== null ? salaryMax : undefined,
                        currency: 'USD'
                    },
                    requirements: {
                        minTruaScore,
                        disqualifiers
                    },
                    skills,
                    postedDate: new Date().toISOString(),
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
                    
                    // Call the callback function with the new job
                    if (onJobCreated) {
                        await onJobCreated(newJob);
                    }
                    
                    // Close modal
                    closeModal();
                } catch (error) {
                    console.error('Error creating job:', error);
                    
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
}

// Export the CreateJobModal class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CreateJobModal };
} else {
    // For browser environments
    window.CreateJobModal = CreateJobModal;
}