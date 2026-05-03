import PolicyLayout from "./PolicyLayout";

export default function ShippingPolicy() {
  return (
    <PolicyLayout title="Shipping & Delivery">
      <p>
        At VMORA, we aim to deliver your precious jewelry with the utmost care, safety, and efficiency.
        All orders are processed and shipped securely via insured logistics partners to ensure they reach you in pristine condition.
      </p>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">1. Domestic Shipping (Within India)</h5>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Free Shipping:</strong> We offer complimentary insured shipping on all orders delivered within India.</li>
          <li><strong>Delivery Timeframe:</strong> Ready-to-ship items are typically dispatched within 24-48 hours and delivered within 3-7 business days. Custom or made-to-order pieces may require 15-20 business days for crafting before dispatch.</li>
          <li><strong>Tracking:</strong> Once your order is shipped, you will receive a tracking link via email and SMS to monitor its journey.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">2. International Shipping</h5>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Global Reach:</strong> We ship to select international destinations. Shipping charges will be calculated at checkout based on your location.</li>
          <li><strong>Delivery Timeframe:</strong> International orders are typically delivered within 10-15 business days post-dispatch, subject to customs clearance.</li>
          <li><strong>Customs & Duties:</strong> Please note that cross-border shipments may be subject to customs duties and taxes levied by the destination country. These charges are the responsibility of the customer and are not included in the purchase price or shipping cost.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">3. Delivery Security & Guidelines</h5>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Insured Transit:</strong> Every VMORA package is fully insured during transit until it reaches your doorstep.</li>
          <li><strong>Signature Required:</strong> To ensure the secure delivery of high-value items, an adult signature is required upon receipt.</li>
          <li><strong>Address Accuracy:</strong> Please ensure that your shipping address is complete and accurate. We cannot reroute packages once they have been dispatched.</li>
          <li><strong>Unboxing:</strong> We highly recommend taking an unboxing video of your package. This assists us in promptly addressing any rare cases of transit damage or discrepancies.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">4. Order Tracking & Support</h5>
        <p>
          You can track your order using the link provided in your shipment confirmation email. If you experience any delays or issues with your delivery, our concierge team is available to assist you at <a href="mailto:care@vmorajewels.com" className="underline">care@vmorajewels.com</a> or <a href="tel:+919876543210" className="underline">+91 98765 43210</a>.
        </p>
      </div>
      
      <p className="mt-12 text-gray-500 italic">
        Note: Delivery timelines are estimates and may be subject to delays due to unforeseen circumstances, extreme weather conditions, or public holidays.
      </p>
    </PolicyLayout>
  );
}
