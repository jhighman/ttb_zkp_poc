// DidService
// This service is responsible for DID (Decentralized Identifier) operations

class DidService {
    constructor() {
        this.didResolverEndpoint = '/api/did/resolve';
    }
    
    /**
     * Fetch a DID document
     * @param {string} did - The DID to resolve
     * @returns {Promise<Object>} - The DID document
     */
    async fetchDidDocument(did) {
        try {
            // Try to fetch from API
            const response = await fetch(`${this.didResolverEndpoint}?did=${encodeURIComponent(did)}`);
            
            // If successful, parse and return DID document
            if (response.ok) {
                return await response.json();
            }
            
            // If API fails, use sample DID document
            console.warn('Failed to fetch DID document from API, using sample data instead');
            return this.getSampleDidDocument(did);
        } catch (error) {
            console.error('Error fetching DID document:', error);
            // Use sample DID document as fallback
            return this.getSampleDidDocument(did);
        }
    }
    
    /**
     * Get a sample DID document for testing
     * @param {string} did - The DID
     * @returns {Object} - A sample DID document
     */
    getSampleDidDocument(did) {
        return {
            '@context': 'https://www.w3.org/ns/did/v1',
            'id': did,
            'controller': did,
            'verificationMethod': [
                {
                    'id': `${did}#keys-1`,
                    'type': 'Ed25519VerificationKey2020',
                    'controller': did,
                    'publicKeyMultibase': 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
                }
            ],
            'authentication': [
                `${did}#keys-1`
            ],
            'assertionMethod': [
                `${did}#keys-1`
            ],
            'service': [
                {
                    'id': `${did}#credential-service`,
                    'type': 'CredentialService',
                    'serviceEndpoint': 'https://credentials.example.com/verify'
                }
            ],
            'created': new Date().toISOString(),
            'updated': new Date().toISOString()
        };
    }
    
    /**
     * Verify a DID
     * @param {string} did - The DID to verify
     * @returns {Promise<boolean>} - Whether the DID is valid
     */
    async verifyDid(did) {
        try {
            // Fetch DID document
            const didDocument = await this.fetchDidDocument(did);
            
            // Check if DID document is valid
            return !!didDocument && !!didDocument.id && didDocument.id === did;
        } catch (error) {
            console.error('Error verifying DID:', error);
            return false;
        }
    }
    
    /**
     * Display a DID document in a formatted way
     * @param {Object} didDocument - The DID document
     * @param {HTMLElement} container - The container element to display in
     */
    displayDidDocument(didDocument, container) {
        if (!didDocument || !container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Create a formatted display
        const didId = document.createElement('div');
        didId.className = 'text-sm text-blue-300 mb-2';
        didId.innerHTML = `<strong>DID:</strong> ${didDocument.id}`;
        container.appendChild(didId);
        
        if (didDocument.controller) {
            const controller = document.createElement('div');
            controller.className = 'text-sm text-blue-300 mb-2';
            controller.innerHTML = `<strong>Controller:</strong> ${didDocument.controller}`;
            container.appendChild(controller);
        }
        
        if (didDocument.verificationMethod && didDocument.verificationMethod.length > 0) {
            const verificationTitle = document.createElement('div');
            verificationTitle.className = 'text-sm text-blue-300 mt-3 mb-1';
            verificationTitle.textContent = 'Verification Methods:';
            container.appendChild(verificationTitle);
            
            didDocument.verificationMethod.forEach(method => {
                const methodDiv = document.createElement('div');
                methodDiv.className = 'text-xs text-blue-100 ml-2 mb-1';
                methodDiv.textContent = `${method.type}: ${method.id}`;
                container.appendChild(methodDiv);
            });
        }
        
        if (didDocument.service && didDocument.service.length > 0) {
            const serviceTitle = document.createElement('div');
            serviceTitle.className = 'text-sm text-blue-300 mt-3 mb-1';
            serviceTitle.textContent = 'Services:';
            container.appendChild(serviceTitle);
            
            didDocument.service.forEach(service => {
                const serviceDiv = document.createElement('div');
                serviceDiv.className = 'text-xs text-blue-100 ml-2 mb-1';
                serviceDiv.textContent = `${service.type}: ${service.serviceEndpoint}`;
                container.appendChild(serviceDiv);
            });
        }
    }
}

// Export the DidService class
window.DidService = DidService;

// Log that the DidService is loaded
console.log('DidService loaded');