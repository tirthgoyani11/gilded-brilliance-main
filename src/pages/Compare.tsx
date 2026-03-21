import SiteLayout from "@/components/SiteLayout";
import { currency, diamondV360Src, getFallbackImage } from "@/lib/diamond-utils";
import { useStore } from "@/contexts/StoreContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, RotateCcw } from "lucide-react";

const Compare = () => {
  const { compare, toggleCompare } = useStore();

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <h1 className="font-heading text-3xl mb-2">Diamond Comparison</h1>
        <p className="text-muted-foreground mb-6">Compare up to 3 diamonds by carat, color, clarity, cut, and price.</p>

        {compare.length === 0 ? (
          <div className="rounded-[12px] border border-border bg-secondary/20 p-6">
            <p className="text-muted-foreground mb-4">No diamonds selected for comparison yet.</p>
            <Button asChild variant="outline">
              <Link to="/diamonds">Browse Diamonds</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <p className="text-sm text-muted-foreground">Viewing {compare.length} of 3 slots</p>
              <div className="flex flex-wrap items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/diamonds">Add More Diamonds</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => compare.forEach((diamond) => toggleCompare(diamond))}
                  className="text-muted-foreground"
                >
                  Clear Comparison
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
              {compare.map((d) => {
                const has360 = Boolean(d.v360StoneId || d.stoneId);
                const viewerStoneId = d.v360StoneId ?? d.stoneId;

                return (
                  <article key={d.stoneId} className="rounded-2xl border border-border bg-background shadow-luxury overflow-hidden">
                    <div className="p-4 border-b border-border/70">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{d.stoneId || "Unknown"}</p>
                          <h3 className="font-heading text-lg">{d.shape || "Diamond"} {Number.isFinite(d.carat) ? `${d.carat.toFixed(2)} ct` : ""}</h3>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => toggleCompare(d)}>
                          Remove
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{d.color || "-"} · {d.clarity || "-"} · {d.cut || "-"}</p>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border overflow-hidden bg-secondary/20">
                          <div className="px-3 py-2 border-b border-border text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Image</div>
                          <div className="aspect-square bg-secondary/30">
                            <img
                              src={d.imageUrl || getFallbackImage(d.shape)}
                              alt={`${d.stoneId} still image`}
                              className="w-full h-full object-contain p-3"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const fallback = getFallbackImage(d.shape);
                                if (!target.src.includes(fallback)) target.src = fallback;
                              }}
                            />
                          </div>
                        </div>

                        <div className="rounded-xl border border-border overflow-hidden bg-secondary/20">
                          <div className="px-3 py-2 border-b border-border text-[10px] uppercase tracking-[0.14em] text-muted-foreground">3D View</div>
                          <div className="aspect-square bg-secondary/30">
                            {has360 ? (
                              <iframe
                                title={`360 view ${d.stoneId}`}
                                src={diamondV360Src(viewerStoneId)}
                                className="w-full h-full border-0"
                                loading="lazy"
                                allowFullScreen
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center px-3 text-center text-xs text-muted-foreground">
                                3D view unavailable for this diamond
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link to={`/diamond/${d.stoneId}`}>View Details</Link>
                        </Button>
                        {has360 ? (
                          <Button asChild variant="ghost" size="sm" className="flex-1">
                            <a href={diamondV360Src(viewerStoneId)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5">
                              <RotateCcw className="w-3.5 h-3.5" />
                              Open 3D
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                        ) : null}
                      </div>

                      <p className="font-heading text-xl">{Number.isFinite(d.price) ? currency(d.price) : "-"}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="overflow-x-auto rounded-[12px] border border-border">
              <table className="w-full bg-background min-w-[680px]">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="p-3">Metric</th>
                    {compare.map((d) => (
                      <th key={d.stoneId} className="p-3 min-w-[160px] align-top">
                        <p className="font-medium">{d.stoneId || "Unknown"}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border"><td className="p-3">Carat</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{Number.isFinite(d.carat) ? d.carat.toFixed(2) : "-"}</td>)}</tr>
                  <tr className="border-b border-border"><td className="p-3">Color</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.color || "-"}</td>)}</tr>
                  <tr className="border-b border-border"><td className="p-3">Clarity</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.clarity || "-"}</td>)}</tr>
                  <tr className="border-b border-border"><td className="p-3">Cut</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.cut || "-"}</td>)}</tr>
                  <tr className="border-b border-border"><td className="p-3">Polish</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.polish || "-"}</td>)}</tr>
                  <tr className="border-b border-border"><td className="p-3">Symmetry</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.symmetry || "-"}</td>)}</tr>
                  <tr><td className="p-3">Price</td>{compare.map((d) => <td key={d.stoneId} className="p-3 font-medium">{Number.isFinite(d.price) ? currency(d.price) : "-"}</td>)}</tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

export default Compare;
