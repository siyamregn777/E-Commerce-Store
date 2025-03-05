'use client';
import Image from 'next/image';
import './about.css';

export default function About() {
  return (
    <>
      <h1 className="aboutHeader">About Us</h1>
      <div className="aboutMain">
        <div className="imageContainer">
          <Image
            src="/IMG_1242S.JPG"
            alt="About Us"
            width={500}
            height={300}
            className="image"
          />
        </div>
        <div className="description">
          <ul>
            <li>
              <strong>Mission & Vision:</strong> Our goal is to empower customers with the best products and services.
            </li>
            <li>
              <strong>Press:</strong> Stay updated with our latest news and media coverage.
            </li>
            <li>
              <strong>Careers:</strong> Join our team and be part of our journey.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
