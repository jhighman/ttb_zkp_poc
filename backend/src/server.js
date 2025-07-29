const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { mongoose, initializeDatabase } = require('./inMemoryDb');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the ZKP Job Board API' });
});

// Define port (using 5050 instead of 5000 to avoid conflicts)
const PORT = process.env.PORT || 5050;

// Initialize in-memory database with sample data
initializeDatabase();

// Connect to in-memory database
mongoose.connect()
  .then(() => {
    console.log('Connected to in-memory database');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to in-memory database', err);
  });

// Import routes
const { jobRoutes, applicantRoutes, applicationRoutes } = require('./routes');

// Use routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/applications', applicationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;