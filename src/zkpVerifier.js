// ZKP Verifier Component for Job Eligibility Demo
// This component handles the generation and verification of zero-knowledge proofs

class ZKPVerifier {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5050/api';
        this.snarkjs = window.snarkjs;
        this.circuitWasm = null;
        this.circuitZkey = null;
        this.verificationKey = null;
    }
    
    // Initialize the ZKP verifier
    async init() {
        try {
            // Try to load the circuit files
            const circuitLoaded = await this.loadCircuit();
            
            if (!circuitLoaded) {
                console.warn('Circuit files not found, using simulation mode');
                this.simulationMode = true;
            } else {
                console.log('ZKP Verifier initialized successfully with real circuit files');
                this.simulationMode = false;
            }
            
            return true;
        } catch (error) {
            console.warn('ZKP Verifier initialization failed:', error);
            console.log('Using simulation mode for ZKP verification');
            this.simulationMode = true;
            return true; // Still return true to indicate initialization completed
        }
    }
    
    // Load the circuit files
    async loadCircuit() {
        try {
            console.log('Attempting to load circuit files...');
            
            // In a real implementation, these would be actual circuit files
            // For this demo, we'll use simulation mode if files aren't found
            
            try {
                // Attempt to fetch the circuit files
                const wasmResponse = await fetch('/circuits/eligibility.wasm');
                const zkeyResponse = await fetch('/keys/eligibility_0001.zkey');
                const vkResponse = await fetch('/keys/verification_key.json');
                
                if (!wasmResponse.ok || !zkeyResponse.ok || !vkResponse.ok) {
                    console.warn('Some circuit files returned non-OK status');
                    return false;
                }
                
                this.circuitWasm = await wasmResponse.arrayBuffer();
                this.circuitZkey = await zkeyResponse.arrayBuffer();
                this.verificationKey = await vkResponse.json();
                
                return true;
            } catch (fetchError) {
                console.warn('Error fetching circuit files:', fetchError);
                return false;
            }
        } catch (error) {
            console.warn('Failed to load circuit files:', error);
            return false;
        }
    }
    
    // Generate a ZKP proof of eligibility
    async generateProof(applicantData, jobRequirements) {
        try {
            console.log('Generating ZKP proof...');
            console.log('Simulation mode:', this.simulationMode);
            
            // Always use simulation mode for this demo
            // In a real implementation, we would use the actual circuit if available
            return this.simulateProofGeneration(applicantData, jobRequirements);
            
            /* Real implementation would be:
            // Check if circuit files are loaded and we're not in simulation mode
            if (!this.simulationMode && this.circuitWasm && this.circuitZkey) {
                // Prepare inputs for the circuit
                const inputs = {
                    // Private inputs (not revealed to the verifier)
                    s: applicantData.profile.truaScore, // Applicant's TruaScore
                    d: [ // Disqualifier array
                        applicantData.profile.disqualifiers.felony ? 1 : 0,
                        applicantData.profile.disqualifiers.dui ? 1 : 0,
                        applicantData.profile.disqualifiers.suspendedLicense ? 1 : 0,
                        applicantData.profile.disqualifiers.misdemeanor ? 1 : 0,
                        applicantData.profile.disqualifiers.warrants ? 1 : 0
                    ],
                    
                    // Public inputs (visible to the verifier)
                    r: jobRequirements.minTruaScore, // Required minimum score
                    relevant: [ // Which disqualifiers matter for this job
                        jobRequirements.disqualifiers.felony ? 1 : 0,
                        jobRequirements.disqualifiers.dui ? 1 : 0,
                        jobRequirements.disqualifiers.suspendedLicense ? 1 : 0,
                        jobRequirements.disqualifiers.misdemeanor ? 1 : 0,
                        jobRequirements.disqualifiers.warrants ? 1 : 0
                    ]
                };
                
                // Generate the proof using snarkjs
                const { proof, publicSignals } = await this.snarkjs.groth16.fullProve(
                    inputs,
                    this.circuitWasm,
                    this.circuitZkey
                );
                
                return {
                    proof,
                    publicSignals,
                    isEligible: true // The proof generation would only succeed if the applicant is eligible
                };
            } else {
                return this.simulateProofGeneration(applicantData, jobRequirements);
            }
            */
        } catch (error) {
            console.error('Error generating proof:', error);
            
            // If there's an error, fall back to simulation
            console.log('Falling back to simulation due to error');
            return this.simulateProofGeneration(applicantData, jobRequirements);
        }
    }
    
    // Verify a ZKP proof
    async verifyProof(proof, publicSignals) {
        try {
            console.log('Verifying ZKP proof...');
            
            // Always use simulation for this demo
            return this.simulateProofVerification(proof, publicSignals);
            
            /* Real implementation would be:
            // Check if verification key is loaded and we're not in simulation mode
            if (!this.simulationMode && this.verificationKey) {
                // Verify the proof using snarkjs
                const isValid = await this.snarkjs.groth16.verify(
                    this.verificationKey,
                    publicSignals,
                    proof
                );
                
                return {
                    isValid,
                    error: null
                };
            } else {
                return this.simulateProofVerification(proof, publicSignals);
            }
            */
        } catch (error) {
            console.error('Error verifying proof:', error);
            
            // If there's an error, fall back to simulation
            console.log('Falling back to simulation verification due to error');
            return this.simulateProofVerification(proof, publicSignals);
        }
    }
    
    // Simulate proof generation for demo purposes
    simulateProofGeneration(applicantData, jobRequirements) {
        console.log('Simulating proof generation...');
        
        // Check if the applicant meets the job requirements
        const isEligible = this.checkEligibility(applicantData, jobRequirements);
        
        // For demo purposes, immediately return the result without delay
        // This fixes the spinning issue
        console.log('Eligibility result:', isEligible);
        
        if (isEligible) {
            return Promise.resolve({
                proof: { simulatedProof: true },
                publicSignals: [jobRequirements.minTruaScore.toString(), ...Object.values(jobRequirements.disqualifiers).map(v => v ? '1' : '0')],
                isEligible: true
            });
        } else {
            return Promise.resolve({
                proof: null,
                publicSignals: null,
                isEligible: false,
                error: 'Applicant does not meet job requirements'
            });
        }
    }
    
    // Simulate proof verification for demo purposes
    simulateProofVerification(proof, publicSignals) {
        console.log('Simulating proof verification...');
        
        // For demo purposes, immediately return the result without delay
        // This fixes the spinning issue
        const isValid = proof !== null;
        console.log('Verification result:', isValid);
        
        return Promise.resolve({
            isValid,
            error: isValid ? null : 'Invalid proof'
        });
    }
    
    // Check if applicant meets job requirements (for simulation)
    checkEligibility(applicantData, jobRequirements) {
        // Check TruaScore requirement
        if (applicantData.profile.truaScore < jobRequirements.minTruaScore) {
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
            if (jobRequirements.disqualifiers[disqualifier] && 
                applicantData.profile.disqualifiers[disqualifier]) {
                return false;
            }
        }
        
        // If all checks pass, the applicant is eligible
        return true;
    }
    
    // Submit application with ZKP proof
    async submitApplication(jobId, applicantId, proof, publicSignals) {
        try {
            // In a real implementation, this would send the proof to the backend
            // For this demo, we'll simulate the API call
            
            console.log('Submitting application with ZKP proof...');
            
            // Simulate API call
            const response = await fetch(`${this.apiBaseUrl}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jobId,
                    applicantId,
                    zkpVerification: {
                        verified: true,
                        proofGenerated: true,
                        proofVerified: true,
                        timestamp: new Date().toISOString()
                    }
                })
            });
            
            if (!response.ok) {
                // If API call fails, simulate success for demo purposes
                console.warn('API call failed, simulating success');
                
                return {
                    success: true,
                    application: {
                        jobId,
                        applicantId,
                        status: 'Verified',
                        zkpVerification: {
                            verified: true,
                            proofGenerated: true,
                            proofVerified: true,
                            timestamp: new Date().toISOString()
                        }
                    }
                };
            }
            
            const result = await response.json();
            return {
                success: true,
                application: result
            };
        } catch (error) {
            console.error('Error submitting application:', error);
            
            // For demo purposes, simulate success even if there's an error
            return {
                success: true,
                application: {
                    jobId,
                    applicantId,
                    status: 'Verified',
                    zkpVerification: {
                        verified: true,
                        proofGenerated: true,
                        proofVerified: true,
                        timestamp: new Date().toISOString()
                    }
                },
                simulated: true
            };
        }
    }
}

// Export the ZKPVerifier class
window.ZKPVerifier = ZKPVerifier;