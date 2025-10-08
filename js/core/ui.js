// ui.js - Control general de la interfaz
export async function setupUI({ loadModel, resetCamera, toggleCoords }) {
  const sidebar = document.getElementById('sidebar');
  const menu = sidebar.querySelector('.menu');
  const menuToggle = document.getElementById('menuToggle');
  const coordsPanel = document.getElementById('coordsPanel');
  const infoPanel = document.getElementById('infoPanel');
  const infoToggle = document.getElementById('infoToggle');
  const closeInfo = document.getElementById('closeInfo');

  // === Generar botones desde models.json ===
  const res = await fetch('./js/data/models.json');
  const data = await res.json();

  data.models.forEach(model => {
    const btn = document.createElement('button');
    btn.textContent = model.name;

    btn.addEventListener('click', () => {
      const wasVisible = infoPanel?.classList.contains('visible'); // 👈 guarda si el panel estaba abierto
      loadModel(model.id);

      // Si el panel estaba abierto, mantenerlo visible
      if (wasVisible) infoPanel?.classList.add('visible');

      // Cerrar menú móvil en pantallas pequeñas
      if (window.innerWidth <= 900) sidebar.classList.remove('visible');
    });

    menu.insertBefore(btn, menu.querySelector('hr'));
  });

  // === Botones adicionales ===
  document.getElementById('btn-reset')?.addEventListener('click', resetCamera);
  document.getElementById('btn-toggle-coords')?.addEventListener('click', toggleCoords);

  // === Menú lateral móvil ===
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('visible');
    });
  }

  // === Botón para abrir/cerrar el panel de información (ℹ️) ===
  if (infoToggle && infoPanel) {
    infoToggle.addEventListener('click', () => {
      infoPanel.classList.toggle('visible');
    });
  }

  // === Botón "✖" dentro del panel de información ===
  if (closeInfo && infoPanel) {
    closeInfo.addEventListener('click', () => {
      infoPanel.classList.remove('visible');
    });
  }

  // === Seguridad: ocultar panel de coordenadas al inicio ===
  if (coordsPanel) coordsPanel.style.display = 'none';
}
