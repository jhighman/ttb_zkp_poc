/**
 * In-Memory Database Implementation
 * 
 * This module provides an in-memory database that mimics MongoDB/Mongoose functionality
 * while preserving the MongoDB models and structure.
 */

// In-memory data stores
const stores = {
  jobs: [],
  applicants: [],
  applications: []
};

// Counter for generating unique IDs
const counters = {
  jobs: 1,
  applicants: 1,
  applications: 1
};

// Helper function to generate a unique ID
const generateId = (collection) => {
  const id = String(counters[collection]);
  counters[collection]++;
  return id;
};

// Helper function to find an item by ID
const findById = (collection, id) => {
  return stores[collection].find(item => item._id === id);
};

// Helper function to deep clone an object
const clone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Mock implementation of Mongoose model
 */
class InMemoryModel {
  constructor(name, schema, data) {
    // If this is a model definition (called from mongoose.model)
    if (name && schema) {
      this.name = name.toLowerCase() + 's'; // Collection name (e.g., 'jobs')
      this.schema = schema;
      
      // Initialize the collection if it doesn't exist
      if (!stores[this.name]) {
        stores[this.name] = [];
      }
      
      // Create a document constructor function
      this.Document = function(docData) {
        if (docData) {
          Object.assign(this, docData);
          
          // Add default values from schema
          if (schema && schema.obj) {
            Object.entries(schema.obj).forEach(([key, config]) => {
              if (this[key] === undefined && config.default !== undefined) {
                if (typeof config.default === 'function') {
                  this[key] = config.default();
                } else {
                  this[key] = config.default;
                }
              }
            });
          }
        }
      };
      
      // Add save method to document prototype
      this.Document.prototype.save = async function() {
        // If this is a new document, add an ID and insert it
        if (!this._id) {
          this._id = generateId(name.toLowerCase() + 's');
          
          // Apply timestamps if enabled
          if (schema.options && schema.options.timestamps) {
            const now = new Date();
            this.createdAt = now;
            this.updatedAt = now;
          }
          
          stores[name.toLowerCase() + 's'].push(clone(this));
        } else {
          // Update existing document
          const index = stores[name.toLowerCase() + 's'].findIndex(item => item._id === this._id);
          if (index !== -1) {
            // Apply timestamps if enabled
            if (schema.options && schema.options.timestamps) {
              this.updatedAt = new Date();
            }
            
            stores[name.toLowerCase() + 's'][index] = clone(this);
          }
        }
        
        return clone(this);
      };
      
      // Return a function that creates new documents
      return (docData) => {
        return new this.Document(docData);
      };
    }
    // If this is a document instance (called from new Model())
    else if (data) {
      return new this.Document(data);
    }
  }

  // Find all documents in the collection
  async find(query = {}) {
    let results = clone(stores[this.name]);
    
    // Apply filters if query is provided
    if (Object.keys(query).length > 0) {
      results = results.filter(item => {
        return Object.entries(query).every(([key, value]) => {
          // Handle special MongoDB operators
          if (typeof value === 'object' && value !== null) {
            // $regex operator
            if (value.$regex) {
              const regex = new RegExp(value.$regex, value.$options || '');
              return regex.test(item[key]);
            }
            
            // $gte operator
            if (value.$gte !== undefined) {
              return item[key] >= value.$gte;
            }
            
            // $in operator
            if (value.$in) {
              return value.$in.includes(item[key]);
            }
            
            // Handle nested objects (e.g., salary.min)
            if (key.includes('.')) {
              const [parent, child] = key.split('.');
              return item[parent] && item[parent][child] >= value.$gte;
            }
          }
          
          // Simple equality check
          return item[key] === value;
        });
      });
    }
    
    // Return a query object with chainable methods
    const queryObj = {
      sort: (criteria) => {
        // Implement basic sorting by postedDate
        if (criteria && criteria.postedDate === -1) {
          results.sort((a, b) => {
            const dateA = new Date(a.postedDate || 0);
            const dateB = new Date(b.postedDate || 0);
            return dateB - dateA; // Descending order
          });
        }
        // Return the query object for chaining
        return queryObj;
      },
      // Add other chainable methods as needed
      exec: async () => results,
      then: (resolve, reject) => {
        return Promise.resolve(results).then(resolve, reject);
      }
    };
    
    return queryObj;
  }

  // Find a document by ID
  async findById(id) {
    return clone(findById(this.name, id));
  }

  // Find a document by ID and update it
  async findByIdAndUpdate(id, update, options = {}) {
    const item = findById(this.name, id);
    if (!item) return null;
    
    // Apply updates
    Object.assign(item, update);
    
    // Apply timestamps if enabled
    if (this.schema.options && this.schema.options.timestamps) {
      item.updatedAt = new Date();
    }
    
    return options.new !== false ? clone(item) : null;
  }

  // Find a document by ID and delete it
  async findByIdAndDelete(id) {
    const index = stores[this.name].findIndex(item => item._id === id);
    if (index === -1) return null;
    
    const deleted = stores[this.name][index];
    stores[this.name].splice(index, 1);
    return clone(deleted);
  }

  // Create a new document
  async create(data) {
    // In this context, 'this' might not have Document property
    // So we'll create a document directly
    const doc = {
      ...data,
      _id: generateId(this.name)
    };
    
    // Apply timestamps if enabled
    if (this.schema && this.schema.options && this.schema.options.timestamps) {
      const now = new Date();
      doc.createdAt = now;
      doc.updatedAt = now;
    }
    
    // Add to store
    stores[this.name].push(clone(doc));
    
    return clone(doc);
  }

  // Sort results
  sort(criteria) {
    // This is a mock implementation that doesn't actually sort
    // In a real implementation, we would sort the results
    return this;
  }
}

/**
 * Mock implementation of Mongoose Schema
 */
class InMemorySchema {
  constructor(definition, options = {}) {
    this.obj = definition;
    this.options = options;
    this.indexes = [];
  }
  
  // Add index method to support compound indexes
  index(fields, options = {}) {
    this.indexes.push({ fields, options });
    return this; // For method chaining
  }
}

// Add Schema.Types to InMemorySchema
InMemorySchema.Types = {
  ObjectId: String, // Use String as a simple replacement for ObjectId
  String: String,
  Number: Number,
  Boolean: Boolean,
  Date: Date,
  Array: Array,
  Mixed: Object
};

/**
 * Mock implementation of Mongoose
 */
const inMemoryMongoose = {
  Schema: InMemorySchema,
  Types: InMemorySchema.Types,
  model: (name, schema) => {
    const model = new InMemoryModel(name, schema);
    
    // Add static methods to the model function
    const modelFn = model;
    
    // Create a context object with name and schema
    const context = { name: name.toLowerCase() + 's', schema };
    
    // Bind prototype methods to the model function
    modelFn.find = InMemoryModel.prototype.find.bind(context);
    modelFn.findById = InMemoryModel.prototype.findById.bind(context);
    modelFn.findByIdAndUpdate = InMemoryModel.prototype.findByIdAndUpdate.bind(context);
    modelFn.findByIdAndDelete = InMemoryModel.prototype.findByIdAndDelete.bind(context);
    modelFn.create = InMemoryModel.prototype.create.bind(context);
    
    return modelFn;
  },
  connect: async () => {
    console.log('Connected to in-memory database');
    return { connection: { host: 'in-memory' } };
  }
};

// Sample data for testing
const sampleData = {
  jobs: [
    {
      _id: '1',
      title: 'Senior Software Engineer',
      company: 'Trua Technologies',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our team to build privacy-preserving verification systems using Zero-Knowledge Proofs.',
      salary: {
        min: 120000,
        max: 180000,
        currency: 'USD'
      },
      requirements: {
        minTruaScore: 300,
        disqualifiers: {
          felony: true,
          dui: false,
          suspendedLicense: false,
          misdemeanor: false,
          warrants: true
        }
      },
      skills: ['JavaScript', 'Node.js', 'ZKP', 'Cryptography'],
      postedDate: new Date('2025-07-15').toISOString(),
      expiryDate: new Date('2025-08-15').toISOString(),
      status: 'Active',
      applications: 5,
      views: 120,
      createdAt: new Date('2025-07-15').toISOString(),
      updatedAt: new Date('2025-07-15').toISOString()
    },
    {
      _id: '2',
      title: 'Blockchain Developer',
      company: 'CryptoTrust Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Develop and implement blockchain solutions for our financial services clients.',
      salary: {
        min: 130000,
        max: 190000,
        currency: 'USD'
      },
      requirements: {
        minTruaScore: 280,
        disqualifiers: {
          felony: true,
          dui: false,
          suspendedLicense: false,
          misdemeanor: false,
          warrants: true
        }
      },
      skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'JavaScript'],
      postedDate: new Date('2025-07-10').toISOString(),
      expiryDate: new Date('2025-08-10').toISOString(),
      status: 'Active',
      applications: 8,
      views: 95,
      createdAt: new Date('2025-07-10').toISOString(),
      updatedAt: new Date('2025-07-10').toISOString()
    },
    {
      _id: '3',
      title: 'Privacy Engineer',
      company: 'SecureData Systems',
      location: 'Boston, MA',
      type: 'Full-time',
      description: 'Design and implement privacy-preserving systems for sensitive data handling.',
      salary: {
        min: 110000,
        max: 160000,
        currency: 'USD'
      },
      requirements: {
        minTruaScore: 290,
        disqualifiers: {
          felony: true,
          dui: true,
          suspendedLicense: true,
          misdemeanor: false,
          warrants: true
        }
      },
      skills: ['Cryptography', 'Data Privacy', 'Python', 'C++'],
      postedDate: new Date('2025-07-05').toISOString(),
      expiryDate: new Date('2025-08-05').toISOString(),
      status: 'Active',
      applications: 3,
      views: 78,
      createdAt: new Date('2025-07-05').toISOString(),
      updatedAt: new Date('2025-07-05').toISOString()
    }
  ],
  applicants: [
    {
      _id: '1',
      name: 'Applicant A',
      email: 'applicanta@example.com',
      profile: {
        truaScore: 320,
        disqualifiers: {
          felony: false,
          dui: false,
          suspendedLicense: false,
          misdemeanor: false,
          warrants: false
        }
      },
      createdAt: new Date('2025-07-01').toISOString(),
      updatedAt: new Date('2025-07-01').toISOString()
    },
    {
      _id: '2',
      name: 'Applicant B',
      email: 'applicantb@example.com',
      profile: {
        truaScore: 250,
        disqualifiers: {
          felony: false,
          dui: true,
          suspendedLicense: false,
          misdemeanor: false,
          warrants: false
        }
      },
      createdAt: new Date('2025-07-02').toISOString(),
      updatedAt: new Date('2025-07-02').toISOString()
    },
    {
      _id: '3',
      name: 'Applicant C',
      email: 'applicantc@example.com',
      profile: {
        truaScore: 290,
        disqualifiers: {
          felony: true,
          dui: false,
          suspendedLicense: false,
          misdemeanor: false,
          warrants: false
        }
      },
      createdAt: new Date('2025-07-03').toISOString(),
      updatedAt: new Date('2025-07-03').toISOString()
    }
  ],
  applications: []
};

// Initialize the database with sample data
const initializeDatabase = () => {
  // Reset stores
  stores.jobs = clone(sampleData.jobs);
  stores.applicants = clone(sampleData.applicants);
  stores.applications = clone(sampleData.applications);
  
  // Reset counters to be higher than the highest ID in the sample data
  counters.jobs = 4; // After 3 sample jobs
  counters.applicants = 4; // After 3 sample applicants
  counters.applications = 1;
  
  console.log('In-memory database initialized with sample data');
};

module.exports = {
  mongoose: inMemoryMongoose,
  initializeDatabase,
  stores
};