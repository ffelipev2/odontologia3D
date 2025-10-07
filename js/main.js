import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { setupLoaders, loadModel } from './loader.js';
import { setupUI } from './ui.js';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(3, 5, 2);
scene.add(dir);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = true;

let initialCameraPos = new THREE.Vector3();
let initialTargetPos = new THREE.Vector3();

function saveInitialView() {
  initialCameraPos.copy(camera.position);
  initialTargetPos.copy(controls.target);
}

function resetCamera() {
  camera.position.copy(initialCameraPos);
  controls.target.copy(initialTargetPos);
  controls.update();
}

const { objLoader, mtlLoader } = setupLoaders(
  (_url, loaded, total) => {
    document.getElementById('pct').textContent = `${Math.round((loaded / total) * 100)}%`;
    document.getElementById('progress-bar').style.width = `${Math.round((loaded / total) * 100)}%`;
  },
  () => document.getElementById('progress').style.display = 'none'
);

function loadAndSave(type) {
  loadModel(type, scene, camera, controls, { objLoader, mtlLoader });
  updateModelInfo(type);
  setTimeout(saveInitialView, 800);
}

function updateCoords() {
  const obj = window.currentObject;
  if (!obj) return;
  const cam = camera;
  const ctrl = controls;

  document.getElementById('posX').textContent = obj.position.x.toFixed(2);
  document.getElementById('posY').textContent = obj.position.y.toFixed(2);
  document.getElementById('posZ').textContent = obj.position.z.toFixed(2);
  document.getElementById('rotX').textContent = obj.rotation.x.toFixed(2);
  document.getElementById('rotY').textContent = obj.rotation.y.toFixed(2);
  document.getElementById('rotZ').textContent = obj.rotation.z.toFixed(2);
  document.getElementById('camX').textContent = cam.position.x.toFixed(2);
  document.getElementById('camY').textContent = cam.position.y.toFixed(2);
  document.getElementById('camZ').textContent = cam.position.z.toFixed(2);
  document.getElementById('tarX').textContent = ctrl.target.x.toFixed(2);
  document.getElementById('tarY').textContent = ctrl.target.y.toFixed(2);
  document.getElementById('tarZ').textContent = ctrl.target.z.toFixed(2);
}
setInterval(updateCoords, 200);

// === PANEL DE INFORMACIÓN ===
const infoPanel = document.getElementById('infoPanel');
const btnInfo = document.getElementById('btn-info');
const closeInfo = document.getElementById('closeInfo');
const modelTitle = document.getElementById('modelTitle');
const modelDescription = document.getElementById('modelDescription');

btnInfo.addEventListener('click', () => infoPanel.classList.add('visible'));
closeInfo.addEventListener('click', () => infoPanel.classList.remove('visible'));

export function updateModelInfo(type) {
  if (type === 'jaw') {
    modelTitle.textContent = "Mandíbula Humana (OBJ)";
    modelDescription.textContent = "Representación tridimensional de la mandíbula humana, utilizada en prácticas de odontología y anatomía facial.";
  } else if (type === 'skull') {
    modelTitle.textContent = "Cráneo Humano (OBJ)";
    modelDescription.textContent = "Modelo anatómico del cráneo humano, empleado para estudios craneofaciales y estructuras óseas del rostro.";
  }
}

// === MENÚ RESPONSIVE ===
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('visible');
});

['btn-skull', 'btn-jaw', 'btn-reset', 'btn-toggle-coords', 'btn-info'].forEach(id => {
  const btn = document.getElementById(id);
  btn.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      sidebar.classList.remove('visible');
    }
  });
});

setupUI({
  loadModel: (type) => loadAndSave(type),
  resetCamera
});

loadAndSave('jaw');

window.addEventListener('resize', () => {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

(function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
})();
