import type * as THREE from "three";

export interface ModelMesh {
  geometry: THREE.BufferGeometry;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  name: string;
  material?: THREE.Material;
}

export interface LoadedModel {
  meshes: ModelMesh[];
  type: "glb";
  url: string;
}
