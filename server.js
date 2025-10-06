// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the express app
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());
// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

// --- Database Connection ---
// Get the MongoDB connection string from environment variables
const dbURI = process.env.MONGODB_URI;

// Check if the database URI is provided
if (!dbURI) {
  console.error('MongoDB URI not found. Please set MONGODB_URI environment variable.');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(dbURI)
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// --- Database Schema and Model ---
// Define the structure for the data we want to save
const businessSchema = new mongoose.Schema({
  businessName: String,
  businessType: String,
  calendarProvider: String,
  startTime: String,
  endTime: String,
  createdAt: { type: Date, default: Date.now }
});

// Create a model from the schema, which represents a collection in the database
const Business = mongoose.model('Business', businessSchema);

// --- API Routes ---
// Welcome route for the root URL
app.get('/', (req, res) => {
  res.send('Diamond AI Backend is running!');
});

// Endpoint to handle the data from the setup assistant
app.post('/api/assistant-setup', async (req, res) => {
  try {
    // Create a new business document with the data from the request body
    const newBusiness = new Business({
      businessName: req.body.businessName,
      businessType: req.body.businessType,
      calendarProvider: req.body.calendarProvider,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });

    // Save the document to the database
    const savedBusiness = await newBusiness.save();
    
    console.log('Saved new business setup:', savedBusiness);
    
    // Send a success response back to the frontend
    res.status(201).json({ message: 'Setup data saved successfully!', data: savedBusiness });

  } catch (error) {
    console.error('Error saving setup data:', error);
    // Send an error response if something goes wrong
    res.status(500).json({ message: 'Failed to save setup data.' });
  }
});

// --- Start the Server ---
// Make the server listen for requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

