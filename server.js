const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Shopify Configuration
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN || 'p-a-l-premium-activities-lifestyle.myshopify.com';
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || 'ba8b82a6212fe55c4a747d7f9fbd7f25';
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || 'bab8b2a6212fe55c4a7474709fbd7f25';

// Demo orders - fallback when API fails
const DEMO_ORDERS = [
  {
    id: '#PAL-001',
    date: '2024-04-20',
    status: 'completed',
    total: '$2,500.00',
    items: 'Concierge Service - April'
  },
  {
    id: '#PAL-002',
    date: '2024-04-15',
    status: 'processing',
    total: '$1,200.00',
    items: 'Lifestyle Consulting'
  },
  {
    id: '#PAL-003',
    date: '2024-04-10',
    status: 'completed',
    total: '$3,500.00',
    items: 'Event Planning'
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'P.A.L. Shopify Backend is running' });
});

// Get orders - returns demo data for now
// In production, this would connect to Shopify GraphQL API
app.get('/api/orders', async (req, res) => {
  try {
    // For now, return demo orders
    // This endpoint is ready for real Shopify integration when credentials are available
    res.json(DEMO_ORDERS);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.json(DEMO_ORDERS);
  }
});

// Get single order details
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = DEMO_ORDERS.find(o => o.id === req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`P.A.L. Shopify Backend running on port ${PORT}`);
  console.log(`Demo orders available at http://localhost:${PORT}/api/orders`);
});
