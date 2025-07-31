// JobCard Component
// This component is responsible for rendering individual job cards

class JobCard {
    /**
     * Create a job card element
     * @param {Object} job - The job data
     * @param {Function} onApplyClick - Callback function when apply button is clicked
     * @param {Function} onCheckEligibilityClick - Callback function when check eligibility button is clicked
     * @returns {HTMLElement} - The job card element
     */
    static create(job, onApplyClick, onCheckEligibilityClick) {
        // Create job card container
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card glass-card rounded-xl p-6 transition-all hover:shadow-neon-glow';
        jobCard.dataset.jobId = job.id;
        
        // Create job header with title and company
        const jobHeader = document.createElement('div');
        jobHeader.className = 'flex justify-between items-start mb-4';
        
        // Job title and company
        const jobTitleContainer = document.createElement('div');
        
        const jobTitle = document.createElement('h3');
        jobTitle.className = 'text-xl font-bold text-neon-blue mb-1';
        jobTitle.textContent = job.title;
        jobTitleContainer.appendChild(jobTitle);
        
        const companyName = document.createElement('div');
        companyName.className = 'text-sm text-blue-300 flex items-center';
        companyName.innerHTML = `<span class="mr-1">🏢</span> ${job.company}`;
        jobTitleContainer.appendChild(companyName);
        
        jobHeader.appendChild(jobTitleContainer);
        
        // Salary range
        const salaryRange = document.createElement('div');
        salaryRange.className = 'text-right text-neon-green font-mono text-sm';
        
        // Handle optional salary fields
        let salaryText = '<span class="mr-1">💰</span> ';
        if (job.salaryMin !== undefined && job.salaryMax !== undefined) {
            salaryText += `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
        } else if (job.salaryMin !== undefined) {
            salaryText += `From $${job.salaryMin.toLocaleString()}`;
        } else if (job.salaryMax !== undefined) {
            salaryText += `Up to $${job.salaryMax.toLocaleString()}`;
        } else {
            salaryText += 'Salary not specified';
        }
        
        salaryRange.innerHTML = salaryText;
        jobHeader.appendChild(salaryRange);
        
        jobCard.appendChild(jobHeader);
        
        // Job description
        const jobDescription = document.createElement('p');
        jobDescription.className = 'text-blue-100 mb-4 line-clamp-3';
        jobDescription.textContent = job.description;
        jobCard.appendChild(jobDescription);
        
        // Job details (location, type, experience)
        const jobDetails = document.createElement('div');
        jobDetails.className = 'grid grid-cols-3 gap-2 mb-4';
        
        // Location
        const locationDetail = document.createElement('div');
        locationDetail.className = 'text-xs text-blue-300 flex items-center';
        locationDetail.innerHTML = `<span class="mr-1">📍</span> ${job.location}`;
        jobDetails.appendChild(locationDetail);
        
        // Job type
        const typeDetail = document.createElement('div');
        typeDetail.className = 'text-xs text-blue-300 flex items-center';
        typeDetail.innerHTML = `<span class="mr-1">⏰</span> ${job.type}`;
        jobDetails.appendChild(typeDetail);
        
        // Experience
        const experienceDetail = document.createElement('div');
        experienceDetail.className = 'text-xs text-blue-300 flex items-center';
        experienceDetail.innerHTML = `<span class="mr-1">📈</span> ${job.experience}`;
        jobDetails.appendChild(experienceDetail);
        
        jobCard.appendChild(jobDetails);
        
        // Required credentials
        const credentialsContainer = document.createElement('div');
        credentialsContainer.className = 'mb-4';
        
        const credentialsTitle = document.createElement('div');
        credentialsTitle.className = 'text-xs text-blue-300 mb-2';
        credentialsTitle.textContent = 'Required Credentials:';
        credentialsContainer.appendChild(credentialsTitle);
        
        const credentialsList = document.createElement('div');
        credentialsList.className = 'flex flex-wrap gap-2';
        
        job.requiredCredentials.forEach(credential => {
            const credentialBadge = document.createElement('span');
            credentialBadge.className = 'text-xs bg-neon-gradient text-dark-bg px-2 py-1 rounded-full';
            credentialBadge.textContent = credential;
            credentialsList.appendChild(credentialBadge);
        });
        
        credentialsContainer.appendChild(credentialsList);
        jobCard.appendChild(credentialsContainer);
        
        // Button container for side-by-side buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'grid grid-cols-2 gap-2';
        
        // Check Eligibility button
        const checkEligibilityButton = document.createElement('button');
        checkEligibilityButton.className = 'bg-blue-500/30 text-blue-100 py-2 rounded-lg font-bold hover:scale-105 transition-transform';
        checkEligibilityButton.textContent = 'Check Eligibility';
        checkEligibilityButton.addEventListener('click', () => {
            if (typeof onCheckEligibilityClick === 'function') {
                onCheckEligibilityClick(job.id);
            }
        });
        
        buttonContainer.appendChild(checkEligibilityButton);
        
        // Apply button
        const applyButton = document.createElement('button');
        applyButton.className = 'bg-neon-gradient text-dark-bg py-2 rounded-lg font-bold hover:scale-105 transition-transform';
        applyButton.textContent = 'Apply with ZKP';
        applyButton.addEventListener('click', () => {
            if (typeof onApplyClick === 'function') {
                onApplyClick(job.id);
            }
        });
        
        buttonContainer.appendChild(applyButton);
        
        jobCard.appendChild(buttonContainer);
        
        return jobCard;
    }
}

// Export the JobCard class
window.JobCard = JobCard;

// Log that the JobCard component is loaded
console.log('JobCard component loaded');