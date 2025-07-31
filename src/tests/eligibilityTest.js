// Eligibility Test Script
// This script tests the eligibility check functionality with different scenarios

// Import the fs module to read DID documents
const fs = require('fs');
const path = require('path');

// Mock job data
const jobs = [
    {
        id: 'job1',
        title: 'Senior Blockchain Developer',
        requiredCredentials: ['Computer Science Degree', 'Blockchain Certification', 'Smart Contract Experience', 'No Felony', 'No Misdemeanor']
    },
    {
        id: 'job2',
        title: 'Data Privacy Engineer',
        requiredCredentials: ['Cryptography Experience', 'Privacy Certification', 'Software Engineering Degree', 'No DUI', 'Valid License']
    }
];

// Function to load DID documents from files
function loadDidDocuments() {
    const holdersDir = path.join(__dirname, '../did-documents/holders');
    const files = fs.readdirSync(holdersDir);
    
    return files
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const filePath = path.join(holdersDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const didDocument = JSON.parse(content);
            return {
                id: didDocument.id,
                name: didDocument.name,
                profile: didDocument.profile
            };
        });
}

// Function to extract job requirements from job data
function extractJobRequirements(job) {
    console.log('Extracting job requirements for:', job.title);
    console.log('Required credentials:', job.requiredCredentials);
    
    const jobRequirements = {
        minTruaScore: 270, // Default value
        disqualifiers: {
            felony: job.requiredCredentials.includes('No Felony'),
            dui: job.requiredCredentials.includes('No DUI'),
            suspendedLicense: job.requiredCredentials.includes('Valid License'),
            misdemeanor: job.requiredCredentials.includes('No Misdemeanor'),
            warrants: job.requiredCredentials.includes('No Warrants')
        }
    };
    
    console.log('Extracted job requirements:', jobRequirements);
    return jobRequirements;
}

// Function to check eligibility
function checkEligibility(applicantData, jobRequirements) {
    console.log('Checking eligibility for:', applicantData.name);
    console.log('Applicant TruaScore:', applicantData.profile.truaScore);
    console.log('Required minimum TruaScore:', jobRequirements.minTruaScore);
    
    // Check TruaScore requirement
    if (applicantData.profile.truaScore < jobRequirements.minTruaScore) {
        console.log('Failed TruaScore check');
        return false;
    }
    
    // Check disqualifiers
    const disqualifiers = [
        'felony',
        'dui',
        'suspendedLicense',
        'misdemeanor',
        'warrants'
    ];
    
    for (const disqualifier of disqualifiers) {
        // If this disqualifier matters for the job and the applicant has it
        console.log(`Checking disqualifier: ${disqualifier}`);
        console.log(`Job requires no ${disqualifier}:`, jobRequirements.disqualifiers[disqualifier]);
        console.log(`Applicant has ${disqualifier}:`, applicantData.profile.disqualifiers[disqualifier]);
        
        // The fix: If the job requires no disqualifier and the applicant has it, OR
        // if the disqualifier is 'warrants' and the applicant has it (regardless of job requirements)
        if ((jobRequirements.disqualifiers[disqualifier] && applicantData.profile.disqualifiers[disqualifier]) ||
            (disqualifier === 'warrants' && applicantData.profile.disqualifiers[disqualifier])) {
            console.log(`Failed ${disqualifier} check`);
            return false;
        }
    }
    
    // If all checks pass, the applicant is eligible
    console.log('All checks passed, applicant is eligible');
    return true;
}

// Run tests
function runTests() {
    console.log('=== ELIGIBILITY TEST RESULTS ===');
    
    // Load DID documents
    const didDocuments = loadDidDocuments();
    console.log(`Loaded ${didDocuments.length} DID documents`);
    
    // Test all combinations of jobs and applicants
    jobs.forEach(job => {
        const jobRequirements = extractJobRequirements(job);
        
        console.log(`\n=== Testing eligibility for ${job.title} ===`);
        
        didDocuments.forEach(applicant => {
            const isEligible = checkEligibility(applicant, jobRequirements);
            console.log(`${applicant.name} is ${isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'} for ${job.title}`);
            console.log('---');
        });
    });
}

// Run the tests
runTests();