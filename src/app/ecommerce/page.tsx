'use client';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './ecommerce.css';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';
import ProductCarousel from './ProductCarousel';

interface Product {
  id: number;  
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image_url: string;
  discount?: number;
}

export default function Ecommerce() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    price: '1000',
    brand: '',
    sort: 'price_low',
  });
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products', { params: filters });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  return (
    <div className={`ecommerce-container ${darkMode ? 'dark-mode' : ''}`}>
      <header className="navbar">
        <h1 className="page-title">E-Commerce Store</h1>
        <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>
      <h5 className="page-title">Advertise and Promote Your Products Online Here</h5>
      <Link href="/addProductPage" className="add-product">Add Your New Product</Link>
      
      <ProductCarousel products={products} />
      
      <div className="filter-container">
        <div className="filter-item">
          <label htmlFor="category">Category:</label>
          <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="filter-input">
            <option value="">All</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="price">Max Price:</label>
          <input id="price" type="number" name="price" value={filters.price} onChange={handleFilterChange} className="filter-input" />
          <input id="price-range" type="range" name="price" min="0" max="1000" value={filters.price} onChange={handleFilterChange} className="price-slider" />
          <span> ${filters.price}</span>
        </div>
        <div className="filter-item">
          <label htmlFor="brand">Brand:</label>
          <select id="brand" name="brand" value={filters.brand} onChange={handleFilterChange} className="filter-input">
            <option value="">All</option>
            <option value="coca-cola">Coca-Cola</option>
            <option value="pepsi">Pepsi</option>
            <option value="nike">Nike</option>
            <option value="adidas">Adidas</option>
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="sort">Sort By:</label>
          <select id="sort" name="sort" value={filters.sort} onChange={handleFilterChange} className="filter-input">
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      <div className="product-list">
        {loading ? <LoadingSpinner /> : products.map((product) => (
          <div key={product.id} className="product-item">
            <Image src={product.image_url} alt={product.name} className="product-image" />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">Price: ${product.price} {product.discount && <span className="discount">-{product.discount}%</span>}</p>
            <p className="product-brand">Brand: {product.brand}</p>
            <button className="wishlist-btn" onClick={() => toggleWishlist(product.id)}>
              <FaHeart color={wishlist.includes(product.id) ? 'red' : 'gray'} />
            </button>
          </div>
        ))}
      </div>

      <div className="pagination">
        {/* Pagination logic here */}
      </div>

      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </button>
    </div>
  );
}
