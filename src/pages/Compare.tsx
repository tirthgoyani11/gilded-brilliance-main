import SiteLayout from "@/components/SiteLayout";
import { currency } from "@/lib/diamond-utils";
import { useStore } from "@/contexts/StoreContext";

const Compare = () => {
  const { compare } = useStore();

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10">
        <h1 className="font-heading text-3xl mb-2">Diamond Comparison</h1>
        <p className="text-muted-foreground mb-6">Compare up to 3 diamonds by carat, color, clarity, cut, and price.</p>

        {compare.length === 0 ? (
          <p className="text-muted-foreground">No diamonds selected for comparison yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-[12px] border border-border">
            <table className="w-full bg-background">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="p-3">Metric</th>
                  {compare.map((d) => <th key={d.stoneId} className="p-3">{d.stoneId}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border"><td className="p-3">Carat</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.carat.toFixed(2)}</td>)}</tr>
                <tr className="border-b border-border"><td className="p-3">Color</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.color}</td>)}</tr>
                <tr className="border-b border-border"><td className="p-3">Clarity</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.clarity}</td>)}</tr>
                <tr className="border-b border-border"><td className="p-3">Cut</td>{compare.map((d) => <td key={d.stoneId} className="p-3">{d.cut}</td>)}</tr>
                <tr><td className="p-3">Price</td>{compare.map((d) => <td key={d.stoneId} className="p-3 font-medium">{currency(d.price)}</td>)}</tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

export default Compare;
