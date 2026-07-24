require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');



const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});