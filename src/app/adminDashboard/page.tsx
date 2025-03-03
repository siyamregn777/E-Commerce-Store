//adminDashboard/page
'use client'; 
import styles from './adminDashboard.module.css'; 
import Link from 'next/link';
export default function AdminDashboard() {


  return (
    <div className={styles.add}>
      Admin Dashboard
    
      <div className={styles.mainn}>
      <Link href="/adminDashboard/register">Register</Link>
      <Link href="/adminDashboard/addProductPage">Add Product </Link>
      <Link href="/adminDashboard/deleteImage">Delete</Link>
      
      </div>
    
    </div>
  );
}