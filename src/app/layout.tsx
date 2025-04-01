import { UserProvider } from '../context/userContext'; // Adjust the path as necessary
import Header from '../components/header';
import Footer from '@/components/footer';
import './globals.css'; // Optional: Global styles

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <html lang="en">
        <body>
          <Header isVisible={true} /> {/* Pass the required prop */}
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </UserProvider>
  );
}