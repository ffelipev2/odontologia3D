import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { setupLoaders, loadModelFromConfig } from './core/loader.js';
import { setupUI } from './core/ui.js';

let models = [];
let scene, camera, controls, renderer;
let initialCameraPos = new THREE.Vector3();
let initialTargetPos = new THREE.Vector3();
let coordsModeActive = false;

// === Elementos del loader ===
const overlay = document.getElementById('loadingOverlay');
const progressBar = document.getElementById('loader-progress');
const percentText = document.getElementById('loader-percent');
const titleText = document.getElementById('loader-title');

// === Funciones del loader mejorado ===
function showLoader(modelName = "modelo 3D") {
    overlay?.classList.remove('hidden');
    if (progressBar)
        progressBar.style.width = '0%';
    if (percentText)
        percentText.textContent = 'Iniciando descarga...';
    if (titleText)
        titleText.textContent = `Descargando ${modelName}...`;

    // Muestra el spinner inmediatamente
    const spinner = document.querySelector('.spinner');
    if (spinner)
        spinner.style.display = 'block';
}

function updateLoader(pct) {
    if (progressBar)
        progressBar.style.width = `${pct}%`;
    if (percentText)
        percentText.textContent = `${pct}%`;
    if (pct > 0) {
        const spinner = document.querySelector('.spinner');
        if (spinner)
            spinner.style.display = 'none';
    }
}

function hideLoader() {
    overlay?.classList.add('hidden');
}

// === Inicialización ===
init();

async function init() {
    const canvas = document.getElementById('c');
    renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1020);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(3, 5, 2);
    scene.add(hemi, dir);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = true;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // === Cargar lista de modelos ===
    const res = await fetch('./js/data/models.json');
    const json = await res.json();
    models = json.models;

    setupUI({loadModel, resetCamera, toggleCoords});
    loadModel(models[0].id);
    animate();

    setupKeyboardControls();
}

// === Carga del modelo seleccionado ===
function loadModel(id) {
    const model = models.find(m => m.id === id);
    if (!model)
        return;

    showLoader(model.name);

    const manager = new THREE.LoadingManager();

    manager.onProgress = (_url, loaded, total) => {
        updateLoader(Math.round((loaded / total) * 100));
    };

    manager.onLoad = () => {
        // Efecto de desvanecimiento del texto
        titleText.classList.add('fade-out');

        setTimeout(() => {
            titleText.textContent = 'Procesando modelo...';
            titleText.classList.remove('fade-out');
            titleText.classList.add('fade-in');
        }, 250);

        // Luego ocultar el loader suavemente
        setTimeout(() => {
            hideLoader();
            saveInitialView();
        }, 700);
    };

    const loaders = setupLoaders(
            (_url, loaded, total) => updateLoader(Math.round((loaded / total) * 100)),
            hideLoader,
            manager
            );

    loadModelFromConfig(model, scene, camera, controls, loaders);
    updateModelInfo(model);
}

function updateModelInfo(model) {
    document.getElementById('modelTitle').textContent = model.name;
    document.getElementById('modelDescription').textContent = model.description;
}

function saveInitialView() {
    initialCameraPos.copy(camera.position);
    initialTargetPos.copy(controls.target);
}

function resetCamera() {
    camera.position.copy(initialCameraPos);
    controls.target.copy(initialTargetPos);
    controls.update();
}

// === Mostrar / ocultar coordenadas ===
function toggleCoords() {
    const panel = document.getElementById('coordsPanel');
    if (!panel)
        return;

    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';
    coordsModeActive = !isVisible;
    console.log(`Modo coordenadas: ${coordsModeActive ? 'activo ✅' : 'desactivado ❌'}`);
}

// === Actualizar coordenadas ===
function updateCoords() {
    const obj = window.currentObject;
    const panel = document.getElementById('coordsPanel');
    if (!obj || !panel || panel.style.display === 'none')
        return;

    const ids = ["posX", "posY", "posZ", "rotX", "rotY", "rotZ", "camX", "camY", "camZ", "tarX", "tarY", "tarZ"];
    for (const id of ids) {
        if (!document.getElementById(id))
            return;
    }

    document.getElementById('posX').textContent = obj.position.x.toFixed(2);
    document.getElementById('posY').textContent = obj.position.y.toFixed(2);
    document.getElementById('posZ').textContent = obj.position.z.toFixed(2);
    document.getElementById('rotX').textContent = obj.rotation.x.toFixed(2);
    document.getElementById('rotY').textContent = obj.rotation.y.toFixed(2);
    document.getElementById('rotZ').textContent = obj.rotation.z.toFixed(2);
    document.getElementById('camX').textContent = camera.position.x.toFixed(2);
    document.getElementById('camY').textContent = camera.position.y.toFixed(2);
    document.getElementById('camZ').textContent = camera.position.z.toFixed(2);
    document.getElementById('tarX').textContent = controls.target.x.toFixed(2);
    document.getElementById('tarY').textContent = controls.target.y.toFixed(2);
    document.getElementById('tarZ').textContent = controls.target.z.toFixed(2);
}

setInterval(updateCoords, 200);

// === Copiar coordenadas como JSON ===
document.getElementById('copyCoords')?.addEventListener('click', () => {
    const obj = window.currentObject;
    if (!obj) {
        alert('No hay modelo cargado');
        return;
    }

    const formatNum = n => parseFloat(n.toFixed(2));

    const pos = [formatNum(obj.position.x), formatNum(obj.position.y), formatNum(obj.position.z)];
    const rot = [formatNum(obj.rotation.x), formatNum(obj.rotation.y), formatNum(obj.rotation.z)];
    const cam = [formatNum(camera.position.x), formatNum(camera.position.y), formatNum(camera.position.z)];
    const tar = [formatNum(controls.target.x), formatNum(controls.target.y), formatNum(controls.target.z)];

    const jsonText =
            `"position": [${pos.join(', ')}],
"rotation": [${rot.join(', ')}],
"camera": [${cam.join(', ')}],
"target": [${tar.join(', ')}],`;

    navigator.clipboard.writeText(jsonText)
            .then(() => alert('Coordenadas copiadas al portapapeles ✅'))
            .catch(() => alert('No se pudo copiar automáticamente.'));

    console.log('📋 Coordenadas copiadas:\n' + jsonText);
});

// === Movimiento del modelo con teclado ===
function setupKeyboardControls() {
    window.addEventListener('keydown', e => {
        if (!coordsModeActive)
            return;
        const obj = window.currentObject;
        if (!obj)
            return;

        const step = 0.2;
        const rotStep = 0.05;

        switch (e.key.toLowerCase()) {
            case 'w':
                obj.position.z -= step;
                break;
            case 's':
                obj.position.z += step;
                break;
            case 'a':
                obj.position.x -= step;
                break;
            case 'd':
                obj.position.x += step;
                break;
            case 'r':
                obj.position.y += step;
                break;
            case 'f':
                obj.position.y -= step;
                break;
            case 'q':
                obj.rotation.y -= rotStep;
                break;
            case 'e':
                obj.rotation.y += rotStep;
                break;
            default:
                return;
        }

        e.preventDefault();
    });
}

// === Animación principal ===
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
