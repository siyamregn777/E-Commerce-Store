'use client';

import './Help.css';

const Help = () => {
  return (
    <div className="helpContainer">
      <div className="remian">
        <h2 className="title">Support & Help</h2>

        <div className="section">
          <h3>Frequently Asked Questions (FAQ)</h3>
          <div className="faqItem">
            <h4>How can I reset my password?</h4>
            <p>If you&apos;ve forgotten your password, go to the login page and click on &quot;Forgot Password.&quot; You will receive an email with instructions to reset it.</p>
          </div>
          <div className="faqItem">
            <h4>How do I cancel my booking?</h4>
            <p>To cancel a booking, visit your &quot;Booking History&quot; page and click the &quot;Cancel&quot; button next to the relevant booking.</p>
          </div>
          <div className="faqItem">
            <h4>How can I update my profile?</h4>
            <p>You can update your profile details from the &quot;Account Settings&quot; page under your profile menu.</p>
          </div>
          
        </div>

        <div className="section">
          <h3>Contact Support</h3>
          <p>If you need additional assistance, feel free to contact our support team:</p>
          <ul>
            <li>Email: support@hotelapp.com</li>
            <li>Phone: +1 234 567 890</li>
            <li>Live Chat: Available 24/7</li>
          </ul>
        </div>

        <div className="section">
          <h3>Technical Issues</h3>
          <p>If you are experiencing technical issues, please describe the problem in detail and reach out to our support team. We&apos;ll aim to resolve it as quickly as possible.</p>
        </div>
      </div>
    </div>
  );
};

export default Help;
