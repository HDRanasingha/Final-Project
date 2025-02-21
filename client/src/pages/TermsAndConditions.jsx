import React from 'react';
import '../styles/TermsAndConditions.scss';
import Footer from '../component/Footer';

const TermsAndConditions = () => {
  return (
    <div>
    <div className="terms-page">
      <section className="terms-header">
        <h1>Terms and Conditions</h1>
        <p>Last Updated: February 2025</p>
      </section>

      <section className="terms-content">
        <h2>1. Introduction</h2>
        <p>
          Welcome to FlowerSCM, a comprehensive platform for fresh flower supply chain management. By accessing or using our services, you agree to comply with these Terms and Conditions.
        </p>

        <h2>2. Definitions</h2>
        <ul>
          <li><strong>"Platform"</strong> refers to FlowerSCM and all its digital services.</li>
          <li><strong>"User"</strong> means growers, suppliers, sellers, and customers using the platform.</li>
          <li><strong>"We," "Us," "Our"</strong> refers to the FlowerSCM management team.</li>
        </ul>

        <h2>3. User Responsibilities</h2>
        <p>
          Users must provide accurate information, comply with applicable laws, and use the platform ethically. Any misuse of the platform may lead to account suspension.
        </p>

        <h2>4. Ordering and Payments</h2>
        <p>
          All orders placed through FlowerSCM must be fulfilled as per agreed terms. Payments are processed securely, and users must adhere to our <a href="/payment-policy">Payment Policy</a>.
        </p>

        <h2>5. Refund and Cancellation Policy</h2>
        <p>
          Orders can be canceled before dispatch. Refunds are processed per our <a href="/refund-policy">Refund Policy</a>.
        </p>

        <h2>6. Privacy and Data Protection</h2>
        <p>
          We value your privacy. Please refer to our <a href="/privacy-policy">Privacy Policy</a> for details on data collection and security measures.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          FlowerSCM is not liable for delays, damages, or losses incurred due to third-party logistics providers or unforeseen circumstances.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We may update these terms periodically. Continued use of the platform indicates acceptance of the revised terms.
        </p>

        <h2>9. Contact Information</h2>
        <p>
          For inquiries, please contact us at <a href="mailto:support@flowerscm.com">support@flowerscm.com</a>.
        </p>
      </section>
</div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
