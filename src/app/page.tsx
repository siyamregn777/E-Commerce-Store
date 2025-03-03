
import '@/styles/home.css'
import Image from 'next/image';
export default function Home() {
  return (
    <div className='high'>
      <div className='image-container'>
        <Image
          src="/home.webp"
          alt="Welcome to E-Commerce Store"
          width={1500}
          height={900}
          className='image'
        />
      </div>
      <div className='text'>
        <h1>Welcome to the E-Commerce Store</h1>
        <p>Explore our products, learn more about us, or get in touch!</p>
      </div>
    </div>
  );
}
