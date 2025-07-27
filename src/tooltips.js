// Educational tooltips explaining ZKP concepts and demo functionality
// Enhanced for blockchain-style UI
const tooltipContent = {
    'zkp-intro': `
        <div class="space-y-2">
            <div class="font-bold text-neon-blue text-lg">Zero-Knowledge Proofs (ZKP)</div>
            <div class="text-sm text-blue-200">
                A cryptographic method that allows one party to prove they know a value without revealing the value itself. 
                In hiring, this means applicants can prove they meet job requirements without exposing sensitive personal data.
            </div>
            <div class="flex items-center space-x-2 mt-2">
                <span class="w-2 h-2 bg-neon-blue rounded-full"></span>
                <span class="text-xs text-blue-300 font-mono">Powered by advanced cryptography</span>
            </div>
        </div>
    `,
    
    'employer-role': `
        <div class="space-y-2">
            <div class="font-bold text-neon-blue text-lg">Employer's Role</div>
            <div class="text-sm text-blue-200">
                Set job requirements including minimum TruaScore and relevant disqualifiers. 
                You'll receive only a yes/no answer about eligibility - no sensitive applicant data is revealed.
            </div>
            <div class="bg-white/10 rounded p-2 mt-2">
                <div class="text-xs text-green-300 font-mono">✓ Privacy-preserving verification</div>
            </div>
        </div>
    `,
    
    'applicant-role': `
        <div class="space-y-2">
            <div class="font-bold text-neon-purple text-lg">Applicant's Role</div>
            <div class="text-sm text-purple-200">
                Generate a cryptographic proof that you meet the job requirements. 
                Your actual score and disqualifier details remain completely private throughout the process.
            </div>
            <div class="bg-white/10 rounded p-2 mt-2">
                <div class="text-xs text-purple-300 font-mono">🔒 Your data stays private</div>
            </div>
        </div>
    `,
    
    'trua-score': `
        <div class="space-y-2">
            <div class="font-bold text-neon-blue text-lg">TruaScore</div>
            <div class="text-sm text-blue-200">
                A numerical risk assessment (0-360) derived from background check data. 
                Higher scores indicate lower risk. Scores above 270 are generally acceptable, 
                while scores below 240 indicate significant concerns.
            </div>
            <div class="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div class="bg-red-500/20 rounded p-1 text-center">
                    <div class="text-red-300 font-mono">&lt;240</div>
                    <div class="text-red-200">Poor</div>
                </div>
                <div class="bg-yellow-500/20 rounded p-1 text-center">
                    <div class="text-yellow-300 font-mono">240-270</div>
                    <div class="text-yellow-200">Fair</div>
                </div>
                <div class="bg-green-500/20 rounded p-1 text-center">
                    <div class="text-green-300 font-mono">270+</div>
                    <div class="text-green-200">Good</div>
                </div>
            </div>
            <div class="text-xs text-blue-300 font-mono mt-2">🔐 Actual score remains hidden in ZK proof</div>
        </div>
    `,
    
    'disqualifiers': `
        <div class="space-y-2">
            <div class="font-bold text-neon-blue text-lg">Disqualifiers</div>
            <div class="text-sm text-blue-200">
                Specific background check items that may disqualify candidates regardless of their TruaScore. 
                Each disqualifier is modeled as a boolean (present/absent) derived from relevancy, recency, and type.
            </div>
            <div class="bg-white/10 rounded p-2 mt-2">
                <div class="text-xs text-blue-300 font-mono">Triplet Model: Relevancy × Recency × Type</div>
            </div>
        </div>
    `,
    
    'felony': `
        <div class="space-y-2">
            <div class="font-bold text-red-400 text-lg">Felony Disqualifier</div>
            <div class="text-sm text-red-200">
                Checks for felony convictions within the last 5 years. 
                Relevancy depends on the job type (e.g., more relevant for delivery drivers or financial positions).
            </div>
            <div class="bg-red-500/20 rounded p-2 mt-2">
                <div class="text-xs text-red-300 font-mono">⚠️ High-impact disqualifier</div>
            </div>
        </div>
    `,
    
    'dui': `
        <div class="space-y-2">
            <div class="font-bold text-orange-400 text-lg">DUI Disqualifier</div>
            <div class="text-sm text-orange-200">
                Driving Under the Influence convictions within the last 3 years. 
                Particularly relevant for positions requiring driving or operating machinery.
            </div>
            <div class="bg-orange-500/20 rounded p-2 mt-2">
                <div class="text-xs text-orange-300 font-mono">🚗 Transportation-related risk</div>
            </div>
        </div>
    `,
    
    'license': `
        <div class="space-y-2">
            <div class="font-bold text-yellow-400 text-lg">License Suspension</div>
            <div class="text-sm text-yellow-200">
                Current or recent driver's license suspension. 
                Critical for jobs requiring valid driving privileges.
            </div>
            <div class="bg-yellow-500/20 rounded p-2 mt-2">
                <div class="text-xs text-yellow-300 font-mono">📋 License status verification</div>
            </div>
        </div>
    `,
    
    'misdemeanor': `
        <div class="space-y-2">
            <div class="font-bold text-blue-400 text-lg">Misdemeanor Disqualifier</div>
            <div class="text-sm text-blue-200">
                Misdemeanor convictions within the last 3 years. 
                Impact varies by job type and specific nature of the offense.
            </div>
            <div class="bg-blue-500/20 rounded p-2 mt-2">
                <div class="text-xs text-blue-300 font-mono">⚖️ Context-dependent impact</div>
            </div>
        </div>
    `,
    
    'warrants': `
        <div class="space-y-2">
            <div class="font-bold text-purple-400 text-lg">Outstanding Warrants</div>
            <div class="text-sm text-purple-200">
                Active arrest warrants or pending legal issues. 
                Generally relevant across all job types for security and reliability concerns.
            </div>
            <div class="bg-purple-500/20 rounded p-2 mt-2">
                <div class="text-xs text-purple-300 font-mono">🚨 Active legal concerns</div>
            </div>
        </div>
    `,
    
    'profiles': `
        <div class="space-y-2">
            <div class="font-bold text-neon-purple text-lg">Applicant Profiles</div>
            <div class="text-sm text-purple-200">
                Pre-defined test cases showing different combinations of scores and disqualifiers. 
                In a real system, this data would come from actual background check providers.
            </div>
            <div class="space-y-1 mt-2 text-xs">
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span class="text-green-300 font-mono">High score, clean background</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <span class="text-yellow-300 font-mono">Borderline cases</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span class="text-red-300 font-mono">Disqualified scenarios</span>
                </div>
            </div>
        </div>
    `,
    
    'proof-generation': `
        <div class="space-y-2">
            <div class="font-bold text-neon-blue text-lg">ZK Proof Generation</div>
            <div class="text-sm text-blue-200">
                Creates a cryptographic proof that the applicant meets requirements without revealing:
            </div>
            <div class="space-y-1 mt-2 text-xs">
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span class="text-red-300">Actual TruaScore value</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span class="text-red-300">Specific disqualifier details</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span class="text-red-300">Any other sensitive information</span>
                </div>
            </div>
            <div class="bg-neon-blue/20 rounded p-2 mt-2">
                <div class="text-xs text-neon-blue font-mono">⚡ Powered by Groth16 SNARKs</div>
            </div>
        </div>
    `,
    
    'verification': `
        <div class="space-y-2">
            <div class="font-bold text-green-400 text-lg">Proof Verification</div>
            <div class="text-sm text-green-200">
                The employer can verify the proof is valid and the applicant meets requirements, 
                but learns nothing about the applicant's actual score or specific background details.
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div class="bg-green-500/20 rounded p-2">
                    <div class="text-green-300 font-mono">✓ Cryptographically secure</div>
                </div>
                <div class="bg-blue-500/20 rounded p-2">
                    <div class="text-blue-300 font-mono">⚡ Instant verification</div>
                </div>
            </div>
        </div>
    `,
    
    'privacy': `
        <div class="space-y-2">
            <div class="font-bold text-neon-blue text-lg">Privacy Preservation</div>
            <div class="text-sm text-blue-200">
                Zero-knowledge proofs ensure that:
            </div>
            <div class="space-y-1 mt-2 text-xs">
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span class="text-green-300">Applicants control their data disclosure</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span class="text-blue-300">Employers get necessary verification</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span class="text-purple-300">Sensitive details remain completely private</span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-neon-blue rounded-full"></span>
                    <span class="text-neon-blue">Trust is established without exposure</span>
                </div>
            </div>
            <div class="bg-glass rounded p-2 mt-2 border border-neon-blue/30">
                <div class="text-xs text-neon-blue font-mono">🔐 The future of privacy-preserving verification</div>
            </div>
        </div>
    `
};

class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.init();
    }

    init() {
        // Create tooltip element
        this.tooltip = document.getElementById('tooltip');
        
        // Add event listeners to all tooltip triggers
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('tooltip-trigger')) {
                this.showTooltip(e.target, e);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('tooltip-trigger')) {
                this.hideTooltip();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.tooltip.classList.contains('opacity-100')) {
                this.updateTooltipPosition(e);
            }
        });

        // Add click support for mobile
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tooltip-trigger')) {
                e.preventDefault();
                this.showTooltip(e.target, e);
                // Auto-hide after 5 seconds on mobile
                setTimeout(() => this.hideTooltip(), 5000);
            } else if (!this.tooltip.contains(e.target)) {
                this.hideTooltip();
            }
        });
    }

    showTooltip(trigger, event) {
        const tooltipKey = trigger.getAttribute('data-tooltip');
        const content = tooltipContent[tooltipKey];
        
        if (content) {
            this.tooltip.innerHTML = content;
            this.tooltip.classList.remove('opacity-0');
            this.tooltip.classList.add('opacity-100');
            this.updateTooltipPosition(event);
            
            // Add glow effect
            this.tooltip.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.3)';
        }
    }

    hideTooltip() {
        this.tooltip.classList.remove('opacity-100');
        this.tooltip.classList.add('opacity-0');
        this.tooltip.style.boxShadow = '';
    }

    updateTooltipPosition(event) {
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let left = event.clientX + 15;
        let top = event.clientY - tooltipRect.height - 15;
        
        // Adjust if tooltip goes off screen
        if (left + tooltipRect.width > viewportWidth - 20) {
            left = event.clientX - tooltipRect.width - 15;
        }
        
        if (top < 20) {
            top = event.clientY + 15;
        }
        
        // Ensure tooltip stays within viewport
        left = Math.max(20, Math.min(left, viewportWidth - tooltipRect.width - 20));
        top = Math.max(20, Math.min(top, viewportHeight - tooltipRect.height - 20));
        
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
    }
}

// Initialize tooltip manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TooltipManager();
    console.log('🔮 Enhanced tooltips initialized');
});

// Export for use in other modules
window.TooltipManager = TooltipManager;