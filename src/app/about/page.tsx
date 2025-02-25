'use client'
import Image from 'next/image';
import './about.css'
export default function About() {
  return (
    <div className='aboutMain'>
      <h1>About Us</h1>
      <div>
        <Image
          src="/IMG_1242S.JPG"
          alt="About Us"
          width={500}
          height={300}
          className='image'
        />
      </div>
      <div className='description'>
      <ul>
        <li><strong>Mission & Vision:</strong> Our goal is to empower customers with 
        the best products and services.lorem
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos deleniti 
        sapiente odit! Deserunt illo sit quisquam obcaecati maiores voluptatibus iure 
        voluptates. Architecto dolor eaque magni odio ullam enim nesciunt. Adipisci? </li>
        <li><strong>Press:</strong> Stay updated with our latest news and media coverage.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque exercitationem fuga 
        quos dolore debitis expedita blanditiis! Sequi sit libero, esse a cupiditate tempore 
        atque praesentium quo, velit molestiae, porro aspernatur?</li>
        <li><strong>Careers:</strong> Join our team and be part of our journey.
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis rem eaque eveniet 
        beatae aliquam sed excepturi assumenda! Facilis reiciendis, fugit velit hic maiores
        at itaque labore nihil, commodi impedit quos! </li>
      </ul>
      </div>
    </div>
  );
}
