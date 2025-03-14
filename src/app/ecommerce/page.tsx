'use client';
import { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import './ecommerce.css';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProductCarousel from '../../components/ProductCarousel';
import { fetchProducts } from '../../models/Product';
import { Product } from '../../types/Product';
import Link from 'next/link';

const categoryOptions = [
  { value: '', label: 'All' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Outerwear', label: 'Outerwear' },
  { value: 'Footwear', label: 'Footwear' },
  { value: 'Computers', label: 'Computers' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Eyewear', label: 'Eyewear' },
];

const brandOptions = [
  { value: '', label: 'All' },
  { value: 'coca-cola', label: 'Coca-Cola' },
  { value: 'pepsi', label: 'Pepsi' },
  { value: 'nike', label: 'Nike' },
  { value: 'adidas', label: 'Adidas' },
  { value: 'puma', label: 'Puma' },
  { value: 'TrendyWear', label: 'TrendyWear' },
  { value: 'Gucci', label: 'Gucci' },
  { value: 'PowerTech', label: 'PowerTech' },
  { value: 'HP', label: 'HP' },
  { value: 'Apple', label: 'Apple' },
  { value: 'Dell', label: 'Dell' },
  { value: 'SpeedStride', label: 'SpeedStride' },
  { value: 'Sony', label: 'Sony' },
  { value: 'Xiaomi', label: 'Xiaomi' },
  { value: 'Acer', label: 'Acer' },
  { value: 'Lenovo', label: 'Lenovo' },
  { value: 'Asus', label: 'Asus' },
  { value: 'Samsung', label: 'Samsung' },
  { value: 'Levi’s', label: 'Levi`s' },
  { value: 'Columbia', label: 'Columbia' },
  { value: 'Ray-Ban', label: 'Ray-Ban' },
  { value: 'Oakley', label: 'Oakley' },
  { value: 'Prada', label: 'Prada' },
  { value: 'Persol', label: 'Persol' },
  { value: 'Tom Ford', label: 'Tom Ford' },
  { value: 'Versace', label: 'Versace' },
  { value: 'Maui Jim', label: 'Maui Jim' },
  { value: 'Burberry', label: 'Burberry' },
  { value: 'Dolce & Gabbana', label: 'Dolce & Gabbana' },
  { value: 'Hugo Boss', label: 'Hugo Boss' },
];

export default function Ecommerce() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    price: '1000',
    brand: '',
    sort: 'price_low',
    search: '',
  });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Fetch products based on filters
  const fetchProductsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  // Toggle wishlist
  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className="ecommerce-container">
      <header className="navbar">
        <h1 className="page-title">E-Commerce Store</h1>
        <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>
      <h5 className="page-title">Advertise and Promote Your Products Online Here</h5>

      <ProductCarousel products={products} />

      <div className="filter-container">
        {/* Search by Product Name */}
        <div className="filter-item">
          <label htmlFor="search">Search:</label>
          <input
            id="search"
            type="text"
            name="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by product name"
            className="filter-input"
          />
        </div>

        {/* Category Dropdown */}
        <div className="filter-item">
          <label htmlFor="category">Category:</label>
          <Select
            id="category"
            options={categoryOptions}
            value={categoryOptions.find((option) => option.value === filters.category)}
            onChange={(selectedOption) =>
              handleFilterChange('category', selectedOption?.value || '')
            }
            placeholder="Select Category"
            isSearchable
          />
        </div>

        {/* Brand Dropdown */}
        <div className="filter-item">
          <label htmlFor="brand">Brand:</label>
          <Select
            id="brand"
            options={brandOptions}
            value={brandOptions.find((option) => option.value === filters.brand)}
            onChange={(selectedOption) =>
              handleFilterChange('brand', selectedOption?.value || '')
            }
            placeholder="Select Brand"
            isSearchable
          />
        </div>

        {/* Price Range */}
        <div className="filter-item">
          <label htmlFor="price">Max Price:</label>
          <input
            id="price"
            type="number"
            name="price"
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            className="filter-input"
          />
          <input
            id="price-range"
            type="range"
            name="price"
            min="0"
            max="1000"
            value={filters.price}
            onChange={(e) => handleFilterChange('price', e.target.value)}
            className="price-slider"
          />
          <span> ${filters.price}</span>
        </div>

        {/* Sort By */}
        <div className="filter-item">
          <label htmlFor="sort">Sort By:</label>
          <select
            id="sort"
            name="sort"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="filter-input"
          >
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="product-list">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="product-item">
                <div className="product-image-container">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="product-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/home.webp';
                      }}
                    />
                  ) : (
                    <Image
                      src="/images/placeholder.jpg"
                      alt="Placeholder"
                      width={200}
                      height={200}
                      className="product-image"
                    />
                  )}
                </div>
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: ${product.price}</p>
                <p className="product-brand">Brand: {product.brand}</p>
                <button
                  className="wishlist-btn"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <FaHeart color={wishlist.includes(product.id) ? 'red' : 'gray'} />
                </button>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {/* Pagination logic here */}
      </div>

      {/* Back to Top Button */}
      <button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
}