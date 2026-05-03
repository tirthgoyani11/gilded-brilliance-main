import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { mockDiamonds } from "@/data/mockCatalog";
import { useStore } from "@/contexts/StoreContext";
import { currency } from "@/lib/diamond-utils";
import { loadJewelryItems, formatJewelryPrice } from "@/lib/jewelry-catalog";
import type { JewelryItem } from "@/types/diamond";

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useStore();
  const [jewelryItems, setJewelryItems] = useState<JewelryItem[]>([]);

  useEffect(() => {
    let active = true;
    loadJewelryItems().then((items) => {
      if (active) setJewelryItems(items);
    });
    return () => { active = false; };
  }, []);

  const diamondItems = mockDiamonds.filter((d) => wishlist.includes(d.stoneId));
  const savedJewelry = jewelryItems.filter((j) => wishlist.includes(j.id));
  const totalItems = diamondItems.length + savedJewelry.length;

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <h1 className="font-heading text-3xl mb-6">Wishlist</h1>
        {totalItems === 0 ? (
          <p className="text-muted-foreground">No saved items yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedJewelry.map((j) => (
              <article key={j.id} className="rounded-[12px] border border-border overflow-hidden">
                <img src={j.imageUrl} alt={j.name} className="w-full aspect-[4/3] object-cover" />
                <div className="p-4">
                  <h2 className="font-heading text-lg truncate">{j.name}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{j.category}</p>
                  <p className="font-medium mb-3">{formatJewelryPrice(j.price)}</p>
                  <div className="flex gap-3 text-sm">
                    <Link className="text-primary underline" to={`/jewelry/product/${j.id}`}>View</Link>
                    <button className="text-destructive underline" onClick={() => toggleWishlist(j.id)}>Remove</button>
                  </div>
                </div>
              </article>
            ))}

            {diamondItems.map((d) => (
              <article key={d.stoneId} className="rounded-[12px] border border-border overflow-hidden">
                <img src={d.imageUrl} alt={d.stoneId} className="w-full aspect-[4/3] object-cover" />
                <div className="p-4">
                  <h2 className="font-heading text-lg">{d.shape} {d.carat.toFixed(2)}ct</h2>
                  <p className="text-sm text-muted-foreground mb-2">{d.color} • {d.clarity}</p>
                  <p className="font-medium mb-3">{currency(d.price)}</p>
                  <div className="flex gap-3 text-sm">
                    <Link className="text-primary underline" to={`/diamond/${d.stoneId}`}>View</Link>
                    <button className="text-destructive underline" onClick={() => toggleWishlist(d.stoneId)}>Remove</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

export default Wishlist;
