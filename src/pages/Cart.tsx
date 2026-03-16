import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { useStore } from "@/contexts/StoreContext";
import { currency } from "@/lib/diamond-utils";

const Cart = () => {
  const { cart, removeFromCart } = useStore();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <h1 className="font-heading text-3xl mb-6">Cart</h1>
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-3">
            {cart.length === 0 ? <p className="text-muted-foreground">Your cart is empty.</p> : null}
            {cart.map((item) => (
              <div key={item.id} className="rounded-[12px] border border-border p-4 flex items-center gap-4">
                <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p>{currency(item.price * item.quantity)}</p>
                <button className="text-destructive underline text-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}
          </div>

          <aside className="rounded-[12px] border border-border p-5 h-fit bg-secondary/30">
            <p className="text-sm text-muted-foreground mb-2">Subtotal</p>
            <p className="text-2xl font-medium mb-4">{currency(subtotal)}</p>
            <Link to="/checkout" className="inline-block px-4 py-2 rounded bg-foreground text-background text-sm uppercase tracking-[0.12em]">Proceed to Checkout</Link>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Cart;
