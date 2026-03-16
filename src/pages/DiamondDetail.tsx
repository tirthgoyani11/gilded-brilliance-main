import { Link, useParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import DiamondMediaPanel from "@/components/DiamondMediaPanel";
import { certificateLink, currency } from "@/lib/diamond-utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";

const DiamondDetail = () => {
  const { stoneId = "" } = useParams();
  const { diamonds, addToCart, setRingBuilder } = useStore();
  const diamond = diamonds.find((d) => d.stoneId === stoneId);

  if (!diamond) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-6 lg:px-12 py-16">
          <h1 className="font-heading text-3xl mb-4">Diamond Not Found</h1>
          <Link to="/diamonds" className="text-primary underline">Back to marketplace</Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container mx-auto px-6 lg:px-12 py-10 space-y-8 pb-28 md:pb-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <DiamondMediaPanel diamond={diamond} />

          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{diamond.stoneId}</p>
              <h1 className="font-heading text-3xl mt-2">{diamond.shape} {diamond.carat.toFixed(2)} ct Diamond</h1>
              <p className="font-accent italic text-primary text-lg mt-2">Brilliance Beyond Time</p>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted-foreground">Carat</dt><dd>{diamond.carat.toFixed(2)}</dd></div>
              <div><dt className="text-muted-foreground">Shape</dt><dd>{diamond.shape}</dd></div>
              <div><dt className="text-muted-foreground">Color</dt><dd>{diamond.color}</dd></div>
              <div><dt className="text-muted-foreground">Clarity</dt><dd>{diamond.clarity}</dd></div>
              <div><dt className="text-muted-foreground">Cut</dt><dd>{diamond.cut}</dd></div>
              <div><dt className="text-muted-foreground">Polish</dt><dd>{diamond.polish}</dd></div>
              <div><dt className="text-muted-foreground">Symmetry</dt><dd>{diamond.symmetry}</dd></div>
              <div><dt className="text-muted-foreground">Table %</dt><dd>{diamond.tablePct}</dd></div>
              <div><dt className="text-muted-foreground">Depth %</dt><dd>{diamond.depthPct}</dd></div>
              <div><dt className="text-muted-foreground">Measurements</dt><dd>{diamond.measurements}</dd></div>
            </dl>

            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-2xl font-medium">{currency(diamond.price)}</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="luxury" onClick={() => addToCart({ id: `diamond-${diamond.stoneId}`, title: `${diamond.shape} ${diamond.carat}ct`, type: "diamond", price: diamond.price, imageUrl: diamond.imageUrl })}>Add to Cart</Button>
                <Button variant="luxury-outline" onClick={() => setRingBuilder({ diamondStoneId: diamond.stoneId })} asChild>
                  <Link to="/ring-builder">Add to Ring</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-[12px] border border-border p-5 bg-secondary/40">
          <h2 className="font-heading text-2xl mb-3">Certificate Viewer</h2>
          <p className="text-sm text-muted-foreground mb-4">{diamond.certLab} report: {diamond.certNumber}</p>
          <a className="text-primary underline" href={certificateLink(diamond)} target="_blank" rel="noreferrer">
            Open {diamond.certLab} Verification
          </a>
        </section>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border p-3">
        <div className="container mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{diamond.shape} {diamond.carat.toFixed(2)}ct</p>
            <p className="font-medium">{currency(diamond.price)}</p>
          </div>
          <Button size="sm" variant="luxury" onClick={() => addToCart({ id: `diamond-${diamond.stoneId}`, title: `${diamond.shape} ${diamond.carat}ct`, type: "diamond", price: diamond.price, imageUrl: diamond.imageUrl })}>
            Add to Cart
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
};

export default DiamondDetail;
