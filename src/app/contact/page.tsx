'use client';

import { useState } from 'react';
import './contact.css';
import Image from 'next/image';
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus('Sending...');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      await response.json();
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      setStatus('An error occurred. Please try again.');
    }
  };

  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h2 className="contact-heading">Contact Me</h2>
        <p className="contact-subtext">Feel free to reach out to me:</p>
      </div>

      <div className="contact-body">
        <div className="left">
          <ul>
            <li>
              <Image
                src='/images.png'    
                alt="Phone"
                width={30}
                height={30}
                className="img-fluid rounded-circle"
              />
              +251961177953
            </li>
            <li>
              <Image
                src='/images (1).png'
                alt="Email"
                width={30}
                height={30}
                className="img-fluid rounded-circle"
              />
              siyamregnyeshidagna777@gmail.com
            </li>
          </ul>
        </div>

        <div className="right">
          <div className="contact-content-container">
            <form onSubmit={handleSubmit} className="contact-form-wrapper">
              <div className="contact-form-row">
                <div className="contact-form-group contact-form-group-horizontal">
                  <label htmlFor="name" className="contact-form-label">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="contact-form-input"
                  />
                </div>

                <div className="contact-form-group contact-form-group-horizontal">
                  <label htmlFor="email" className="contact-form-label">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="contact-form-input"
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject" className="contact-form-label">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="contact-form-input"
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="message" className="contact-form-label">Message:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="contact-form-textarea"
                />
              </div>

              <button type="submit" className="contact-submit-button">
                Send Message
              </button>
            </form>
            {status && <p className="contact-status-message">{status}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
