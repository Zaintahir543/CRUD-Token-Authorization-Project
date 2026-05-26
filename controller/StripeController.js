require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const stripePayment = async (req, res) => {
    try{
        //Webhook Endpoint create karna (sirf demo k liye)
        const webhookEndpoint = await stripe.webhookEndpoints.create({
            enabled_events: ['charge.secceeded','charge.failed'],
            url: 'https://www.google.com',    // sirf demo/test url 
        });

    const session = await stripe.checkout.sessions.create({
        success_url: webhookEndpoint.url,   // webhook url ko sucess_url banaya
        cancel_url: 'http://localhost:5000/api/stipe/success',
        line_items: [
            {
                price: 'price_1S1lyk0MJNqlFGfXlFWziLrR',   // apna price id lagao
                quantity: 1,
            },
        ],
        mode: 'subscription',            //payment ki jaga subscription
        payment_method_types:['card']
    });

    res.json({ message: 'checkout created successfully', data: session });
} catch (err){
    res.status(500).json({error:err.message});
}
};

const stripePrice = async (req, res) => {
    try{
        const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: 1000 ,                        //akela likhy 1000 to wo cent me hoti na ki dollar me
        recurring: { interval: 'month'},
        product_data: {
            name: 'Gold Plan',
        },
    });

    res.json({ message: 'Price ID created', data: price });
} catch(err){
    res.status(500).json({error:err.message})
}
};

const getSuccess = async (req, res) => {
    res.json({ message: "payment or subscription done successfully" })
}

const getCheckout = async (req, res) => {
  try {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      res.json({ message: "Payment is confirmed", data: session });
    } else {
      res.json({ message: "Payment not completed", data: session });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { stripePayment, stripePrice, getSuccess, getCheckout };