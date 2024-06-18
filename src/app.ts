import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import { CartContent } from './types';

const app = express();

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json()); // Use built-in express.json() middleware

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/products', async (req: Request, res: Response) => {
  const PRODUCTS_URL = 'https://dummyjson.com/products';

  try {
    const productsResponse = await axios.get(PRODUCTS_URL);
    const products = productsResponse.data.products;
    res.send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const LOGIN_URL = 'https://dummyjson.com/auth/login';

  try {
    const response = await axios.post(LOGIN_URL, {
      username: username,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      res.send(response.data);
    } else {
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    res.status(401).send('Invalid credentials');
  }
});

app.post('/cart', async (req: Request, res: Response) => {
  const cartContent: CartContent = {
    grandTotal: 0,
    productList: [],
  };
  res.send(cartContent);
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('Not Found');
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Internal server error:', err);
  res.status(500).send('Something went wrong!');
});

export default app;
