import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
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
    mtlLoader: new MTLLoader(manager)
  };
}

// Carga un modelo completo a partir de su configuración
export function loadModelFromConfig(model, scene, camera, controls, loaders) {
  clearObject(scene, window.currentObject);

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

function addToScene(obj, model, scene, camera, controls) {
  obj.traverse(n => {
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
