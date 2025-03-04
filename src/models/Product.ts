import { supabase } from '../../lib/supabaseClient';

export interface Product {
  id: string; // UUID
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image_url: string;
  discount?: number;
  created_at?: string; // Optional: Timestamp
}

// Utility function to upload an image to Supabase Storage
const uploadImage = async (image: File) => {
  const imageName = `${Date.now()}-${image.name}`;
  const { error: imageError } = await supabase.storage
    .from('product-images')
    .upload(imageName, image);

  if (imageError) throw new Error('Failed to upload image: ' + imageError.message);

  const { data: imageUrl } = supabase.storage
    .from('product-images')
    .getPublicUrl(imageName);

  return imageUrl.publicUrl;
};

// Validate product data before adding or updating
const validateProduct = (product: {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image?: File;
}) => {
  if (!product.name.trim()) throw new Error('Product name is required.');
  if (!product.description.trim()) throw new Error('Product description is required.');
  if (product.price <= 0) throw new Error('Price must be greater than 0.');
  if (!product.category) throw new Error('Category is required.');
  if (!product.brand) throw new Error('Brand is required.');
  if (product.image && !(product.image instanceof File)) throw new Error('Invalid image file.');
};

// Add a new product with image upload
export const addProduct = async (product: {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image: File;
}) => {
  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price.toString());
  formData.append('category', product.category);
  formData.append('brand', product.brand);
  formData.append('image', product.image);

  const response = await fetch('/api/products', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to add product');
  }

  return response.json();
};

// Fetch all products with optional filters and pagination
export const fetchProducts = async (
  filters: {
    category?: string;
    price?: string;
    brand?: string;
    sort?: string;
  },
  page: number = 1,
  limit: number = 10
) => {
  try {
    let query = supabase.from('products').select('*');

    // Apply filters
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.brand) query = query.eq('brand', filters.brand);
    if (filters.price) query = query.lte('price', filters.price);

    // Apply sorting
    if (filters.sort === 'price_low') {
      query = query.order('price', { ascending: true });
    } else if (filters.sort === 'price_high') {
      query = query.order('price', { ascending: false });
    } else if (filters.sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Update a product (including image if provided)
export const updateProduct = async (
  id: string,
  updates: Partial<Product>,
  newImage?: File
) => {
  try {
    // Validate updates (excluding optional fields like discount and created_at)
    validateProduct({
      name: updates.name || '', // Provide default values for required fields
      description: updates.description || '',
      price: updates.price || 0,
      category: updates.category || '',
      brand: updates.brand || '',
      image: newImage || undefined, // Pass the new image if provided
    });

    // If a new image is provided, upload it and delete the old one
    if (newImage) {
      const { data: existingProduct, error: fetchError } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', id)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      // Delete the old image from storage
      if (existingProduct?.image_url) {
        const oldImageName = existingProduct.image_url.split('/').pop();
        await supabase.storage.from('product-images').remove([oldImageName]);
      }

      // Upload the new image
      updates.image_url = await uploadImage(newImage);
    }

    // Update the product in the database
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data ? data[0] : null;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string) => {
  try {
    // Fetch the product to get the image URL
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    // Delete the image from storage
    if (existingProduct?.image_url) {
      const imageName = existingProduct.image_url.split('/').pop();
      await supabase.storage.from('product-images').remove([imageName]);
    }

    // Delete the product from the database
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
