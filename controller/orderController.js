// controllers/orderController.js
const { Cashfree } = require("cashfree-pg");
const Order = require("../models/Order");

const cashfree = new Cashfree(
  Cashfree.SANDBOX, // change to Cashfree.PRODUCTION in live
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

//  Create Order
const createOrder = async (req, res) => {
  const { amount, customer, orderItems, shippingAddress } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Please login before buying." });
    }


    // 1. Create order in Cashfree
    const response = await cashfree.PGCreateOrder({
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customer.customer_id,
        customer_name: customer.customer_name,
        customer_email: customer.customer_email,
        customer_phone: customer.customer_phone,
      },
      order_meta: {
        return_url: `http://localhost:3000/payment/success?order_id={order_id}`,
      },
    });

    // 2. Save in DB with products
    const newOrder = new Order({
      user: customer.customer_id,
      orderItems,
      shippingAddress,
      totalAmount: amount,
      orderId: response.data.order_id,
      paymentSessionId: response.data.payment_session_id,
      paymentStatus: "Pending",
    });

    await newOrder.save();

    res.json({
      orderId: response.data.order_id,
      paymentSessionId: response.data.payment_session_id,
    });
  } catch (err) {
    console.error("Cashfree Error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
};

//  Verify Payment
const verifyPayment = async (req, res) => {
  const { order_id } = req.query;

  try {
    if (!order_id) return res.status(400).json({ error: "Missing order_id" });

    const response = await cashfree.PGFetchOrder(order_id);

    // Update DB after successful payment
    await Order.findOneAndUpdate(
      { orderId: order_id },
      { paymentStatus: response.data.order_status === "PAID" ? "Paid" : "Pending" },
      { new: true }
    );

    res.json({
      order_id: response.data.order_id,
      order_amount: response.data.order_amount,
      order_currency: response.data.order_currency,
      order_status: response.data.order_status,
      payment_method: response.data.payment_method || null,
    });
  } catch (err) {
    console.error("Verify Error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
