import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { mockDiamonds } from "@/data/mockCatalog";
import { useStore } from "@/contexts/StoreContext";
import { currency } from "@/lib/diamond-utils";

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useStore();
  const items = mockDiamonds.filter((d) => wishlist.includes(d.stoneId));

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <h1 className="font-heading text-3xl mb-6">Wishlist</h1>
        {items.length === 0 ? (
          <p className="text-muted-foreground">No saved diamonds yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((d) => (
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
