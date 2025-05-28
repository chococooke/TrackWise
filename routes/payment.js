const { verifyPayment, createOrder } = require("../controllers/payment.js");
const { isLoggedIn } = require("../middlewares/auth/loginMiddleware.js");
const router = require("express").Router();

router.post("/create-order", isLoggedIn, createOrder);
router.post("/verify-payment", isLoggedIn, verifyPayment);

module.exports = router;
