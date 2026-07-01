const express = require('express');
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Enable CORS for frontend interaction
app.use(cors());

// Webhook endpoint needs the raw body to verify signature
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle specific webhook events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} succeeded.`);
      
      // Extraction of metadata for UTMify or email integration
      const email = paymentIntent.receipt_email;
      const metadata = paymentIntent.metadata;
      
      // Here you can integrate your database, trigger email, or send tracking data to UTMify Conversions API
      console.log(`Purchase details: Email: ${email}, Metadata:`, metadata);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.error(`Payment failed for ${failedPaymentIntent.id}: ${failedPaymentIntent.last_payment_error?.message}`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// JSON parser for other endpoints
app.use(express.json());

// Serve static frontend files
app.use(express.static(__dirname));

// Secure endpoint to create a Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, email, name, utmParams } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 4900, // $49.00 USD
      currency: currency || 'usd',
      receipt_email: email,
      metadata: {
        customer_name: name,
        utm_source: utmParams?.utm_source || '',
        utm_medium: utmParams?.utm_medium || '',
        utm_campaign: utmParams?.utm_campaign || '',
        utm_content: utmParams?.utm_content || '',
        utm_term: utmParams?.utm_term || '',
        xcod: utmParams?.xcod || '',
        sck: utmParams?.sck || ''
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FOCL Media server listening on port ${PORT}`);
});
