# 🦷 Visor Anatómico 3D - Odontología

**Visor Anatómico 3D** es una aplicación web interactiva desarrollada con **Three.js**, diseñada para visualizar modelos anatómicos relacionados con la odontología y el cuerpo humano.  
Permite explorar, rotar, escalar y analizar modelos 3D educativos directamente desde el navegador, con una interfaz intuitiva y moderna.

---

## 🚀 Características principales

✅ **Visualización 3D en tiempo real** usando [Three.js](https://threejs.org/)  
✅ Compatible con **formatos OBJ, MTL y STL**  
✅ **Panel de información** con descripciones anatómicas  
✅ **Modo de calibración** con coordenadas y exportación JSON  
✅ **Sistema de carga animado** con spinner, barra de progreso y transición visual suave  
✅ **Diseño responsive y visual limpio** con `CSS3` y `Flexbox`  
✅ **Fácil de extender**: solo agrega nuevos modelos en `models.json`  

---

## 🧩 Estructura del proyecto

odontologia3D/
│
├── css/
│   └── style.css              ← Estilos del visor, animaciones y loader
│
├── img/
│   └── logo.png               ← Logo mostrado en el navbar
│
├── js/
│   ├── core/
│   │   ├── loader.js          ← Lógica de carga de modelos 3D
│   │   ├── ui.js              ← Interacción de interfaz
│   │   └── utils.js           ← Animaciones y funciones generales
│   │
│   ├── data/
│   │   └── models.json        ← Configuración y metadatos de modelos
│   │
│   └── main.js                ← Script principal (escena, cámara, render)
│
├── modelos/
│   ├── Skull.obj
│   ├── Skull.mtl
│   ├── Skull.jpg
│   ├── Yorik_Jaw.obj
│   ├── human.obj
│   └── tooth.stl
│
├── index.html                 ← Versión principal (para uso educativo o demo)
├── index-test.html            ← Versión de calibración (con coordenadas visibles)
├── .gitignore                 ← Ignora archivos innecesarios (como backups)
└── README.md                  ← Descripción del proyecto en GitHub

