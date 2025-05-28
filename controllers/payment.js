const { isErrored } = require("nodemailer/lib/xoauth2/index.js");
const cashfree = require("../config/config.payment.js");
const { User } = require("../models/index.js");

async function createOrder(req, res) {
  try {
    const request = {
      order_amount: req.body.amount,
      order_currency: "INR",
      order_id: `order_${Date.now()}`,
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: req.body.username,
        customer_email: req.body.email,
        customer_phone: req.body.phone || "9999999999",
      },
    };

    request.order_meta = {
      return_url: `http://localhost:5000/payment-status?order_id=${request.order_id}`,
    };

    const response = await cashfree.PGCreateOrder(request);
    res.status(200).json({
      success: true,
      payment_session_id: response.data.payment_session_id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error creating order" });
  }
}

async function verifyPayment(req, res) {
  try {
    const { order_id, userId } = req.body;
    const response = await cashfree.PGFetchOrder(order_id);
    const paymentStatus = response.data.order_status;

    const user = await User.findByPk(userId, {
      attributes: ["username", "email", "premium", "id", "sessionToken"],
    });

    user.premium = true;
    await user.save();

    const currentUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      premium: user.premium,
      twToken: user.sessionToken,
    };

    res.json({
      success: true,
      status: paymentStatus,
      message: "Puchased premium successfully",
      redirect: "http://localhost:5000/app",
      user: currentUser,
    });
  } catch (err) {
    console.log(`Error verifying payment`, err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

module.exports = { createOrder, verifyPayment };
