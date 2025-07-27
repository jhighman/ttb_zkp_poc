// ZKP Job Eligibility Demo - Main Application Logic with Blockchain-Style UI
class ZKPJobDemo {
    constructor() {
        this.applicantProfiles = [
            {
                name: "👍 Applicant A: Score=320, No disqualifiers",
                score: 320,
                disqualifiers: [0, 0, 0, 0, 0],
                description: "High-performing candidate with clean background",
                details: [
                    "TruaScore: 320 (Excellent - Above 270 threshold)",
                    "No felony convictions",
                    "No DUI history", 
                    "Valid driver's license",
                    "No misdemeanor convictions",
                    "No outstanding warrants"
                ]
            },
            {
                name: "⚠️ Applicant B: Score=250, Has DUI",
                score: 250,
                disqualifiers: [0, 1, 0, 0, 0],
                description: "Borderline score with recent DUI conviction",
                details: [
                    "TruaScore: 250 (Fair - Above 240 but below 270 threshold)",
                    "No felony convictions",
                    "DUI conviction within 3 years ⚠️",
                    "Valid driver's license",
                    "No misdemeanor convictions", 
                    "No outstanding warrants"
                ]
            },
            {
                name: "❌ Applicant C: Score=290, Has felony",
                score: 290,
                disqualifiers: [1, 0, 0, 0, 0],
                description: "Good score but disqualified by felony conviction",
                details: [
                    "TruaScore: 290 (Good - Above 270 threshold)",
                    "Felony conviction within 5 years ❌",
                    "No DUI history",
                    "Valid driver's license",
                    "No misdemeanor convictions",
                    "No outstanding warrants"
                ]
            },
            {
                name: "✅ Applicant D: Score=340, Has old misdemeanor",
                score: 340,
                disqualifiers: [0, 0, 0, 1, 0],
                description: "Excellent score with minor past issue",
                details: [
                    "TruaScore: 340 (Excellent - Well above 270 threshold)",
                    "No felony convictions",
                    "No DUI history",
                    "Valid driver's license",
                    "Misdemeanor conviction within 3 years ⚠️",
                    "No outstanding warrants"
                ]
            },
            {
                name: "🚫 Applicant E: Score=180, Multiple issues",
                score: 180,
                disqualifiers: [1, 1, 0, 1, 1],
                description: "Poor score with multiple disqualifying factors",
                details: [
                    "TruaScore: 180 (Poor - Below 240 threshold)",
                    "Felony conviction within 5 years ❌",
                    "DUI conviction within 3 years ❌",
                    "Valid driver's license",
                    "Misdemeanor conviction within 3 years ❌",
                    "Outstanding warrants ❌"
                ]
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProfileDetails();
        this.updateScoreDisplay();
        this.addBlockchainEffects();
    }

    setupEventListeners() {
        // Score slider with blockchain-style feedback
        const scoreSlider = document.getElementById('requiredScore');
        scoreSlider.addEventListener('input', () => {
            this.updateScoreDisplay();
            this.addGlowEffect(scoreSlider);
        });

        // Applicant profile selector
        const applicantSelect = document.getElementById('applicant');
        applicantSelect.addEventListener('change', () => {
            this.updateProfileDetails();
            this.addSelectEffect(applicantSelect);
        });

        // Check eligibility button with enhanced effects
        const checkButton = document.getElementById('checkEligibility');
        checkButton.addEventListener('click', () => this.runEligibilityCheck());

        // Checkbox interactions with crypto-style animations
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.addCheckboxEffect(checkbox);
            });
        });
    }

    addBlockchainEffects() {
        // Add floating animation to cards
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('animate-float');
        });

        // Add pulse effect to important elements
        const importantElements = document.querySelectorAll('.neon-border');
        importantElements.forEach(element => {
            element.classList.add('animate-pulse-slow');
        });
    }

    addGlowEffect(element) {
        element.classList.add('animate-glow');
        setTimeout(() => {
            element.classList.remove('animate-glow');
        }, 1000);
    }

    addSelectEffect(element) {
        element.style.transform = 'scale(1.02)';
        element.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
        setTimeout(() => {
            element.style.transform = '';
            element.style.boxShadow = '';
        }, 300);
    }

    addCheckboxEffect(checkbox) {
        const customCheckbox = checkbox.nextElementSibling;
        if (checkbox.checked) {
            customCheckbox.style.transform = 'scale(1.1)';
            customCheckbox.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.7)';
        }
        setTimeout(() => {
            customCheckbox.style.transform = '';
            customCheckbox.style.boxShadow = '';
        }, 300);
    }

    updateScoreDisplay() {
        const scoreSlider = document.getElementById('requiredScore');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const value = scoreSlider.value;
        scoreDisplay.textContent = value;
        
        // Update color based on threshold
        if (value >= 270) {
            scoreDisplay.className = 'bg-gradient-to-r from-green-400 to-blue-500 text-dark-bg px-4 py-2 rounded-lg font-mono font-bold min-w-[60px] text-center';
        } else if (value >= 240) {
            scoreDisplay.className = 'bg-gradient-to-r from-yellow-400 to-orange-500 text-dark-bg px-4 py-2 rounded-lg font-mono font-bold min-w-[60px] text-center';
        } else {
            scoreDisplay.className = 'bg-gradient-to-r from-red-400 to-pink-500 text-dark-bg px-4 py-2 rounded-lg font-mono font-bold min-w-[60px] text-center';
        }
    }

    updateProfileDetails() {
        const applicantSelect = document.getElementById('applicant');
        const profileInfo = document.getElementById('profileInfo');
        const selectedIndex = parseInt(applicantSelect.value);
        const profile = this.applicantProfiles[selectedIndex];

        profileInfo.innerHTML = `
            <div class="space-y-3">
                <p class="font-bold text-white text-lg">${profile.description}</p>
                <div class="space-y-2">
                    ${profile.details.map(detail => `
                        <div class="flex items-center space-x-2 text-sm">
                            <span class="w-2 h-2 bg-neon-blue rounded-full"></span>
                            <span class="text-blue-200">${detail}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add fade-in effect
        profileInfo.style.opacity = '0';
        setTimeout(() => {
            profileInfo.style.opacity = '1';
            profileInfo.style.transition = 'opacity 0.3s ease';
        }, 100);
    }

    async runEligibilityCheck() {
        try {
            // Get inputs
            const requiredScore = parseInt(document.getElementById('requiredScore').value);
            const relevant = this.getRelevantDisqualifiers();
            const applicantIndex = parseInt(document.getElementById('applicant').value);
            const profile = this.applicantProfiles[applicantIndex];

            // Show loading state with blockchain-style effects
            this.showLoading();

            // Simulate proof generation steps with enhanced animations
            await this.simulateProofGeneration();

            // Check eligibility logic
            const isEligible = this.checkEligibility(profile, requiredScore, relevant);

            // Show results with crypto-style presentation
            this.showResults(isEligible, profile, requiredScore, relevant);

        } catch (error) {
            console.error('Error during eligibility check:', error);
            this.showError(error.message);
        }
    }

    getRelevantDisqualifiers() {
        return [
            document.getElementById('disq0').checked ? 1 : 0, // felony
            document.getElementById('disq1').checked ? 1 : 0, // dui
            document.getElementById('disq2').checked ? 1 : 0, // license
            document.getElementById('disq3').checked ? 1 : 0, // misdemeanor
            document.getElementById('disq4').checked ? 1 : 0  // warrants
        ];
    }

    checkEligibility(profile, requiredScore, relevant) {
        // Check score requirement
        if (profile.score < requiredScore) {
            return false;
        }

        // Check disqualifiers
        for (let i = 0; i < relevant.length; i++) {
            if (relevant[i] === 1 && profile.disqualifiers[i] === 1) {
                return false; // Has a relevant disqualifier
            }
        }

        return true;
    }

    async simulateProofGeneration() {
        const steps = document.querySelectorAll('.step');
        
        // Step 1: Computing witness
        steps[0].classList.add('active');
        await this.delay(1200);
        
        // Step 2: Generating proof
        steps[0].classList.remove('active');
        steps[1].classList.add('active');
        await this.delay(1800);
        
        // Step 3: Verifying proof
        steps[1].classList.remove('active');
        steps[2].classList.add('active');
        await this.delay(1200);
        
        steps[2].classList.remove('active');
    }

    showLoading() {
        const button = document.getElementById('checkEligibility');
        const loadingContainer = document.getElementById('loadingContainer');
        const resultsSection = document.getElementById('resultsSection');

        // Disable button with crypto-style effect
        button.disabled = true;
        button.innerHTML = `
            <span class="flex items-center space-x-3">
                <div class="w-5 h-5 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin"></div>
                <span>Processing...</span>
            </span>
        `;
        button.classList.add('opacity-75', 'cursor-not-allowed');

        // Show loading with fade-in effect
        loadingContainer.classList.remove('hidden');
        loadingContainer.style.opacity = '0';
        setTimeout(() => {
            loadingContainer.style.opacity = '1';
            loadingContainer.style.transition = 'opacity 0.3s ease';
        }, 100);

        resultsSection.classList.add('hidden');

        // Reset loading steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
    }

    showResults(isEligible, profile, requiredScore, relevant) {
        const button = document.getElementById('checkEligibility');
        const loadingContainer = document.getElementById('loadingContainer');
        const resultsSection = document.getElementById('resultsSection');
        const resultContent = document.getElementById('resultContent');

        // Reset button
        button.disabled = false;
        button.innerHTML = `
            <span class="flex items-center space-x-3">
                <span>🔍</span>
                <span>Generate ZK Proof & Check Eligibility</span>
            </span>
        `;
        button.classList.remove('opacity-75', 'cursor-not-allowed');

        // Hide loading, show results with animation
        loadingContainer.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        resultsSection.style.opacity = '0';
        setTimeout(() => {
            resultsSection.style.opacity = '1';
            resultsSection.style.transition = 'opacity 0.5s ease';
        }, 100);

        // Generate result content with blockchain styling
        if (isEligible) {
            resultContent.innerHTML = `
                <div class="bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/50 rounded-xl p-6 text-center">
                    <div class="text-6xl mb-4">✅</div>
                    <h3 class="text-3xl font-bold text-green-400 mb-4 font-mono">ELIGIBLE</h3>
                    <p class="text-green-200 text-lg mb-4">The applicant meets all job requirements!</p>
                    <div class="bg-white/5 rounded-lg p-4 space-y-2 text-sm font-mono">
                        <div class="flex items-center justify-center space-x-2">
                            <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span>Meets minimum TruaScore requirement (≥${requiredScore})</span>
                        </div>
                        <div class="flex items-center justify-center space-x-2">
                            <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span>No relevant disqualifying factors present</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const failureReason = this.getFailureReason(profile, requiredScore, relevant);
            resultContent.innerHTML = `
                <div class="bg-gradient-to-r from-red-400/20 to-pink-500/20 border border-red-400/50 rounded-xl p-6 text-center">
                    <div class="text-6xl mb-4">❌</div>
                    <h3 class="text-3xl font-bold text-red-400 mb-4 font-mono">NOT ELIGIBLE</h3>
                    <p class="text-red-200 text-lg mb-4">The applicant does not meet job requirements.</p>
                    <div class="bg-white/5 rounded-lg p-4 text-sm font-mono">
                        <div class="flex items-center justify-center space-x-2">
                            <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                            <span>${failureReason}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Add privacy explanation with enhanced styling
        this.addPrivacyExplanation(resultContent, profile, requiredScore, relevant);
    }

    getFailureReason(profile, requiredScore, relevant) {
        if (profile.score < requiredScore) {
            return `TruaScore ${profile.score} below minimum requirement (${requiredScore})`;
        }

        const disqualifierNames = [
            'felony conviction',
            'DUI conviction', 
            'suspended license',
            'misdemeanor conviction',
            'outstanding warrants'
        ];

        for (let i = 0; i < relevant.length; i++) {
            if (relevant[i] === 1 && profile.disqualifiers[i] === 1) {
                return `Has relevant disqualifier: ${disqualifierNames[i]}`;
            }
        }

        return 'Does not meet requirements';
    }

    addPrivacyExplanation(container, profile, requiredScore, relevant) {
        const explanation = document.createElement('div');
        explanation.className = 'mt-6 bg-glass rounded-xl p-6 border border-neon-blue/30';
        
        explanation.innerHTML = `
            <div class="flex items-center space-x-3 mb-4">
                <span class="text-3xl">🔐</span>
                <h4 class="text-xl font-bold text-neon-blue font-mono">Zero-Knowledge Privacy</h4>
            </div>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div class="bg-white/5 rounded-lg p-4">
                    <h5 class="font-bold text-green-400 mb-2 font-mono">✅ What Employer Knows:</h5>
                    <ul class="space-y-1 text-green-200">
                        <li class="flex items-center space-x-2">
                            <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                            <span>Eligibility result (yes/no)</span>
                        </li>
                        <li class="flex items-center space-x-2">
                            <span class="w-1 h-1 bg-green-400 rounded-full"></span>
                            <span>Job requirements they set</span>
                        </li>
                    </ul>
                </div>
                <div class="bg-white/5 rounded-lg p-4">
                    <h5 class="font-bold text-red-400 mb-2 font-mono">🔒 What Remains Hidden:</h5>
                    <ul class="space-y-1 text-red-200">
                        <li class="flex items-center space-x-2">
                            <span class="w-1 h-1 bg-red-400 rounded-full"></span>
                            <span>Actual TruaScore (${profile.score})</span>
                        </li>
                        <li class="flex items-center space-x-2">
                            <span class="w-1 h-1 bg-red-400 rounded-full"></span>
                            <span>Specific disqualifier details</span>
                        </li>
                        <li class="flex items-center space-x-2">
                            <span class="w-1 h-1 bg-red-400 rounded-full"></span>
                            <span>Any other sensitive information</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;

        container.appendChild(explanation);
    }

    showError(message) {
        const button = document.getElementById('checkEligibility');
        const loadingContainer = document.getElementById('loadingContainer');
        const resultsSection = document.getElementById('resultsSection');
        const resultContent = document.getElementById('resultContent');

        // Reset button
        button.disabled = false;
        button.innerHTML = `
            <span class="flex items-center space-x-3">
                <span>🔍</span>
                <span>Generate ZK Proof & Check Eligibility</span>
            </span>
        `;
        button.classList.remove('opacity-75', 'cursor-not-allowed');

        loadingContainer.classList.add('hidden');
        resultsSection.classList.remove('hidden');

        resultContent.innerHTML = `
            <div class="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-xl p-6 text-center">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-3xl font-bold text-red-400 mb-4 font-mono">ERROR</h3>
                <p class="text-red-200 text-lg mb-4">An error occurred during proof generation:</p>
                <div class="bg-white/5 rounded-lg p-4 font-mono text-sm text-red-300 break-words">
                    ${message}
                </div>
            </div>
        `;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Real ZKP implementation (for when the circuit is ready)
class ZKPProofGenerator {
    constructor() {
        this.circuitWasm = null;
        this.circuitZkey = null;
        this.verificationKey = null;
    }

    async loadCircuit() {
        try {
            // Load the circuit files
            this.circuitWasm = await fetch('../build/eligibility_js/eligibility.wasm');
            this.circuitZkey = await fetch('../keys/eligibility_0001.zkey');
            this.verificationKey = await fetch('../keys/verification_key.json').then(r => r.json());
            
            console.log('✅ Circuit files loaded successfully');
            return true;
        } catch (error) {
            console.warn('⚠️ Circuit files not available, using simulation mode');
            return false;
        }
    }

    async generateProof(inputs) {
        if (!this.circuitWasm || !this.circuitZkey) {
            throw new Error('Circuit not loaded. Using simulation mode.');
        }

        try {
            // Generate the proof using SnarkJS
            const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                inputs,
                this.circuitWasm,
                this.circuitZkey
            );

            return { proof, publicSignals };
        } catch (error) {
            console.error('Proof generation failed:', error);
            throw error;
        }
    }

    async verifyProof(proof, publicSignals) {
        if (!this.verificationKey) {
            throw new Error('Verification key not loaded');
        }

        try {
            const isValid = await snarkjs.groth16.verify(
                this.verificationKey,
                publicSignals,
                proof
            );

            return isValid;
        } catch (error) {
            console.error('Proof verification failed:', error);
            throw error;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.zkpDemo = new ZKPJobDemo();
    window.zkpProofGenerator = new ZKPProofGenerator();
    
    // Try to load the circuit
    window.zkpProofGenerator.loadCircuit().then(loaded => {
        if (loaded) {
            console.log('✅ ZKP circuit loaded - real proofs available');
        } else {
            console.log('⚠️ ZKP circuit not available - using simulation mode');
        }
    });

    // Add some blockchain-style console messages
    console.log('🔐 ZKP Job Eligibility Demo Initialized');
    console.log('🚀 Blockchain-style UI loaded');
    console.log('⚡ Zero-Knowledge Proofs ready');
});