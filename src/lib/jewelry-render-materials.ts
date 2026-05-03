import * as THREE from "three";

const materialCache = new Map<string, THREE.MeshStandardMaterial>();

export function getCachedMetalMaterial(color: string, roughness: number): THREE.MeshStandardMaterial {
  const key = `${color}-${roughness.toFixed(3)}`;
  if (!materialCache.has(key)) {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 1,
      roughness,
      envMapIntensity: 2.0,
    });
    materialCache.set(key, mat);
  }
  return materialCache.get(key)!;
}

export function clearMaterialCache(): void {
  materialCache.forEach((mat) => mat.dispose());
  materialCache.clear();
}
