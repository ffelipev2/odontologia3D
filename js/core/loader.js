import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js'; // ✅ NUEVO
import { fadeIn, clearObject } from './utils.js';

// Crea los cargadores con un LoadingManager (para mostrar progreso)
export function setupLoaders(onProgress, onDone, manager) {
  if (!manager) {
    manager = new THREE.LoadingManager();
    manager.onProgress = onProgress;
    manager.onLoad = onDone;
  }
  return {
    objLoader: new OBJLoader(manager),
    mtlLoader: new MTLLoader(manager),
    stlLoader: new STLLoader(manager) // ✅ NUEVO
  };
}

// Carga un modelo completo a partir de su configuración
export function loadModelFromConfig(model, scene, camera, controls, loaders) {
  clearObject(scene, window.currentObject);

  const fileExt = model.path.split('.').pop().toLowerCase();

  // === OBJ ===
  if (fileExt === 'obj') {
    if (model.mtl) {
      loaders.mtlLoader.load(model.mtl, materials => {
        materials.preload();
        loaders.objLoader.setMaterials(materials);
        loaders.objLoader.load(model.path, obj =>
          addToScene(obj, model, scene, camera, controls)
        );
      });
    } else {
      loaders.objLoader.load(model.path, obj =>
        addToScene(obj, model, scene, camera, controls)
      );
    }
  }

  // === STL === ✅
  else if (fileExt === 'stl') {
    loaders.stlLoader.load(model.path, geometry => {
      geometry.computeBoundingBox();

      const material = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.1,
        roughness: 0.8
      });

      const mesh = new THREE.Mesh(geometry, material);

      // ✅ Centrar y escalar automáticamente
      const box = geometry.boundingBox;
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 10 / maxDim; // ajusta para tamaño razonable
      mesh.scale.set(scale, scale, scale);

      // Centrar el modelo
      const center = new THREE.Vector3();
      box.getCenter(center);
      mesh.position.sub(center);

      addToScene(mesh, model, scene, camera, controls);
    });
  }

  else {
    console.error('Formato de modelo no soportado:', fileExt);
  }
}

function addToScene(obj, model, scene, camera, controls) {
  obj.traverse?.(n => {
    if (n.isMesh) {
      n.castShadow = true;
      n.receiveShadow = true;
    }
  });

  obj.position.set(...model.position);
  obj.rotation.set(...model.rotation);
  scene.add(obj);
  window.currentObject = obj;
  fadeIn(obj);

  camera.position.set(...model.camera);
  controls.target.set(...model.target);
  controls.update();
}
