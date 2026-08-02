require('dotenv').config();
const express = require('express');
const app = express();
app.set('trust proxy', 1);
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
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
app.use('/auth', authRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});