import PolicyLayout from "./PolicyLayout";

export default function ReturnPolicy() {
  return (
    <PolicyLayout title="Return & Refund Policy">
      <p>
        We want you to absolutely love what you buy from VMORA. But in case you change your mind, we offer a 7 Days No Questions Asked Return Policy for your complete peace of mind.
      </p>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">1. 7 Days No Questions Asked Return</h5>
        <p className="mb-2">What does it mean?</p>
        <p className="mb-4">
          You may return your product within 7 days from the date of delivery, and choose to receive your refund in one of the following ways:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>VMORA Coins</strong> – credited to your VMORA wallet for future purchases.</li>
          <li><strong>Bank Refund</strong> – processed directly to your original mode of payment.</li>
        </ul>
        <p className="mt-4">
          Returned products must be in unused condition, with all original packaging, certificate(s), and invoice included.
        </p>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">2. Non-Returnable Items</h5>
        <p className="mb-2">The following items are not eligible for return under the 7 Days No Questions Asked Return Policy:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Customized or engraved jewelry pieces.</li>
          <li>Products showing signs of wear, alteration, resizing, or damage.</li>
          <li>Items returned without their original certificates and packaging.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">3. Refund Processing</h5>
        <p>
          Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund. 
          If approved, the refund will be processed within 10-14 business days. The time it takes for the refund to reflect in your account may vary depending on your bank or credit card company.
        </p>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">Contact Information</h5>
        <p>
          For return requests or queries, please reach out to our support team at: <br/>
          Email: <a href="mailto:care@vmorajewels.com" className="underline">care@vmorajewels.com</a> <br/>
          Phone: <a href="tel:+919876543210" className="underline">+91 98765 43210</a>
        </p>
      </div>
      
    </PolicyLayout>
  );
}
