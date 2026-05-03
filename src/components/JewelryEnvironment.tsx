import { Environment, Lightformer } from "@react-three/drei";

export function JewelryEnvironment() {
  return (
    <Environment preset="studio" resolution={1024} background={false} environmentIntensity={1.5} blur={0.8}>
      <group>
        <Lightformer intensity={0.6} color="white" rotation-x={Math.PI / 2} position={[0, 5, 0]} scale={[6, 6, 1]} form="ring" />
        <Lightformer intensity={2.2} color="white" rotation-x={Math.PI / 2} position={[0, 5, -2]} scale={[1, 1, 1]} form="circle" />
        <Lightformer intensity={2.2} color="white" rotation-x={Math.PI / 2} position={[1.73, 5, 1]} scale={[1, 1, 1]} form="circle" />
        <Lightformer intensity={2.2} color="white" rotation-x={Math.PI / 2} position={[-1.73, 5, 1]} scale={[1, 1, 1]} form="circle" />

        {Array.from({ length: 6 }).map((_, index) => (
          <Lightformer
            key={`equator-${index}`}
            intensity={1.8}
            color="white"
            rotation-y={(index * Math.PI) / 3}
            position={[
              Math.sin((index * Math.PI) / 3) * 10,
              0,
              Math.cos((index * Math.PI) / 3) * 10,
            ]}
            scale={[3, 5, 1]}
          />
        ))}

        <Lightformer intensity={0.6} color="white" rotation-x={-Math.PI / 2} position={[0, -5, 0]} scale={[10, 10, 1]} />
      </group>
    </Environment>
  );
}
