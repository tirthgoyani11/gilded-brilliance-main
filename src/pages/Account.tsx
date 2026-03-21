import SiteLayout from "@/components/SiteLayout";
import { useStore } from "@/contexts/StoreContext";

const Account = () => {
  const { wishlist, compare } = useStore();

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <h1 className="font-heading text-3xl mb-6">User Account</h1>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-[12px] border border-border p-5 bg-secondary/30">
            <h2 className="font-heading text-lg mb-2">Saved Diamonds</h2>
            <p className="text-sm text-muted-foreground">{wishlist.length} wishlist item(s)</p>
          </div>
          <div className="rounded-[12px] border border-border p-5 bg-secondary/30">
            <h2 className="font-heading text-lg mb-2">Comparison List</h2>
            <p className="text-sm text-muted-foreground">{compare.length} diamond(s) selected</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Account;
