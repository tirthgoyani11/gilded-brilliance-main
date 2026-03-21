import SiteLayout from "@/components/SiteLayout";
import { currency } from "@/lib/diamond-utils";
import { useStore } from "@/contexts/StoreContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
          <div className="space-y-4">
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

            <div className="overflow-x-auto rounded-[12px] border border-border">
              <table className="w-full bg-background">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="p-3">Metric</th>
                    {compare.map((d) => (
                      <th key={d.stoneId} className="p-3 min-w-[220px] align-top">
                        <div className="space-y-2">
                          <p className="font-medium">{d.stoneId || "Unknown"}</p>
                          <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/diamond/${d.stoneId}`}>View</Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => toggleCompare(d)}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border"><td className="p-3">Carat</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{Number.isFinite(d.carat) ? d.carat.toFixed(2) : "-"}</td>)}</tr>
                  <tr className="border-b border-border"><td className="p-3">Color</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.color || "-"}</td>)}</tr>
                  <tr className="border-b border-border"><td className="p-3">Clarity</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.clarity || "-"}</td>)}</tr>
                  <tr className="border-b border-border"><td className="p-3">Cut</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.cut || "-"}</td>)}</tr>
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
