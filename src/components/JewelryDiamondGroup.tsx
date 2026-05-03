import { useEffect, useMemo, useRef, useState } from "react";
import { MeshRefractionMaterial } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getCachedMetalMaterial } from "@/lib/jewelry-render-materials";
import type { ModelMesh } from "@/types/jewelry-model";

interface JewelryDiamondGroupProps {
  meshes: ModelMesh[];
  classifications: boolean[];
  metalColor: string;
  metalRoughness: number;
  diamondColor: string;
}

export function JewelryDiamondGroup({
  meshes,
  classifications,
  metalColor,
  metalRoughness,
  diamondColor,
}: JewelryDiamondGroupProps) {
  const { scene } = useThree();
  const [envReady, setEnvReady] = useState<THREE.Texture | null>(null);
  const warnedRef = useRef(false);

  useFrame(() => {
    if (!envReady && scene.environment) {
      setEnvReady(scene.environment);
    }
  });

  const metalMat = getCachedMetalMaterial(metalColor, metalRoughness);

  const { diamonds, metals } = useMemo(() => {
    const diamondMeshes: ModelMesh[] = [];
    const metalMeshes: ModelMesh[] = [];
    meshes.forEach((mesh, index) => {
      if (classifications[index]) diamondMeshes.push(mesh);
      else metalMeshes.push(mesh);
    });
    return { diamonds: diamondMeshes, metals: metalMeshes };
  }, [meshes, classifications]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!envReady && !warnedRef.current) {
        warnedRef.current = true;
        console.warn("Environment map not available after 5s. Diamond refraction may not render correctly.");
      }
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [envReady]);

  return (
    <group>
      {envReady &&
        diamonds.map((mesh, index) => (
          <mesh
            key={`d-${mesh.name}-${index}`}
            geometry={mesh.geometry}
            position={mesh.position}
            rotation={mesh.rotation}
            scale={mesh.scale}
          >
            {/* MeshRefractionMaterial exposes shader uniforms beyond its TypeScript surface. */}
            <MeshRefractionMaterial
              envMap={envReady}
              bounces={4}
              aberrationStrength={0.002}
              ior={2.42}
              fresnel={1.2}
              color={diamondColor}
              toneMapped={false}
            />
          </mesh>
        ))}

      {metals.map((mesh, index) => (
        <mesh
          key={`m-${mesh.name}-${index}`}
          geometry={mesh.geometry}
          position={mesh.position}
          rotation={mesh.rotation}
          scale={mesh.scale}
          material={metalMat}
        />
      ))}
    </group>
  );
}
