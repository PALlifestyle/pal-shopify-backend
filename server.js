const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Shopify Configuration
const SHOPIFY_DOMAIN = 'p-a-l-premium-activities-lifestyle.myshopify.com';
const SHOPIFY_CLIENT_ID = 'ba8b82a6212fe55c4a747d7f9fbd7f25';
const SHOPIFY_CLIENT_SECRET = 'bab8b2a6212fe55c4a7474709fbd7f25';

// Get Shopify Access Token
async function getShopifyAccessToken() {
  try {
    const response = await axios.post(
      `https://${SHOPIFY_DOMAIN}/admin/oauth/access_token`,
      {
        client_id: SHOPIFY_CLIENT_ID,
        client_secret: SHOPIFY_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Shopify access token:', error.message);
    return null;
  }
}

// API Routes

// Get all orders from Shopify
app.get('/api/orders', async (req, res) => {
  try {
    const accessToken = await getShopifyAccessToken();
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Failed to authenticate with Shopify' });
    }

    const response = await axios.get(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/orders.json?limit=50`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      }
    );

    // Transform Shopify orders to our format
    const orders = response.data.orders.map(order => ({
      id: `#${order.order_number}`,
      date: order.created_at.split('T')[0],
      status: order.fulfillment_status || 'pending',
      total: `$${order.total_price}`,
      items: order.line_items.map(item => item.title).join(', '),
      shopifyId: order.id
    }));

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order details
app.get('/api/orders/:id', async (req, res) => {
  try {
    const accessToken = await getShopifyAccessToken();
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Failed to authenticate with Shopify' });
    }

    const response = await axios.get(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-01/orders/${req.params.id}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data.order);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'P.A.L. Shopify Backend is running' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`P.A.L. Shopify Backend running on port ${PORT}`);
});
