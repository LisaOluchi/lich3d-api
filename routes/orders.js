const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const { ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');

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
router.post('/',
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('productId').notEmpty().withMessage('Product id is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('status').notEmpty().withMessage('Status is required'),
    body('orderDate').notEmpty().withMessage('Order date is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { customerName, email, productId, quantity, status, orderDate } = req.body;
            const db = await connectDB();
            const result = await db.collection('orders').insertOne({
                customerName, email, productId, quantity, status, orderDate
            });

            res.status(201).json({ id: result.insertedId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// PUT - update an order
router.put('/:id',
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('productId').notEmpty().withMessage('Product id is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('status').notEmpty().withMessage('Status is required'),
    body('orderDate').notEmpty().withMessage('Order date is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { customerName, email, productId, quantity, status, orderDate } = req.body;
            const db = await connectDB();
            const result = await db.collection('orders').updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: { customerName, email, productId, quantity, status, orderDate } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.status(200).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// DELETE - remove an order
router.delete('/:id', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.collection('orders').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;