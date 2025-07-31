# Trua ZKP Job Eligibility Demo

A comprehensive zero-knowledge proof demonstration showcasing privacy-preserving job eligibility verification, built to demonstrate Trua's vision for a privacy-first digital trust platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Python 3.x
- Git

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/jhighman/ttb_zkp_poc.git
   cd ttb_zkp_poc
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. Start the backend server:
   ```bash
   # Navigate to the backend directory
   cd backend
   
   # Start the backend server
   node src/server.js
   # Or for development with auto-reload:
   # npm run dev
   ```
   The backend server will start on port 5050.

4. In a new terminal window, start the frontend server:
   ```bash
   # Start the Python server to serve frontend files
   python server.py
   ```
   The frontend server will start on port 8001.

5. Open your browser:
   - **Main Application**: http://localhost:8001/src/index.html
   - **Investor Presentation**: http://localhost:8001/investor.html
   - **Technical Demo**: http://localhost:8001/index.html

## 📋 Project Structure

```
zkp-job-demo/
├── circuits/
│   └── eligibility.circom          # ZKP circuit definition
├── keys/
│   ├── eligibility_0000.zkey       # Setup key
│   ├── eligibility_0001.zkey       # Proving key
│   └── verification_key.json       # Verification key
├── src/
│   ├── investor.html               # Business presentation
│   ├── index.html                  # Technical demo
│   ├── app.js                      # Demo application logic
│   ├── tooltips.js                 # Educational content
│   ├── zkpVerifier.js              # ZKP verification logic
│   └── jobBoard/                   # Job board components
│       ├── components/             # UI components
│       ├── services/               # API services
│       └── utils/                  # Utility functions
├── backend/
│   ├── package.json                # Backend dependencies
│   └── src/
│       ├── server.js               # Express server
│       ├── inMemoryDb.js           # In-memory database
│       ├── controllers/            # API controllers
│       ├── models/                 # Data models
│       └── routes/                 # API routes
├── docs/
│   ├── README.md                   # Technical documentation
│   └── INVESTOR_OVERVIEW.md        # Business overview
├── package.json                    # Frontend dependencies
├── server.py                       # Frontend HTTP server
├── startup-instructions.md         # Startup guide
└── .gitignore                      # Git ignore rules
```

## 🔐 Zero-Knowledge Proof Technology

This demo implements a complete ZKP system using:

- **Circom**: Circuit definition language for ZKP constraints
- **SnarkJS**: JavaScript library for proof generation/verification
- **Groth16**: Efficient proving system for production use
- **Browser-based**: Real-time proof generation in web browsers

### How It Works

1. **Employer** sets job requirements (minimum TruaScore, relevant disqualifiers)
2. **Applicant** generates a zero-knowledge proof of eligibility
3. **Verification** confirms eligibility without revealing sensitive data

### Privacy Guarantees

- ✅ **Completeness**: Valid eligibility can always be proven
- ✅ **Soundness**: Invalid claims cannot be falsely proven
- ✅ **Zero-Knowledge**: No sensitive data is revealed beyond eligibility

## 🎯 Demo Features

### Investor Presentation (`investor.html`)
- Business context and market opportunity
- Trua's ZKP-powered trust infrastructure
- Industry impact across healthcare, finance, gig economy
- Technical innovation and competitive advantages

### Technical Demo (`index.html`)
- Interactive proof generation and verification
- Multiple applicant profiles with varied scenarios
- Educational tooltips explaining ZKP concepts
- Real-time cryptographic proof creation

### Job Board Application
- Browse and search job listings
- View job details and requirements
- Create applicant profiles
- Apply for jobs with ZKP verification
- Employer job posting and management

### Applicant Profiles
- **Applicant A**: Score=320, No disqualifiers ✅
- **Applicant B**: Score=250, Has DUI ⚠️
- **Applicant C**: Score=290, Has felony ❌
- **Applicant D**: Score=340, Has old misdemeanor ✅
- **Applicant E**: Score=180, Multiple issues 🚫

## 🖥️ API Endpoints

The backend server provides the following API endpoints:

### Jobs
- GET /api/jobs - Get all jobs
- GET /api/jobs/:id - Get a specific job
- POST /api/jobs - Create a new job
- PUT /api/jobs/:id - Update a job
- DELETE /api/jobs/:id - Delete a job

### Applicants
- GET /api/applicants - Get all applicants
- GET /api/applicants/:id - Get a specific applicant
- POST /api/applicants - Create a new applicant
- PUT /api/applicants/:id - Update an applicant
- DELETE /api/applicants/:id - Delete an applicant

### Applications
- GET /api/applications - Get all applications
- GET /api/applications/:id - Get a specific application
- POST /api/applications - Create a new application
- PUT /api/applications/:id - Update an application
- DELETE /api/applications/:id - Delete an application

### Employers
- GET /api/employers - Get all employers
- GET /api/employers/:id - Get a specific employer
- POST /api/employers - Create a new employer
- PUT /api/employers/:id - Update an employer
- DELETE /api/employers/:id - Delete an employer

## 🏗️ Technical Implementation

### ZKP Circuit (`eligibility.circom`)
```circom
template EligibilityCheck() {
    // Private inputs (hidden from verifier)
    signal private input score;
    signal private input disqualifier0;
    signal private input disqualifier1;
    signal private input disqualifier2;
    signal private input disqualifier3;
    signal private input disqualifier4;
    
    // Public inputs (known to verifier)
    signal input requiredScore;
    signal input checkDisqualifier0;
    signal input checkDisqualifier1;
    signal input checkDisqualifier2;
    signal input checkDisqualifier3;
    signal input checkDisqualifier4;
    
    // Output (public result)
    signal output eligible;
    
    // Implementation details...
}
```

### Key Components
- **Score Verification**: Proves score meets minimum threshold without revealing actual value
- **Disqualifier Logic**: Verifies absence of relevant disqualifiers using boolean constraints
- **Cryptographic Proof**: Generates mathematically verifiable proof of eligibility

## 🌐 Business Context

### Market Problem
Traditional verification exposes sensitive personal information:
- Social Security numbers
- Full background reports
- Detailed employment histories
- Complete financial records

### Trua's Solution
Zero-knowledge proofs enable verification without revelation:
- **Prove eligibility** without showing actual scores
- **Verify credentials** without exposing identifiers
- **Establish trust** while maintaining privacy
- **Ensure compliance** without data overexposure

### Target Industries
- **Healthcare**: Clinician license verification
- **Financial Services**: KYC/AML compliance
- **Gig Economy**: Driver/worker background checks
- **HR & Workforce**: Employee credential monitoring

## 📊 Performance Metrics

- **Proof Generation**: <2 seconds in browser
- **Proof Size**: ~200 bytes (highly efficient)
- **Verification Time**: <100ms
- **Computations**: 410M+ per TruaScore
- **Patents**: 6 issued patents protecting architecture

## 🔧 Development

### Building from Source
```bash
# Install Circom (if needed)
npm install -g circom

# Compile circuit
circom circuits/eligibility.circom --r1cs --wasm --sym

# Generate proving key (if needed)
snarkjs groth16 setup eligibility.r1cs powersOfTau28_hez_final_10.ptau eligibility_0000.zkey
```

### In-Memory Database

The application uses an in-memory database implementation that:

- Preserves the MongoDB models and structure
- Implements mock Mongoose methods (find, findById, save, etc.)
- Initializes with sample data
- Persists data for the duration of the server runtime

This allows the application to run without requiring a MongoDB instance, making it easier to develop and test.

### Git Setup and Deployment

The repository is already initialized and committed. To push to GitHub:

1. **Authenticate with GitHub** (choose one method):
   
   **Option A: Personal Access Token**
   ```bash
   # Generate a token at: https://github.com/settings/tokens
   git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/jhighman/ttb_zkp_poc.git
   git push -u origin main
   ```
   
   **Option B: SSH Key**
   ```bash
   # Add SSH key to GitHub: https://github.com/settings/keys
   git remote set-url origin git@github.com:jhighman/ttb_zkp_poc.git
   git push -u origin main
   ```
   
   **Option C: GitHub CLI**
   ```bash
   # Install GitHub CLI: https://cli.github.com/
   gh auth login
   git push -u origin main
   ```

2. **Verify deployment**:
   Visit https://github.com/jhighman/ttb_zkp_poc to confirm all files are uploaded.

### File Structure Notes
- **Large files excluded**: Powers of tau files are gitignored (download separately)
- **Keys included**: Pre-generated proving/verification keys for immediate demo use
- **Build artifacts**: Compiled circuits and WASM files included for convenience

## 📚 Documentation

- **Technical Details**: See [`docs/README.md`](docs/README.md)
- **Business Overview**: See [`docs/INVESTOR_OVERVIEW.md`](docs/INVESTOR_OVERVIEW.md)
- **Startup Instructions**: See [`startup-instructions.md`](startup-instructions.md)
- **Live Demo**: Run locally and visit http://localhost:8001/src/index.html

## 🤝 Contributing

This is a demonstration project showcasing Trua's ZKP technology. For production implementations or partnerships, contact the Trua team.

## 📄 License

This demonstration is provided for educational and evaluation purposes. All rights reserved by Trua.

---

**Built with ❤️ for privacy-preserving digital trust**

*Powered by Zero-Knowledge Proofs | Inspired by Trua's Vision*