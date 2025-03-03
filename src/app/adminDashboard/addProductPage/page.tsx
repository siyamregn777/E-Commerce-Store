'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct } from '../../../models/Product';
import './AddProductPage.css';
import { useUser } from '@/context/userContext'; // Import the user context

export default function AddProductPage() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    image: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser(); // Get the user from the context

  useEffect(() => {
    if (!user.isAuthenticated || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProduct({ ...product, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!user.isAuthenticated || user.role !== 'admin') {
        throw new Error('Unauthorized: Please log in to add a product.');
      }

      const newProduct = await addProduct({
        ...product,
        price: parseFloat(product.price),
        image: product.image!,
      });

      if (newProduct) {
        alert('Product added successfully!');
        router.push('/');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error instanceof Error ? error.message : 'Failed to add product.');
    }
  };

  return (
    <div className="add-product-container">
      <h1>Add New Product</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            name="category"
            value={product.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
          </select>
        </div>
        <div>
          <label>Brand:</label>
          <select
            name="brand"
            value={product.brand}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Brand</option>
            <option value="coca-cola">Coca-Cola</option>
            <option value="pepsi">Pepsi</option>
            <option value="nike">Nike</option>
            <option value="adidas">Adidas</option>
          </select>
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}