"use client";

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import { addProduct } from '../../../models/Product';
import './AddProductPage.css';

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
  // const router = useRouter();

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
      const newProduct = await addProduct({
        ...product,
        price: parseFloat(product.price),
        image: product.image!,
      });

      if (newProduct) {
        alert('Product added successfully!');
        setProduct({
          name: '',
          description: '',
          price: '',
          category: '',
          brand: '',
          image: null,
        });
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
            <option value="Clothing">Clothing</option>
            <option value="Outerwear">Outerwear</option>
            <option value="Footwear">Footwear</option>
            <option value="Computers">Computers</option>
            <option value="Footwear">Footwear</option>
            <option value="Accessories">Accessories</option>
            <option value="Eyewear">Eyewear</option>
          

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
            <option value="puma">Puma</option>
            <option value="TrendyWear">TrendyWear</option>
            <option value="Gucci">Gucci</option>
            <option value="PowerTech">PowerTech</option>
            <option value="HP">HP</option>
            <option value="Apple">Apple</option>
            <option value="Dell">Dell</option>
            <option value="Nike">Nike</option>
            <option value="SpeedStride">SpeedStride</option>
            <option value="Sony">Sony</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Acer">Acer</option>
            <option value="Lenovo">Lenovo</option>
            <option value="Asus">Asus</option>
            <option value="Samsung">Samsung</option>
            <option value="Levi’s">Levi`s</option>
            <option value="Columbia">Columbia</option>
            <option value="Ray-Ban">Ray-Ban</option>
            <option value="Oakley">Oakley</option>
            <option value="Gucci">Gucci</option>
            <option value="Prada">Prada</option>
            <option value="Persol">Persol</option>
            <option value="Tom Ford">Tom Ford</option>
            <option value="Versace">Versace</option>
            <option value="Maui Jim">Maui Jim</option>
            <option value="Burberry">Burberry</option>
            <option value="Dolce & Gabbana">Dolce & Gabbana</option>
            <option value="Hugo Boss">Hugo Boss</option>
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