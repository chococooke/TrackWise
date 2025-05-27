const { verifyPayment, createOrder } = require("../controllers/payment.js");
const router = require("express").Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;
