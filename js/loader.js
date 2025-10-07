import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { fadeIn, clearObject } from './utils.js';
import { MODELS } from './config.js';

export function setupLoaders(onProgress, onDone) {
  const manager = new THREE.LoadingManager();
  manager.onProgress = onProgress;
  manager.onLoad = onDone;
  return { objLoader: new OBJLoader(manager), mtlLoader: new MTLLoader(manager) };
}

export function loadModel(type, scene, camera, controls, loaders) {
  clearObject(scene, window.currentObject);
  const data = MODELS[type];
  if (!data) return;

  if (data.mtl) {
    loaders.mtlLoader.load(data.mtl, materials => {
      materials.preload();
      loaders.objLoader.setMaterials(materials);
      loaders.objLoader.load(data.path, obj => addToScene(obj, data, scene, camera, controls));
    });
  } else {
    loaders.objLoader.load(data.path, obj => addToScene(obj, data, scene, camera, controls));
  }
}

function addToScene(obj, data, scene, camera, controls) {
  obj.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
  obj.position.set(...data.position);
  obj.rotation.set(...data.rotation);
  scene.add(obj);
  window.currentObject = obj;
  fadeIn(obj);

  camera.position.set(...data.camera);
  controls.target.set(...data.target);
  controls.update();
}


