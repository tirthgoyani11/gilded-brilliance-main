import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, MeshDistortMaterial } from "@react-three/drei";
import SiteLayout from "@/components/SiteLayout";
import { mockDiamonds } from "@/data/mockCatalog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";

const settings = ["Solitaire", "Halo", "Pave", "Three Stone"] as const;
const metals = ["Silver", "White Gold", "Yellow Gold", "Rose Gold"] as const;

const RingBuilder = () => {
  const { ringBuilder, setRingBuilder } = useStore();

  return (
    <SiteLayout>
      <section className="container mx-auto px-6 lg:px-12 py-10 space-y-8">
        <h1 className="font-heading text-3xl lg:text-4xl">Custom Ring Builder</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-xl mb-3">Step 1: Choose Diamond</h2>
              <select className="h-10 w-full border rounded px-3" value={ringBuilder.diamondStoneId ?? ""} onChange={(e) => setRingBuilder({ diamondStoneId: e.target.value })}>
                <option value="">Select a diamond</option>
                {mockDiamonds.map((d) => <option key={d.stoneId} value={d.stoneId}>{d.stoneId} - {d.shape} {d.carat.toFixed(2)}ct</option>)}
              </select>
            </div>

            <div>
              <h2 className="font-heading text-xl mb-3">Step 2: Choose Setting</h2>
              <div className="flex flex-wrap gap-2">
                {settings.map((setting) => (
                  <Button key={setting} variant={ringBuilder.setting === setting ? "luxury" : "outline"} onClick={() => setRingBuilder({ setting })}>{setting}</Button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-xl mb-3">Step 3: Choose Metal</h2>
              <div className="flex flex-wrap gap-2">
                {metals.map((metal) => (
                  <Button key={metal} variant={ringBuilder.metal === metal ? "luxury" : "outline"} onClick={() => setRingBuilder({ metal })}>{metal}</Button>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-border p-4 bg-secondary/30">
              <h2 className="font-heading text-xl mb-2">Step 4: Preview Summary</h2>
              <p className="text-sm text-muted-foreground">Diamond: {ringBuilder.diamondStoneId ?? "Not selected"}</p>
              <p className="text-sm text-muted-foreground">Setting: {ringBuilder.setting ?? "Not selected"}</p>
              <p className="text-sm text-muted-foreground">Metal: {ringBuilder.metal ?? "Not selected"}</p>
            </div>
          </div>

          <div className="rounded-[12px] border border-border overflow-hidden bg-black h-[420px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.8} />
              <pointLight position={[5, 5, 5]} intensity={1.2} />
              <Torus args={[1.25, 0.28, 32, 96]}>
                <MeshDistortMaterial color="#c6a87d" roughness={0.2} metalness={0.9} distort={0.15} speed={1.2} />
              </Torus>
              <OrbitControls enablePan={false} />
            </Canvas>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default RingBuilder;
