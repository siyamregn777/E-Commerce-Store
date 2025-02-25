// src/app/page.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './ecommerce.css';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
}

export default function Ecommerce() {
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
    <div className="ecommerce-container">
      <h1 className="page-title">E-Commerce Store</h1>
      <div className="filter-container">
        <div className="filter-item">
          <label htmlFor="category">Category:</label>
          <input
            id="category"
            type="text"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-input"
            placeholder="Enter category"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="price">Max Price:</label>
          <input
            id="price"
            type="number"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            className="filter-input"
            placeholder="Enter max price"
          />
        </div>
        <div className="filter-item">
          <label htmlFor="brand">Brand:</label>
          <input
            id="brand"
            type="text"
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="filter-input"
            placeholder="Enter brand"
          />
        </div>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">Price: ${product.price}</p>
            <p className="product-brand">Brand: {product.brand}</p>
          </div>
        ))}
      </div>
      <Link href="/addProductPage">Add New Product</Link>
    </div>
  );
}