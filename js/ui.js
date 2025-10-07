// === ui.js ===
// Control general de los botones del menú lateral y del panel de coordenadas
// Seguro ante ausencia de elementos (no falla si se comentan en el HTML)

export function setupUI({ loadModel, resetCamera }) {

  // Referencias a botones (algunos pueden no existir)
  const btnSkull = document.getElementById('btn-skull');
  const btnJaw = document.getElementById('btn-jaw');
  const btnReset = document.getElementById('btn-reset');
  const btnToggleCoords = document.getElementById('btn-toggle-coords');

  const coordsPanel = document.getElementById('coordsPanel');

  // === CARGA DE MODELOS ===
  if (btnSkull) {
    btnSkull.addEventListener('click', () => {
      loadModel('skull');
    });
  }

  if (btnJaw) {
    btnJaw.addEventListener('click', () => {
      loadModel('jaw');
    });
  }

  // === RESETEAR VISTA ===
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      resetCamera();
    });
  }

  // === MOSTRAR / OCULTAR COORDENADAS ===
  if (btnToggleCoords && coordsPanel) {
    btnToggleCoords.addEventListener('click', () => {
      const isVisible = coordsPanel.style.display === 'block';
      coordsPanel.style.display = isVisible ? 'none' : 'block';
    });
  }

  // Seguridad: evita que errores detengan el flujo
  try {
    if (!loadModel || typeof loadModel !== 'function') {
      console.warn('⚠️ setupUI: no se pasó una función loadModel válida.');
    }
    if (!resetCamera || typeof resetCamera !== 'function') {
      console.warn('⚠️ setupUI: no se pasó una función resetCamera válida.');
    }
  } catch (err) {
    console.error('Error en setupUI:', err);
  }
}
