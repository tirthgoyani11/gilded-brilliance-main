import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { useStore } from "@/contexts/StoreContext";
import { currency } from "@/lib/diamond-utils";
import { Trash2, ShoppingBag, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { cart, removeFromCart } = useStore();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block h-px w-8 bg-primary" />
            <span className="font-accent italic text-primary text-sm">Your Selection</span>
          </div>
          <h1 className="font-heading text-3xl lg:text-4xl">Cart</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Items */}
          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="rounded-2xl border border-border p-8 text-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4 font-body">Your cart is empty.</p>
                <Button asChild variant="luxury">
                  <Link to="/diamonds">Browse Diamonds</Link>
                </Button>
              </div>
            ) : null}
            {cart.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-4 group luxury-transition hover:border-primary/15">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img src={item.imageUrl} alt={item.title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm sm:text-base leading-tight line-clamp-2 sm:truncate mb-1">{item.title}</p>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-body">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-border/50 sm:border-0 pt-3 sm:pt-0">
                  <p className="font-heading text-base tabular-nums whitespace-nowrap">{currency(item.price * item.quantity)}</p>
                  <button
                    className="w-8 h-8 rounded-lg bg-secondary flex shrink-0 items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 luxury-transition"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {cart.length > 0 && (
            <aside className="rounded-2xl border border-border p-6 h-fit bg-secondary/20 sticky top-28">
              <h3 className="font-heading text-lg mb-4">Order Summary</h3>
              <div className="flex justify-between py-2 border-b border-border/50 text-sm font-body">
                <span className="text-muted-foreground">Items ({cart.length})</span>
                <span className="font-medium">{currency(subtotal)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50 text-sm font-body">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary font-medium">Free</span>
              </div>
              <div className="flex justify-between py-3 text-lg">
                <span className="font-heading">Total</span>
                <span className="font-heading">{currency(subtotal)}</span>
              </div>
              <div className="space-y-2 mt-4">
                <Button asChild variant="luxury" size="lg" className="w-full group">
                  <Link to="/checkout">
                    Inquire via WhatsApp
                    <ArrowRight className="w-4 h-4 ml-2 luxury-transition group-hover:translate-x-1" />
                  </Link>
                </Button>
                <p className="text-[10px] text-center text-muted-foreground font-body">
                  We'll generate a detailed inquiry for your WhatsApp
                </p>
              </div>
            </aside>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Cart;
