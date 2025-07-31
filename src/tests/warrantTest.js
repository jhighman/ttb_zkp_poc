// Warrant Test Script
// This script tests the specific issue with Warren Outlaw and the Senior Blockchain Developer job

// Mock job data
const job = {
    id: 'job1',
    title: 'Senior Blockchain Developer',
    requiredCredentials: ['Computer Science Degree', 'Blockchain Certification', 'Smart Contract Experience', 'No Felony', 'No Misdemeanor']
};

// Mock applicant data
const warrenOutlaw = {
    id: 'did:example:warren-outlaw',
    name: 'Warren Outlaw',
    profile: {
        truaScore: 280,
        disqualifiers: {
            felony: false,
            dui: false,
            suspendedLicense: false,
            misdemeanor: false,
            warrants: true
        }
    }
};

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

// Original function to check eligibility
function originalCheckEligibility(applicantData, jobRequirements) {
    console.log('ORIGINAL CHECK:');
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
        
        if (jobRequirements.disqualifiers[disqualifier] && 
            applicantData.profile.disqualifiers[disqualifier]) {
            console.log(`Failed ${disqualifier} check`);
            return false;
        }
    }
    
    // If all checks pass, the applicant is eligible
    console.log('All checks passed, applicant is eligible');
    return true;
}

// Fixed function to check eligibility
function fixedCheckEligibility(applicantData, jobRequirements) {
    console.log('\nFIXED CHECK:');
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
    console.log('=== WARRANT TEST RESULTS ===');
    
    // Extract job requirements
    const jobRequirements = extractJobRequirements(job);
    
    // Test with original check
    console.log('\n=== Testing with original eligibility check ===');
    const originalResult = originalCheckEligibility(warrenOutlaw, jobRequirements);
    console.log(`Warren Outlaw is ${originalResult ? 'ELIGIBLE' : 'NOT ELIGIBLE'} for Senior Blockchain Developer (original check)`);
    
    // Test with fixed check
    console.log('\n=== Testing with fixed eligibility check ===');
    const fixedResult = fixedCheckEligibility(warrenOutlaw, jobRequirements);
    console.log(`Warren Outlaw is ${fixedResult ? 'ELIGIBLE' : 'NOT ELIGIBLE'} for Senior Blockchain Developer (fixed check)`);
    
    // Explain the issue
    console.log('\n=== Explanation ===');
    console.log('The issue is that the original eligibility check only fails if the job explicitly requires no warrants AND the applicant has warrants.');
    console.log('However, having warrants should be a disqualifier regardless of whether the job explicitly requires no warrants.');
    console.log('The fixed check adds a special case for warrants, failing the check if the applicant has warrants, regardless of job requirements.');
}

// Run the tests
runTests();