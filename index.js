const connectToMongo = require('./db');
connectToMongo();
const express = require('express');
const cors = require('cors');

// Connect to MongoDB
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.static(__dirname));

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin', require('./routes/customer'));
app.use('/api/admin', require('./routes/vandor'));
app.use('/api/admin', require('./routes/purchase'));
app.use('/api/admin', require('./routes/sales'));
app.use('/api/admin', require('./routes/item'));
app.use('/api/admin', require('./routes/payment'));

app.get('/', (req, res) => {
    res.json({ message: 'Hello MERN Stack!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Rackkon listening on port ${PORT}`);
});