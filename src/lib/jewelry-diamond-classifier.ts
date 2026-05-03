import * as THREE from "three";
import type { ModelMesh } from "@/types/jewelry-model";

const METAL_KEYWORDS = [
  "band", "ring", "shank", "prong", "setting", "bezel", "mount",
  "metal", "frame", "base", "body", "basket", "gallery", "bridge",
  "head", "shoulder", "halo", "collet", "claw", "cup",
];

const DIAMOND_KEYWORDS = [
  "diamond", "gem", "stone", "round", "crystal", "pave", "pavé",
  "accent", "melee", "brilliant", "cz", "cubic", "jewel", "gemstone",
  "solitaire", "center", "centre", "main_stone", "sparkle",
];

const METAL_MAT_KEYS = ["gold", "silver", "platinum", "plated", "polished_metal"];
const GLASS_MAT_KEYS = ["glass", "diamond", "gem", "crystal", "clear"];

export interface ClassificationResult {
  isDiamond: boolean[];
  diamonds: ModelMesh[];
  metals: ModelMesh[];
}

function getMaterialScore(mat: THREE.Material | undefined): { score: number; signals: string[] } {
  if (!mat) return { score: 0, signals: [] };

  let score = 0;
  const signals: string[] = [];
  const matName = mat.name.toLowerCase();

  if (GLASS_MAT_KEYS.some((key) => matName.includes(key))) {
    score += 4;
    signals.push("mat:name:glass");
  }
  if (METAL_MAT_KEYS.some((key) => matName.includes(key))) {
    score -= 4;
    signals.push("mat:name:metal");
  }

  const physMat = mat as THREE.MeshPhysicalMaterial;
  const stdMat = mat as THREE.MeshStandardMaterial;

  if (physMat.transmission !== undefined && physMat.transmission > 0.2) {
    score += 6;
    signals.push(`mat:transmission=${physMat.transmission.toFixed(2)}`);
  }
  if (stdMat.transparent && (stdMat.opacity ?? 1) < 0.95) {
    score += 3;
    signals.push(`mat:opacity=${stdMat.opacity?.toFixed(2)}`);
  }
  if (stdMat.metalness !== undefined && stdMat.metalness > 0.6) {
    score -= 5;
    signals.push(`mat:metalness=${stdMat.metalness.toFixed(2)}`);
  }
  if (
    stdMat.metalness !== undefined &&
    stdMat.metalness < 0.3 &&
    stdMat.roughness !== undefined &&
    stdMat.roughness < 0.15
  ) {
    score += 3;
    signals.push("mat:glassy");
  }
  if (physMat.ior !== undefined && physMat.ior > 1.5) {
    score += 4;
    signals.push(`mat:ior=${physMat.ior.toFixed(2)}`);
  }

  return { score, signals };
}

function computeCompactness(geo: THREE.BufferGeometry): number {
  if (!geo.boundingBox) geo.computeBoundingBox();
  const box = geo.boundingBox;
  if (!box) return 0;
  const dims = [
    box.max.x - box.min.x,
    box.max.y - box.min.y,
    box.max.z - box.min.z,
  ].sort((a, b) => a - b);
  if (dims[2] < 0.001) return 0;
  return dims[0] / dims[2];
}

export function classifyMeshes(meshes: ModelMesh[]): ClassificationResult {
  const radii = meshes.map((mesh) => {
    if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
    return mesh.geometry.boundingSphere?.radius ?? 0;
  });
  const maxRadius = Math.max(...radii, 0.001);
  const isDiamond: boolean[] = [];

  meshes.forEach((mesh, index) => {
    const name = `${mesh.name} ${mesh.material?.name ?? ""}`.toLowerCase();
    const radius = radii[index];
    const sizeRatio = radius / maxRadius;
    const compactness = computeCompactness(mesh.geometry);

    let score = 0;

    if (DIAMOND_KEYWORDS.some((keyword) => name.includes(keyword))) score += 12;
    if (METAL_KEYWORDS.some((keyword) => name.includes(keyword))) score -= 12;

    score += getMaterialScore(mesh.material).score;

    if (sizeRatio > 0.55) score -= 6;
    else if (sizeRatio > 0.2) score -= 2;
    else score += 2;

    if (compactness > 0.4) score += 3;
    else if (compactness < 0.15) score -= 4;

    const vertexCount = mesh.geometry.getAttribute("position")?.count ?? 0;
    if (vertexCount > 500 && sizeRatio < 0.3) score += 2;

    isDiamond.push(score > 0);
  });

  const diamonds: ModelMesh[] = [];
  const metals: ModelMesh[] = [];
  meshes.forEach((mesh, index) => {
    if (isDiamond[index]) diamonds.push(mesh);
    else metals.push(mesh);
  });

  return { isDiamond, diamonds, metals };
}
