const express = require('express');
const router = express.Router();
const connectDB = require('../db');
const { ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/', async (req, res) => {
    try {
        const db = await connectDB();
        const products = await db.collection('products').find().toArray();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product
 *       404:
 *         description: Product not found
 */
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



/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               material:
 *                 type: string
 *               color:
 *                 type: string
 *               printTimeHours:
 *                 type: number
 *               price:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 */
router.post('/',
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('material').notEmpty().withMessage('Material is required'),
    body('color').notEmpty().withMessage('Color is required'),
    body('printTimeHours').isNumeric().withMessage('Print time must be a number'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('inStock').isBoolean().withMessage('inStock must be true or false'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, description, category, material, color, printTimeHours, price, inStock } = req.body;
            const db = await connectDB();
            const result = await db.collection('products').insertOne({
                name, description, category, material, color, printTimeHours, price, inStock
            });

            res.status(201).json({ id: result.insertedId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);


/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               material:
 *                 type: string
 *               color:
 *                 type: string
 *               printTimeHours:
 *                 type: number
 *               price:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 */
router.put('/:id',
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('material').notEmpty().withMessage('Material is required'),
    body('color').notEmpty().withMessage('Color is required'),
    body('printTimeHours').isNumeric().withMessage('Print time must be a number'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('inStock').isBoolean().withMessage('inStock must be true or false'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, description, category, material, color, printTimeHours, price, inStock } = req.body;
            const db = await connectDB();
            const result = await db.collection('products').updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: { name, description, category, material, color, printTimeHours, price, inStock } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.status(200).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
// DELETE - remove a product
router.delete('/:id', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;