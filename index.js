const express = require('express');
const cors = require('cors');
// const connectToMongo = require('./db');
const path = require('path');

// Connect to MongoDB
// connectToMongo();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.static(__dirname));

// Available routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
    res.json({ message: 'Hello MERN Stack!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Rackkon listening on port ${PORT}`);
});