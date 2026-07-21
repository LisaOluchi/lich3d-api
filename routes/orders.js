const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const { ObjectId } = require('mongodb');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const orders = await db.collection('orders').find().toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single order by id
router.get('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const order = await db.collection('orders').findOne({ _id: new ObjectId(req.params.id) });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - create a new order
router.post('/', async (req, res) => {
  try {
    const { customerName, email, productId, quantity, status, orderDate } = req.body;

    if (!customerName || !email || !productId || !quantity || !status || !orderDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = await connectDB();
    const result = await db.collection('orders').insertOne({
      customerName, email, productId, quantity, status, orderDate
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;