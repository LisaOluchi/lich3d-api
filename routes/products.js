const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const { ObjectId } = require('mongodb');

// GET all products
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.collection('products').find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product by id
router.get('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - create a new product
router.post('/', async (req, res) => {
  try {
    const { name, description, category, material, color, printTimeHours, price, inStock } = req.body;

    if (!name || !description || !category || !material || !color || printTimeHours === undefined || price === undefined || inStock === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = await connectDB();
    const result = await db.collection('products').insertOne({
      name, description, category, material, color, printTimeHours, price, inStock
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;