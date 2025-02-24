'use client';
import Link from 'next/link';
import '@/styles/header.css';

export default function Header() {
  return (
    <div className="header-container">
      <ul className="nav-list">
        <li className="nav-item">
          <Link href="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link href="/about">About</Link>
        </li>
        <li className="nav-item">
          <Link href="/contact">Contact</Link>
        </li>
        <li className="nav-item">
          <Link href="/ecommerce">Ecommerce</Link>
        </li>
      </ul>
    </div>
  );
}