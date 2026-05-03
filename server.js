const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for orders (in production, use a database)
let orders = [
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

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Webhook endpoint for Shopify to send order data
// This endpoint receives order data from Shopify webhooks
app.post('/api/webhooks/orders/create', (req, res) => {
  try {
    const shopifyOrder = req.body;
    
    // Transform Shopify order to our format
    const order = {
      id: `#${shopifyOrder.order_number || shopifyOrder.id}`,
      date: new Date(shopifyOrder.created_at).toISOString().split('T')[0],
      status: shopifyOrder.fulfillment_status ? shopifyOrder.fulfillment_status.toLowerCase() : 'pending',
      total: `$${shopifyOrder.total_price}`,
      items: shopifyOrder.line_items 
        ? shopifyOrder.line_items.map(item => item.title).join(', ')
        : 'Order'
    };
    
    // Add to orders list
    orders.unshift(order);
    
    // Keep only last 100 orders
    if (orders.length > 100) {
      orders = orders.slice(0, 100);
    }
    
    console.log('Order received from Shopify webhook:', order);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Webhook endpoint for order updates
app.post('/api/webhooks/orders/updated', (req, res) => {
  try {
    const shopifyOrder = req.body;
    
    // Find and update existing order
    const orderIndex = orders.findIndex(o => o.id === `#${shopifyOrder.order_number}`);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = shopifyOrder.fulfillment_status 
        ? shopifyOrder.fulfillment_status.toLowerCase() 
        : 'pending';
      orders[orderIndex].total = `$${shopifyOrder.total_price}`;
      
      console.log('Order updated from Shopify webhook:', orders[orderIndex]);
      res.json({ success: true, order: orders[orderIndex] });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`P.A.L. Shopify Backend running on port ${PORT}`);
  console.log(`Webhook endpoints:`);
  console.log(`  POST /api/webhooks/orders/create`);
  console.log(`  POST /api/webhooks/orders/updated`);
});
