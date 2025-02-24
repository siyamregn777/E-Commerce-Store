import Header from '@/components/header';
import Footer from '@/components/footer';
import '@/styles/home.css'
export default function Home() {
  return (
    <div className='high'>
      <Header />
      <h1 >Welcome to the E-Commerce Store</h1>
      <p>Explore our products, learn more about us, or get in touch!</p>
      <Footer />
    </div>
  );
}