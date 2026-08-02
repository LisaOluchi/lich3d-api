const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const { ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const ensureAuthenticated = require('../middleware/auth');

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     security:
 *       - googleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       401:
 *         description: Not logged in
 *       404:
 *         description: Product not found
 */
router.get('/',ensureAuthenticated, async (req, res) => {
    try {
        const db = await connectDB();
        const orders = await db.collection('orders').find().toArray();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by id
 *     security:
 *       - googleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single order
 *       401:
 *         description: Not logged in
 *       404:
 *         description: Order not found
 */
router.get('/:id',ensureAuthenticated, async (req, res) => {
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

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     security:
 *       - googleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               email:
 *                 type: string
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               status:
 *                 type: string
 *               orderDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not logged in
 */
router.post('/',ensureAuthenticated,
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

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order
 *     security:
 *       - googleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               email:
 *                 type: string
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               status:
 *                 type: string
 *               orderDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not logged in
 *       404:
 *         description: Order not found
 */
router.put('/:id',ensureAuthenticated,
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

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     security:
 *       - googleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted
 *       401:
 *         description: Not logged in
 *       404:
 *         description: Order not found
 */
router.delete('/:id',ensureAuthenticated, async (req, res) => {
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