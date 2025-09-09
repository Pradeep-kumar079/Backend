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
const orderRoutes = require('./routes/orderRoutes');
const UserRoutes = require('./routes/UserRoutes');

const app = express();

const allowedOrigins = [
  // "https://pradeepdev.site",
  // "https://courageous-sundae-845cb0.netlify.app",
  // "https://68bdc522b7237e490d403ec8--courageous-sundae-845cb0.netlify.app"
  "https://ecomp079.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);  // Allow Postman, curl
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS policy does not allow access from this origin."), false);
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

// Preflight requests
// app.options('*', cors({
//   origin: allowedOrigins,
//   credentials: true
// }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
