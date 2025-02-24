import express from 'express';
import cors from 'cors';
import pool from './db';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const { category, price, brand } = req.query;
    let query = 'SELECT * FROM products';
    const filters: string[] = [];

    if (category) filters.push(`category = '${category}'`);
    if (price) filters.push(`price <= ${price}`);
    if (brand) filters.push(`brand = '${brand}'`);

    if (filters.length > 0) {
      query += ' WHERE ' + filters.join(' AND ');
    }

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    // Handle the error properly
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).send('Server Error');
    } else {
      console.error('An unknown error occurred:', err);
      res.status(500).send('Server Error');
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});