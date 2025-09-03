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

// Middlewares
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: ["https://pradeepdev.site", "https://courageous-sundae-845cb0.netlify.app"],
  credentials: true
}));


// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));



// authRoutes
app.use('/api/auth', authRoutes);
// adminRoutes
app.use('/api/admin', AdminRoutes);
// homeRoutes
app.use('/api/home', homeRoutes);
// userRoutes
app.use('/api/user', UserRoutes);
// cartRoutes
app.use('/api/cart', cartRoutes);
// orderRoutes
app.use('/api/order', orderRoutes);



// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
