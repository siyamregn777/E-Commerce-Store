'use client';
import Image from 'next/image';
import './about.css';
// import image1 from '../../../public/pexels-ketut-subiyanto-4247721.jpg'
export default function About() {
  return (
    <>
      <h1 className="aboutHeader">About Us</h1>
      <div className="aboutMain">
        <div className="imageContainer">
          <Image
            src="/pexels-ketut-subiyanto-4247721.jpg"
            alt="About Us"
            width={500}
            height={300}
            className="image"
          />
        </div>
        <div className="description">
          <ul>
            <li>
              <strong>Mission & Vision:</strong>
              <p>
                At <strong>ShopEase</strong>, our mission is to revolutionize the way people shop online by providing a seamless, secure, and enjoyable shopping experience. We envision a world where everyone has access to high-quality products at affordable prices, delivered right to their doorstep. Our commitment to innovation, customer satisfaction, and sustainability drives everything we do. We strive to empower our customers by offering a curated selection of products, personalized recommendations, and exceptional customer service.
              </p>
              <p>
                Our vision is to become the most trusted e-commerce platform globally, known for our reliability, transparency, and dedication to making shopping easier and more accessible for everyone. We believe in building long-term relationships with our customers, partners, and communities by fostering trust, inclusivity, and environmental responsibility.
              </p>
            </li>
            <li>
              <strong>Press:</strong>
              <p>
                Stay updated with the latest news and media coverage about <strong>ShopEase</strong>. From groundbreaking product launches to exciting partnerships, our press section keeps you informed about everything happening in our world. We are proud to be featured in leading publications such as <em>E-Commerce Times</em>, <em>TechCrunch</em>, and <em>Forbes</em> for our innovative approach to online shopping and our commitment to customer satisfaction.
              </p>
              <p>
                In recent news, <strong>ShopEase</strong> was recognized as one of the fastest-growing e-commerce platforms in 2023, thanks to our cutting-edge technology and customer-centric approach. We are also proud to announce our partnership with global brands to bring you exclusive collections and limited-edition products. Follow our press section for updates on upcoming events, product releases, and more.
              </p>
            </li>
            <li>
              <strong>Careers:</strong>
              <p>
                Join the <strong>ShopEase</strong> family and be part of a dynamic, innovative, and inclusive team that is shaping the future of e-commerce. We are always on the lookout for talented individuals who are passionate about technology, customer service, and making a difference. Whether you&apos;re a software engineer, marketing specialist, or customer support representative, there&apos;s a place for you at <strong>ShopEase</strong>.
              </p>
              <p>
                At <strong>ShopEase</strong>, we believe in fostering a culture of creativity, collaboration, and growth. We offer competitive salaries, flexible work arrangements, and opportunities for professional development. Our team is dedicated to creating a positive impact on the world, and we want you to be a part of that journey. Check out our careers page for current openings and take the first step toward an exciting and rewarding career with us.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}