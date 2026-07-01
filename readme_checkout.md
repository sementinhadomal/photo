# FÕCL Media - Custom Stripe Checkout Integration

This package implements a fully custom checkout page embedded directly into the website using **Stripe Elements** on the frontend, and a secure **Node.js + Express** server on the backend.

## File Structure

```
├── .env                  # Environment secrets (STRIPE_SECRET_KEY, etc.)
├── .env.example          # Sample environment settings file
├── package.json          # Server dependencies and launch scripts
├── server.js             # Secure Express backend (Payment Intent, Webhooks)
├── index.html            # Landing page (Redirects all purchase buttons to checkout.html)
├── checkout.html         # Premium, embedded dark-mode custom Stripe Elements page
├── style.css             # Glassmorphic layout styling rules
├── script.js             # Delivery Dashboard translation loop
└── translations.js       # Core languages library mapping
```

## Setup Instructions

### 1. Install Node.js Dependencies
Navigate to your repository directory and run:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
- **`STRIPE_SECRET_KEY`**: Set to your Stripe Secret Key (`sk_live_...` or your `sk_test_...` development secret).
- **`STRIPE_WEBHOOK_SECRET`**: Get this from your Stripe Dashboard under Developers > Webhooks (or Stripe CLI during local testing).

### 3. Run Locally
Start the server in watch/development mode:
```bash
npm run dev
```
The server will boot on `http://localhost:3000`. Open `http://localhost:3000/index.html` in your browser.

---

## Stripe Webhook Setup

1. **Production Deployment**: Host the Express server on Vercel, Heroku, or your server environment.
2. **Configure Webhook**:
   - Go to the **Stripe Dashboard** -> **Developers** -> **Webhooks**.
   - Click **Add endpoint**.
   - Set the URL to: `https://yourdomain.com/webhook`
   - Select the events to listen to:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the generated **Signing secret** (`whsec_...`) and add it to your server `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## UTMify & Tracking Integration

### Frontend Scripts
The pixel and tracking codes are loaded on:
- **`index.html`** (lines 11-28)
- **`checkout.html`** (lines 11-28)

```html
<!-- UTMify Script -->
<script
  src="https://cdn.utmify.com.br/scripts/utms/latest.js"
  data-utmify-prevent-xcod-sck
  data-utmify-prevent-subids
  async
  defer
></script>
<!-- Pixel Script -->
<script>
  window.pixelId = "697185be2058fdd08c7d7436";
  // Injection script
</script>
```

### UTM Persistence
When the customer clicks on checkout, the parameters from the URL are automatically preserved and forwarded to the checkout view using the following helper:
```javascript
onclick="location.href='checkout.html' + window.location.search; return false;"
```
On `checkout.html`, these parameters are parsed and passed as `metadata` inside the Stripe Payment Intent call to allow complete attribution.
