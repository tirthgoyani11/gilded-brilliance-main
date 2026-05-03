import { Suspense, useEffect, useMemo } from "react";
import { Bounds, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { classifyMeshes } from "@/lib/jewelry-diamond-classifier";
import type { LoadedModel, ModelMesh } from "@/types/jewelry-model";
import { JewelryDiamondGroup } from "./JewelryDiamondGroup";

interface JewelryRenderModelProps {
  model: LoadedModel;
  metalColor: string;
  metalRoughness: number;
  diamondColor: string;
  onLoad?: () => void;
}

function GlbRenderer({
  url,
  metalColor,
  metalRoughness,
  diamondColor,
  onLoad,
}: {
  url: string;
  metalColor: string;
  metalRoughness: number;
  diamondColor: string;
  onLoad?: () => void;
}) {
  const { scene: gltfScene } = useGLTF(url);

  const meshes = useMemo<ModelMesh[]>(() => {
    const arr: ModelMesh[] = [];
    gltfScene.updateMatrixWorld(true);

    gltfScene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        const geo = mesh.geometry.clone();

        const posAttr = geo.attributes.position;
        if (posAttr) {
          geo.setAttribute("position", posAttr.clone());
        }
        const normAttr = geo.attributes.normal;
        if (normAttr) {
          geo.setAttribute("normal", normAttr.clone());
        }

        arr.push({
          geometry: geo,
          position: mesh.position.clone(),
          rotation: mesh.rotation.clone(),
          scale: mesh.scale.clone(),
          name: mesh.name || "unnamed",
          material: Array.isArray(mesh.material) ? mesh.material[0] : mesh.material ?? undefined,
        });
      }
    });

    return arr;
  }, [gltfScene]);

  useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  const result = useMemo(() => classifyMeshes(meshes), [meshes]);

  return (
    <JewelryDiamondGroup
      meshes={meshes}
      classifications={result.isDiamond}
      metalColor={metalColor}
      metalRoughness={metalRoughness}
      diamondColor={diamondColor}
    />
  );
}

export function JewelryRenderModel({ model, metalColor, metalRoughness, diamondColor, onLoad }: JewelryRenderModelProps) {
  return (
    <Suspense fallback={null}>
      <Bounds fit clip observe margin={1.2}>
        <Center>
          <GlbRenderer
            url={model.url}
            metalColor={metalColor}
            metalRoughness={metalRoughness}
            diamondColor={diamondColor}
            onLoad={onLoad}
          />
        </Center>
      </Bounds>
    </Suspense>
  );
}
