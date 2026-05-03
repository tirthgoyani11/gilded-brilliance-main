import PolicyLayout from "./PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>
        VMORA ("we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information in compliance with the applicable data protection regulations.
      </p>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">1. Information We Collect</h5>
        <p className="mb-2">We may collect the following types of personal data:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Identity & Contact Information:</strong> Name, email address, phone number, billing/shipping address.</li>
          <li><strong>Payment Information:</strong> Processed securely via encrypted payment gateways (we do not store payment details).</li>
          <li><strong>Account Information:</strong> Username, password, and purchase history.</li>
          <li><strong>Device & Usage Information:</strong> IP address, browser type, pages visited, and time spent on our website.</li>
          <li><strong>Marketing Preferences:</strong> Subscription to newsletters and promotional materials.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">2. How We Use Your Information</h5>
        <p className="mb-2">We collect and use your personal data for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>To process and fulfill orders, including payment and delivery.</li>
          <li>To provide customer support and address inquiries.</li>
          <li>To personalize your shopping experience.</li>
          <li>To improve website functionality, security, and user experience.</li>
          <li>To send promotional emails and marketing materials (with your consent).</li>
          <li>To comply with legal obligations and prevent fraud.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">3. Data Sharing & Disclosure</h5>
        <p className="mb-2">We do not sell, rent, or share your personal information with third parties except in the following cases:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Service Providers:</strong> Trusted third-party vendors for payment processing, logistics, and IT support.</li>
          <li><strong>Legal Compliance:</strong> When required by law, regulation, or legal proceedings.</li>
          <li><strong>Business Transfers:</strong> In case of a merger, acquisition, or sale of assets.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">4. Security Measures</h5>
        <p>
          We implement industry-standard security measures to protect your data, including encryption, access controls, and regular security audits. However, no method of transmission over the internet is 100% secure.
        </p>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">5. Cookies & Tracking Technologies</h5>
        <p>
          We use cookies and similar technologies to enhance user experience and analyze website traffic. You can manage cookie preferences through your browser settings.
        </p>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">6. Contact Information</h5>
        <p>
          For any privacy-related concerns, contact us at: <br/>
          Email: <a href="mailto:care@vmorajewels.com" className="underline">care@vmorajewels.com</a> <br/>
          Phone: <a href="tel:+919830551558" className="underline">+91 98305 51558</a>
        </p>
      </div>

      <p className="mt-12 text-gray-500 italic">
        Thank you for trusting VMORA. We're always here to support you with care, transparency, and professionalism.
        Note: Our privacy policy may be updated from time to time. Please revisit this page for the latest information.
      </p>
    </PolicyLayout>
  );
}
