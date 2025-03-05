//adminDashboard/page
'use client'; 
import  './adminDashboard.css'; 
import Link from 'next/link';
export default function AdminDashboard() {


  return (
    <div className='add'>
      Admin Dashboard
    
      <div className='mainn'>
      <Link href="/adminDashboard/register">Register</Link>
      <Link href="/adminDashboard/addProductPage">Add Product </Link>
      <Link href="/adminDashboard/deleteImage">Delete</Link>
      
      </div>
    
    </div>
  );
}