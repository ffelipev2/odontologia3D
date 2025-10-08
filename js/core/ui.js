// ui.js - Control general de la interfaz
export async function setupUI({ loadModel, resetCamera, toggleCoords }) {
  const sidebar = document.getElementById('sidebar');
  const menu = sidebar.querySelector('.menu');
  const menuToggle = document.getElementById('menuToggle');
  const coordsPanel = document.getElementById('coordsPanel');

  // === Generar botones desde models.json ===
  const res = await fetch('./js/data/models.json');
  const data = await res.json();

  data.models.forEach(model => {
    const btn = document.createElement('button');
    btn.textContent = model.name;
    btn.addEventListener('click', () => {
      loadModel(model.id);
      if (window.innerWidth <= 900) sidebar.classList.remove('visible'); // cerrar en móvil
    });
    menu.insertBefore(btn, menu.querySelector('hr'));
  });

  // === Botones adicionales ===
  document.getElementById('btn-reset')?.addEventListener('click', resetCamera);
  document.getElementById('btn-toggle-coords')?.addEventListener('click', toggleCoords);

  // === Menú móvil ===
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('visible');
    });
  }

  // === Seguridad: estilos del panel coords ===
  if (coordsPanel) coordsPanel.style.display = 'none';
}
