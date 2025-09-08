const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/authRoutes');
const AdminRoutes = require('./routes/AdminRoutes');
const homeRoutes = require('./routes/homeRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require("./routes/orderRoutes");
const UserRoutes = require('./routes/UserRoutes');

const app = express();

const allowedOrigins = [
  "https://pradeepdev.site",
  "https://courageous-sundae-845cb0.netlify.app",
  "https://68bdc522b7237e490d403ec8--courageous-sundae-845cb0.netlify.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, curl
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS policy does not allow access from this origin."), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));



// Body parser
app.use(express.json());

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

// Handle preflight OPTIONS requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
