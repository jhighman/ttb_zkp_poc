# ZKP Job Eligibility Demo

A comprehensive demonstration of zero-knowledge proof technology for privacy-preserving job eligibility verification, inspired by Trua's trust platform.

## 🎯 Overview

This demo showcases how Zero-Knowledge Proofs (ZKPs) can revolutionize the hiring process by allowing applicants to prove they meet job requirements without revealing sensitive personal information. Employers receive definitive yes/no answers about eligibility while applicant privacy is completely preserved.

## 🔐 Key Benefits

### For Applicants
- **Complete Privacy**: Actual scores and background details remain hidden
- **Selective Disclosure**: Only eligibility status is revealed
- **Data Control**: Applicants maintain control over their sensitive information
- **Reduced Bias**: Employers can't make decisions based on irrelevant details

### For Employers
- **Verified Compliance**: Cryptographic proof of requirement satisfaction
- **Efficient Screening**: Quick yes/no answers without manual review
- **Legal Protection**: Reduced exposure to discriminatory hiring practices
- **Trust Without Exposure**: Verification without data liability

## 🏗️ Architecture

### Components

1. **Circom Circuit** (`circuits/eligibility.circom`)
   - Defines the zero-knowledge proof logic
   - Checks TruaScore thresholds and disqualifier constraints
   - Ensures privacy preservation through cryptographic constraints

2. **Web Interface** (`src/`)
   - Modern, responsive HTML/CSS/JavaScript application
   - Educational tooltips explaining ZKP concepts
   - Interactive employer and applicant interfaces

3. **Proof System**
   - SnarkJS for browser-based proof generation
   - Groth16 proving system for efficiency
   - Client-side verification for immediate results

## 📊 Demo Scenarios

### Applicant Profiles

| Profile | TruaScore | Disqualifiers | Expected Result |
|---------|-----------|---------------|-----------------|
| **Applicant A** | 320 | None | ✅ Eligible |
| **Applicant B** | 250 | DUI | ❌ Score borderline + DUI |
| **Applicant C** | 290 | Felony | ❌ Disqualified by felony |
| **Applicant D** | 340 | Old misdemeanor | ✅ Eligible (if not relevant) |
| **Applicant E** | 180 | Multiple issues | ❌ Poor score + multiple issues |

### Job Requirements

Employers can configure:
- **Minimum TruaScore**: 0-360 threshold
- **Relevant Disqualifiers**: 
  - Felony convictions (last 5 years)
  - DUI convictions (last 3 years)
  - License suspensions
  - Misdemeanor convictions (last 3 years)
  - Outstanding warrants

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.7+ (for local server)
- Modern web browser with JavaScript enabled

### Installation

1. **Clone and Setup**
   ```bash
   cd zkp-job-demo
   npm install
   ```

2. **Start the Demo Server**
   ```bash
   python3 server.py
   ```

3. **Open in Browser**
   Navigate to: `http://localhost:8000/index.html`

### Usage

1. **Set Job Requirements** (Employer)
   - Adjust minimum TruaScore using the slider
   - Select relevant disqualifiers for the position

2. **Select Applicant Profile**
   - Choose from predefined test profiles
   - Review profile details (normally hidden from employer)

3. **Generate Proof**
   - Click "Generate ZK Proof & Check Eligibility"
   - Watch the proof generation process
   - View results with privacy explanation

## 🔬 Technical Details

### ZKP Circuit Logic

The Circom circuit implements two main constraints:

1. **Score Verification**
   ```circom
   component scoreCheck = GreaterEqThan(10);
   scoreCheck.in[0] <== applicant_score;
   scoreCheck.in[1] <== required_score;
   scoreCheck.out === 1;
   ```

2. **Disqualifier Checks**
   ```circom
   for (var i = 0; i < n; i++) {
       component check = IsZero();
       check.in <== relevant[i] * disqualifier[i];
       check.out === 1;
   }
   ```

### Privacy Guarantees

- **Zero-Knowledge**: Proof reveals nothing beyond eligibility
- **Soundness**: Invalid proofs cannot be generated
- **Completeness**: Valid eligibility always produces valid proofs

### Performance Metrics

- **Proof Generation**: ~2-3 seconds (simulated)
- **Verification**: <100ms
- **Proof Size**: ~200 bytes
- **Circuit Constraints**: 30 total (21 non-linear, 9 linear)

## 🎓 Educational Features

### Interactive Tooltips

The demo includes comprehensive tooltips explaining:
- Zero-knowledge proof concepts
- TruaScore methodology
- Disqualifier modeling (relevancy, recency, type)
- Privacy preservation mechanisms
- Verification processes

### Workflow Visualization

Step-by-step demonstration of:
1. Employer requirement setting
2. Applicant proof generation
3. Cryptographic verification
4. Result interpretation

## 🔧 Development

### Project Structure
```
zkp-job-demo/
├── circuits/           # Circom circuit files
│   └── eligibility.circom
├── build/             # Compiled circuit artifacts
├── keys/              # Cryptographic keys
├── src/               # Web application
│   ├── index.html     # Main interface
│   ├── styles.css     # Enhanced styling
│   ├── app.js         # Application logic
│   └── tooltips.js    # Educational content
├── docs/              # Documentation
├── server.py          # Local development server
└── package.json       # Dependencies
```

### Building the Circuit

```bash
# Compile circuit
circom circuits/eligibility.circom --r1cs --wasm --sym -o build

# Generate powers of tau
npx snarkjs powersoftau new bn128 12 pot12_0000.ptau
npx snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau

# Setup proving/verification keys
npx snarkjs groth16 setup build/eligibility.r1cs pot12_0001.ptau keys/eligibility.zkey
npx snarkjs zkey export verificationkey keys/eligibility.zkey keys/verification_key.json
```

## 🎯 Use Cases

### Real-World Applications

1. **Financial Services**
   - Credit score verification without disclosure
   - Regulatory compliance checking
   - Risk assessment validation

2. **Healthcare**
   - License verification
   - Background check compliance
   - Certification validation

3. **Transportation**
   - Driver qualification verification
   - Safety record validation
   - Insurance requirement compliance

4. **Government Contracting**
   - Security clearance verification
   - Vendor qualification
   - Compliance validation

## 🔮 Future Enhancements

### Planned Features

1. **Advanced Disqualifiers**
   - Time-weighted scoring
   - Severity classifications
   - Industry-specific rules

2. **Integration Capabilities**
   - Background check provider APIs
   - HR system integration
   - Blockchain verification

3. **Enhanced Privacy**
   - Anonymous credentials
   - Selective disclosure protocols
   - Revocation mechanisms

4. **Scalability Improvements**
   - Batch verification
   - Recursive proofs
   - Layer 2 integration

## 📚 Resources

### Learning Materials
- [Circom Documentation](https://docs.circom.io/)
- [SnarkJS GitHub](https://github.com/iden3/snarkjs)
- [Zero-Knowledge Proofs: An Illustrated Primer](https://blog.cryptographyengineering.com/2014/11/27/zero-knowledge-proofs-illustrated-primer/)

### Related Projects
- [Trua Trust Platform](https://trua.com)
- [Iden3 Circom](https://github.com/iden3/circom)
- [ZK-SNARKs Explained](https://z.cash/technology/zksnarks/)

## 🤝 Contributing

This demo is designed for educational and demonstration purposes. For production implementations, consider:

- Formal security audits
- Trusted setup ceremonies
- Comprehensive testing
- Legal compliance review

## 📄 License

This project is provided for educational and demonstration purposes. Please review applicable licenses for production use.

---

**Built with ❤️ using Circom, SnarkJS, and modern web technologies**

*Demonstrating the future of privacy-preserving verification*