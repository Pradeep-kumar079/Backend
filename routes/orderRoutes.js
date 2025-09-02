const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const verifyToken = require("../middleware/verifyToken");

router.post("/create",verifyToken, orderController.createOrder);
router.get("/verify-payment", orderController.verifyPayment);

module.exports = router;
  