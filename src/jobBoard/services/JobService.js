// JobService
// This service is responsible for job data operations

class JobService {
    constructor() {
        this.jobs = [];
        this.apiEndpoint = '/api/jobs';
    }
    
    /**
     * Fetch jobs from the API or use sample data
     * @returns {Promise<Array>} - Array of job objects
     */
    async fetchJobs() {
        try {
            // Try to fetch from API
            const response = await fetch(this.apiEndpoint);
            
            // If successful, parse and store jobs
            if (response.ok) {
                this.jobs = await response.json();
                return this.jobs;
            }
            
            // If API fails, use sample data
            console.warn('Failed to fetch jobs from API, using sample data instead');
            this.loadSampleJobs();
            return this.jobs;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            // Use sample data as fallback
            this.loadSampleJobs();
            return this.jobs;
        }
    }
    
    /**
     * Load sample job data
     */
    loadSampleJobs() {
        this.jobs = [
            {
                id: 'job1',
                title: 'Senior Blockchain Developer',
                company: 'CryptoTech Solutions',
                location: 'Remote',
                type: 'Full-time',
                experience: '5+ years',
                salaryMin: 120000,
                salaryMax: 180000,
                description: 'We are looking for an experienced blockchain developer to join our team. You will be responsible for designing and implementing smart contracts, developing decentralized applications, and contributing to our blockchain infrastructure.',
                requiredCredentials: ['Computer Science Degree', 'Blockchain Certification', 'Smart Contract Experience']
            },
            {
                id: 'job2',
                title: 'Data Privacy Engineer',
                company: 'PrivacyGuard Inc.',
                location: 'New York, NY',
                type: 'Full-time',
                experience: '3+ years',
                salaryMin: 110000,
                salaryMax: 150000,
                description: 'Join our team to build privacy-preserving systems using zero-knowledge proofs and other cryptographic techniques. You will work on implementing privacy features in our products and ensuring compliance with data protection regulations.',
                requiredCredentials: ['Cryptography Experience', 'Privacy Certification', 'Software Engineering Degree']
            },
            {
                id: 'job3',
                title: 'ZKP Protocol Researcher',
                company: 'ZK Research Labs',
                location: 'San Francisco, CA',
                type: 'Full-time',
                experience: '2+ years',
                salaryMin: 130000,
                salaryMax: 190000,
                description: 'We are seeking a researcher specializing in zero-knowledge proof protocols to join our R&D team. You will research, design, and implement novel ZKP systems for various applications in blockchain, privacy, and security.',
                requiredCredentials: ['PhD in Cryptography', 'ZKP Research Experience', 'Academic Publications']
            },
            {
                id: 'job4',
                title: 'Cryptography Engineer',
                company: 'SecureChain',
                location: 'Remote',
                type: 'Contract',
                experience: '4+ years',
                salaryMin: 100000,
                salaryMax: 160000,
                description: 'We are looking for a cryptography engineer to help design and implement secure cryptographic protocols for our blockchain platform. You will work on implementing zero-knowledge proofs, secure multi-party computation, and other advanced cryptographic techniques.',
                requiredCredentials: ['Cryptography Certification', 'Mathematics Degree', 'Security Clearance']
            },
            {
                id: 'job5',
                title: 'Privacy Solutions Architect',
                company: 'PrivacyTech',
                location: 'Boston, MA',
                type: 'Full-time',
                experience: '6+ years',
                salaryMin: 140000,
                salaryMax: 200000,
                description: 'As a Privacy Solutions Architect, you will design and implement privacy-preserving systems for our enterprise clients. You will work with cross-functional teams to integrate zero-knowledge proofs and other privacy technologies into existing systems.',
                requiredCredentials: ['Enterprise Architecture Experience', 'Privacy Certification', 'Technical Leadership']
            }
        ];
    }
    
    /**
     * Get a job by ID
     * @param {string} jobId - The job ID
     * @returns {Object|null} - The job object or null if not found
     */
    getJobById(jobId) {
        return this.jobs.find(job => job.id === jobId) || null;
    }
    
    /**
     * Create a new job
     * @param {Object} jobData - The job data
     * @returns {Promise<Object>} - The created job
     */
    async createJob(jobData) {
        try {
            // Generate a unique ID
            const newJob = {
                ...jobData,
                id: 'job' + (this.jobs.length + 1)
            };
            
            // Try to create via API
            try {
                const response = await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newJob)
                });
                
                if (response.ok) {
                    const createdJob = await response.json();
                    this.jobs.push(createdJob);
                    return createdJob;
                }
                
                // If API fails, add to local array
                console.warn('Failed to create job via API, adding locally');
                this.jobs.push(newJob);
                return newJob;
            } catch (error) {
                console.error('Error creating job via API:', error);
                // Add to local array as fallback
                this.jobs.push(newJob);
                return newJob;
            }
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    }
    
    /**
     * Filter jobs by criteria
     * @param {Object} filters - Filter criteria
     * @returns {Array} - Filtered jobs
     */
    filterJobs(filters) {
        let filteredJobs = [...this.jobs];
        
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredJobs = filteredJobs.filter(job => 
                job.title.toLowerCase().includes(searchLower) ||
                job.company.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower)
            );
        }
        
        if (filters.location) {
            filteredJobs = filteredJobs.filter(job => 
                job.location.toLowerCase() === filters.location.toLowerCase()
            );
        }
        
        if (filters.type) {
            filteredJobs = filteredJobs.filter(job => 
                job.type.toLowerCase() === filters.type.toLowerCase()
            );
        }
        
        if (filters.minSalary) {
            filteredJobs = filteredJobs.filter(job => 
                job.salaryMin >= filters.minSalary
            );
        }
        
        if (filters.credentials && filters.credentials.length > 0) {
            filteredJobs = filteredJobs.filter(job => 
                filters.credentials.every(cred => 
                    job.requiredCredentials.includes(cred)
                )
            );
        }
        
        return filteredJobs;
    }
}

// Export the JobService class
window.JobService = JobService;

// Log that the JobService is loaded
console.log('JobService loaded');