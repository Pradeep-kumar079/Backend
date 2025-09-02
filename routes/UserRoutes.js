const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getOrders, getUserDetails, updateUserDetails } = require('../controller/UserController');

// All orders of user
router.get('/get-orders', verifyToken, getOrders);

// Get user details
router.get("/", verifyToken, getUserDetails);

// Update user details
router.put("/", verifyToken, updateUserDetails);

module.exports = router;
