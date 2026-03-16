import { useEffect, useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { mockJewelry } from "@/data/mockCatalog";
import { currency } from "@/lib/diamond-utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";
import type { JewelryItem } from "@/types/diamond";

const Jewelry = () => {
  const { addToCart } = useStore();
  const [items, setItems] = useState<JewelryItem[]>(mockJewelry);

  useEffect(() => {
    let active = true;

    const loadJewelry = async () => {
      try {
        const response = await fetch("/api/jewelry");
        if (!response.ok || !active) return;
        const payload = await response.json();
        if (Array.isArray(payload?.items) && payload.items.length > 0) {
          setItems(payload.items as JewelryItem[]);
        }
      } catch {
        // Keep fallback mock jewelry list if API is unavailable.
      }
    };

    void loadJewelry();

    return () => {
      active = false;
    };
  }, []);

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <h1 className="font-heading text-3xl lg:text-4xl mb-2">Shop Jewelry</h1>
        <p className="text-muted-foreground mb-8">Luxury silver and diamond jewelry collections crafted for modern elegance.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <article key={item.id} className="rounded-[12px] border border-border overflow-hidden bg-background shadow-luxury">
              <img src={item.imageUrl} alt={item.name} className="w-full aspect-square object-cover" />
              <div className="p-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.category} • {item.metal}</p>
                <h3 className="font-heading text-lg">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{currency(item.price)}</span>
                  <Button size="sm" variant="luxury" onClick={() => addToCart({ id: `j-${item.id}`, title: item.name, type: "jewelry", price: item.price, imageUrl: item.imageUrl })}>Add</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Jewelry;
