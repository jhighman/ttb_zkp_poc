pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

/*
 * EligibilityCheck Circuit
 * 
 * This circuit proves that an applicant is eligible for a job without revealing:
 * - Their actual TruaScore
 * - Their specific disqualifier statuses
 * 
 * The circuit checks:
 * 1. Applicant's score >= required minimum score
 * 2. All relevant disqualifiers are absent (false)
 * 
 * Inputs:
 * - s (private): Applicant's TruaScore (0-1000)
 * - d[n] (private): Array of disqualifier statuses (0=absent, 1=present)
 * - r (public): Required minimum score
 * - relevant[n] (public): Which disqualifiers are relevant for this job
 * 
 * Output: Proof of eligibility without revealing sensitive data
 */
template EligibilityCheck(n) {
    // Private inputs (hidden from verifier)
    signal input s;          // Applicant's TruaScore
    signal input d[n];       // Disqualifier array: [felony, dui, suspended_license, misdemeanor, warrants]
    
    // Public inputs (visible to verifier)
    signal input r;          // Required minimum score
    signal input relevant[n]; // Which disqualifiers matter for this job
    
    // Constraint 1: Check if score >= required score
    // Using GreaterEqThan with 10 bits (supports scores up to 1023)
    component scoreCheck = GreaterEqThan(10);
    scoreCheck.in[0] <== s;
    scoreCheck.in[1] <== r;
    scoreCheck.out === 1;  // Must be true for eligibility
    
    // Constraint 2: Check that all relevant disqualifiers are absent
    // For each disqualifier, if it's relevant, it must be false (0)
    component disqualifierChecks[n];
    for (var i = 0; i < n; i++) {
        disqualifierChecks[i] = IsZero();
        // If relevant[i] = 1 and d[i] = 1, then relevant[i] * d[i] = 1
        // If relevant[i] = 0 or d[i] = 0, then relevant[i] * d[i] = 0
        // We require relevant[i] * d[i] = 0 for all i
        disqualifierChecks[i].in <== relevant[i] * d[i];
        disqualifierChecks[i].out === 1;  // Must be true (input is zero)
    }
}

// Main component with 5 disqualifiers:
// 0: Has felony in last 5 years
// 1: Has DUI in last 3 years  
// 2: Has suspended license
// 3: Has misdemeanor in last 3 years
// 4: Has outstanding warrants
component main {public [r, relevant]} = EligibilityCheck(5);