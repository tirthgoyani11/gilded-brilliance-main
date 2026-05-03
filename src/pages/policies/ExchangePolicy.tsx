import PolicyLayout from "./PolicyLayout";

export default function ExchangePolicy() {
  return (
    <PolicyLayout title="Returns & Exchanges">
      <p>
        Our products are eligible for buyback or exchange following a comprehensive inspection for authenticity, quality, and damage. 
        The final decision regarding return, buyback, or exchange will be made at the company's discretion and is binding.
        This policy applies to all VMORA consumers purchasing VMORA brand diamond jewelry.
      </p>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">1. Lifetime Exchange Policy</h5>
        <p className="mb-2">A Lifetime Exchange Policy is available to all VMORA consumers. Under this scheme, the Exchange Value will be termed as VEV (VMORA Exchange Value).</p>
        <p className="mb-2 font-medium">The VEV is calculated as follows:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li><strong>Gold Value</strong> = 100% of the prevailing market value.</li>
          <li><strong>Diamond Value</strong> = 100% of the prevailing value of the diamond.</li>
          <li><strong>Gemstone Value</strong> = 90% of the prevailing value of the gem.</li>
        </ul>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>If a discount was applied during the original purchase, the equivalent amount will be deducted when calculating the VEV.</li>
          <li>Upon acceptance of VMORA jewelry for exchange, the company will provide products of equal or greater value based on the customer’s selection. No refunds will be issued henceforth.</li>
          <li>If the value of the new jewelry exceeds the VEV of the old jewelry, the customer must pay the difference.</li>
          <li>VMORA jewelry must be in its original condition and accompanied by proof of purchase, including a copy of the invoice and original certificates.</li>
          <li>Any alterations to the gold, or changes/loss of diamonds, will render the item ineligible for Lifetime Exchange.</li>
          <li>The VEV is calculated without including making charges and taxes.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">2. Lifetime Buyback Policy</h5>
        <p className="mb-2">Under this scheme, the Buyback Value will be termed as VBV (VMORA Buyback Value).</p>
        <p className="mb-2 font-medium">The VBV is calculated as follows:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li><strong>Gold Value</strong> = 100% of the prevailing market value.</li>
          <li><strong>Diamond Value</strong> = 85% of the prevailing value of the diamond.</li>
          <li><strong>Gemstone Value</strong> = 70% of the prevailing value of the gem.</li>
        </ul>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>If a discount was applied during the original purchase, the equivalent amount will be deducted when calculating the VBV.</li>
          <li>Jewelry must be in its original condition and accompanied by proof of purchase, certificates, and a valid photo ID.</li>
          <li>All payments for the buyback value will be processed only via bank transfer.</li>
          <li>The company will complete the entire process, including quality checks and processing, within a maximum of 21 working days.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h5 className="font-medium text-lg uppercase tracking-widest text-vmora-black mb-4">Contact Information</h5>
        <p>
          We're here to help! For any questions related to returns or exchanges, feel free to reach out:<br/>
          Email: <a href="mailto:care@vmorajewels.com" className="underline">care@vmorajewels.com</a> <br/>
          Phone: <a href="tel:+919830551558" className="underline">+91 98305 51558</a>
        </p>
      </div>

    </PolicyLayout>
  );
}
