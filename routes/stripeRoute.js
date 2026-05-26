const router = require('express').Router()

const { stripePayment, stripePrice, getSuccess, getCheckout } = require('../controller/StripeController')

router.post('/checkout', stripePayment);
router.post('/price', stripePrice);
router.get('/success', getSuccess);
router.get('/fetch', getCheckout);

// // ✅ Create subscription
// router.post('/subscribe', createSubscription);

// // ✅ Get all subscriptions
// router.get('/subscriptions', getSubscriptions);

module.exports = router;