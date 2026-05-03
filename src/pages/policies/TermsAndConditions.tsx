import PolicyLayout from "./PolicyLayout";

export default function TermsAndConditions() {
  return (
    <PolicyLayout title="Terms & Conditions">
      <p>
        Welcome to VMORA. By accessing our website, purchasing our products, or using our services, you agree to be bound by the following Terms and Conditions. Please read them carefully.
      </p>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">1. General Information</h5>
        <p>
          VMORA is a luxury brand offering fine diamond jewelry. The content on this website, including product descriptions, images, and pricing, is subject to change without notice. We reserve the right to correct any errors, inaccuracies, or omissions at any time.
        </p>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">2. Product Availability & Pricing</h5>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>All products are subject to availability. If a product is out of stock after your order is placed, we will notify you and offer a suitable alternative or a full refund.</li>
          <li>Prices are listed in INR (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to adjust prices based on market fluctuations in gold and diamond values.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">3. Orders & Payments</h5>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>By placing an order, you confirm that all information provided is accurate and that you are authorized to use the chosen payment method.</li>
          <li>We accept major credit/debit cards, net banking, and secure online payment gateways. Your order will be processed only upon successful payment confirmation.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">4. Intellectual Property</h5>
        <p>
          All content on this website, including but not limited to text, graphics, logos, images, and jewelry designs, is the exclusive property of VMORA and is protected by copyright and intellectual property laws. Unauthorized use or reproduction is strictly prohibited.
        </p>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">5. Limitation of Liability</h5>
        <p>
          VMORA shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our products or website. Our maximum liability shall not exceed the total amount paid by you for the specific product in question.
        </p>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">6. Governing Law</h5>
        <p>
          These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Surat, Gujarat.
        </p>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">Contact Information</h5>
        <p>
          If you have any questions regarding these Terms and Conditions, please contact us:<br/>
          Email: <a href="mailto:care@vmorajewels.com" className="underline">care@vmorajewels.com</a> <br/>
          Phone: <a href="tel:+919876543210" className="underline">+91 98765 43210</a>
        </p>
      </div>

    </PolicyLayout>
  );
}
