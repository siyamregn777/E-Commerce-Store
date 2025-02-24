'use client';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    brand: '',
  });

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('/api/products', { params: filters });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div>
      <h1>E-Commerce Store</h1>
      <div>
        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <label>Max Price:</label>
        <input
          type="number"
          name="price"
          value={filters.price}
          onChange={handleFilterChange}
        />
        <label>Brand:</label>
        <input
          type="text"
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
        />
      </div>
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Brand: {product.brand}</p>
          </div>
        ))}
      </div>
    </div>
  );
}