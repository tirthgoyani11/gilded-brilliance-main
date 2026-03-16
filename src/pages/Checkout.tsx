import SiteLayout from "@/components/SiteLayout";

const Checkout = () => {
  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 max-w-2xl">
        <h1 className="font-heading text-3xl mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-6">Secure checkout with shipping and payment placeholders for Stripe/Razorpay/PayPal integration.</p>

        <form className="space-y-4 rounded-[12px] border border-border p-5 bg-secondary/30">
          <input className="h-11 w-full rounded border border-border px-3" placeholder="Full name" />
          <input className="h-11 w-full rounded border border-border px-3" placeholder="Email" />
          <input className="h-11 w-full rounded border border-border px-3" placeholder="Address" />
          <input className="h-11 w-full rounded border border-border px-3" placeholder="City" />
          <button type="button" className="px-4 py-2 rounded bg-foreground text-background text-sm uppercase tracking-[0.12em]">Pay Securely</button>
        </form>
      </section>
    </SiteLayout>
  );
};

export default Checkout;
