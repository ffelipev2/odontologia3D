import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { fadeIn, clearObject } from './utils.js';

// ==============================
// Configuración de los cargadores
// ==============================
export function setupLoaders(onProgress, onDone, manager) {
  if (!manager) {
    manager = new THREE.LoadingManager();
    manager.onProgress = onProgress;
    manager.onLoad = onDone;
  }
  return {
    objLoader: new OBJLoader(manager),
    mtlLoader: new MTLLoader(manager),
    stlLoader: new STLLoader(manager)
  };
}

// ==============================
// Carga un modelo desde su configuración JSON
// ==============================
export function loadModelFromConfig(model, scene, camera, controls, loaders) {
  clearObject(scene, window.currentObject);

  const fileExt = model.path.split('.').pop().toLowerCase();

  // === OBJ ===
  if (fileExt === 'obj') {
    if (model.mtl) {
      loaders.mtlLoader.load(model.mtl, materials => {
        materials.preload();
        loaders.objLoader.setMaterials(materials);
        loaders.objLoader.load(model.path, obj => {
          normalizeOBJScale(obj, model);
          addToScene(obj, model, scene, camera, controls);
        });
      });
    } else {
      loaders.objLoader.load(model.path, obj => {
        normalizeOBJScale(obj, model);
        addToScene(obj, model, scene, camera, controls);
      });
    }
  }

  // === STL ===
  else if (fileExt === 'stl') {
    loaders.stlLoader.load(model.path, geometry => {
      geometry.computeBoundingBox();

      const material = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.1,
        roughness: 0.8
      });

      const mesh = new THREE.Mesh(geometry, material);

      const box = geometry.boundingBox;
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);

      // ✅ Si no hay escala en el JSON, usa la automática
      if (model.scale) {
        mesh.scale.set(...model.scale);
      } else {
        const scale = 10 / maxDim;
        mesh.scale.set(scale, scale, scale);
      }

      // Centra el modelo
      const center = new THREE.Vector3();
      box.getCenter(center);
      mesh.position.sub(center);

      addToScene(mesh, model, scene, camera, controls);
    });
  } else {
    console.error('Formato de modelo no soportado:', fileExt);
  }
}

// ==============================
// Normaliza la escala de los OBJ si no hay escala definida
// ==============================
function normalizeOBJScale(obj, model) {
  if (model.scale) return; // Si ya tiene escala definida, no tocar

  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scaleFactor = 10 / maxDim; // Ajusta este valor si querés más o menos tamaño base
  obj.scale.set(scaleFactor, scaleFactor, scaleFactor);
}

// ==============================
// Agrega el modelo a la escena con posición, rotación, escala y cámara
// ==============================
function addToScene(obj, model, scene, camera, controls) {
  obj.traverse?.(n => {
    if (n.isMesh) {
      n.castShadow = true;
      n.receiveShadow = true;
    }
  });

  obj.position.set(...model.position);
  obj.rotation.set(...model.rotation);

  // ✅ Aplica escala personalizada desde el JSON (si existe)
  if (model.scale) {
    obj.scale.set(...model.scale);
  }

  scene.add(obj);
  window.currentObject = obj;
  fadeIn(obj);

  // Configura cámara y controles
  camera.position.set(...model.camera);
  controls.target.set(...model.target);
  controls.update();
}
