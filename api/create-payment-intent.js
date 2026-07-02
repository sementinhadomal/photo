const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, currency, email, name, utmParams } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 4900,
      currency: currency || 'usd',
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        customer_name: name || '',
        utm_source: utmParams?.utm_source || '',
        utm_medium: utmParams?.utm_medium || '',
        utm_campaign: utmParams?.utm_campaign || '',
        utm_content: utmParams?.utm_content || '',
        utm_term: utmParams?.utm_term || '',
        xcod: utmParams?.xcod || '',
        sck: utmParams?.sck || ''
      }
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).json({ error: error.message });
  }
};
