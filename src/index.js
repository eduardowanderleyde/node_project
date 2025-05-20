require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

// Connect to the database
connectDB();

// Start the server
app.listen(3000, () => console.log('Server is running on port 3000'));
