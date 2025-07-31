// JobBoard Module Entry Point
// This file serves as the main entry point for the JobBoard module

// In a real ES modules environment, we would use import statements like:
// import { JobCard } from './jobBoard/components/JobCard.js';
// import { ApplicationModal } from './jobBoard/components/ApplicationModal.js';
// import { CreateJobModal } from './jobBoard/components/CreateJobModal.js';
// import { JobService } from './jobBoard/services/JobService.js';
// import { DidService } from './jobBoard/services/DidService.js';
// import { showNotification, showError } from './jobBoard/utils/notifications.js';

// For compatibility with the current setup, we'll use a class that internally uses our modular components
class JobBoard {
    constructor() {
        // Initialize services
        this.jobService = new JobService();
        this.didService = new DidService();
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
            createJobButton.addEventListener('click', () => this.handleCreateJobClick());
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
            JobBoardNotifications.showError('Failed to initialize job board. Please try again later.');
        }
    }
    
    // Fetch jobs from the service
    async fetchJobs() {
        try {
            await this.jobService.fetchJobs();
            this.renderJobs();
        } catch (error) {
            console.error('Error fetching jobs:', error);
            JobBoardNotifications.showError('Failed to fetch job listings. Please try again later.');
        }
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
        
        if (this.jobService.jobs.length === 0) {
            const noJobsMessage = document.createElement('div');
            noJobsMessage.className = 'text-center py-8 text-blue-300';
            noJobsMessage.textContent = 'No jobs found. Please check back later.';
            jobListingsContainer.appendChild(noJobsMessage);
            return;
        }
        
        // Add each job using the JobCard component
        this.jobService.jobs.forEach(job => {
            const jobCard = JobCard.create(
                job,
                (jobId) => this.handleApplyClick(jobId),
                (jobId) => this.handleCheckEligibilityClick(jobId)
            );
            jobListingsContainer.appendChild(jobCard);
        });
    }
    
    // Add event listeners
    addEventListeners() {
        // Event listeners are now handled by the individual components
    }
    
    // Handle apply button click
    async handleApplyClick(jobId) {
        const job = this.jobService.getJobById(jobId);
        if (!job) return;
        
        // Show application modal using the ApplicationModal component
        ApplicationModal.show(job, this.zkpVerifier, this.didService);
    }
    
    // Handle check eligibility button click
    async handleCheckEligibilityClick(jobId) {
        const job = this.jobService.getJobById(jobId);
        if (!job) return;
        
        // Show eligibility modal using the EligibilityModal component
        EligibilityModal.show(job, this.zkpVerifier, this.didService);
    }
    
    // Handle create job button click
    handleCreateJobClick() {
        // Show create job modal using the CreateJobModal component
        CreateJobModal.show(async (newJob) => {
            try {
                // Create job using the service
                await this.jobService.createJob(newJob);
                
                // Re-render jobs
                this.renderJobs();
                
                // Show success message
                JobBoardNotifications.showNotification('Job created successfully!', 'success');
            } catch (error) {
                console.error('Error creating job:', error);
                JobBoardNotifications.showNotification('Error creating job. Please try again.', 'error');
            }
        });
    }
    
    // Set the ZKP verifier instance
    setZkpVerifier(zkpVerifier) {
        this.zkpVerifier = zkpVerifier;
    }
}

// Export the JobBoard class
window.JobBoard = JobBoard;

// Log that the modular JobBoard is loaded
console.log('Modular JobBoard loaded');