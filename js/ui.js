export function setupUI({ loadModel, resetCamera, toggleCoords }) {
  document.getElementById('btn-jaw').addEventListener('click', () => loadModel('jaw'));
  document.getElementById('btn-skull').addEventListener('click', () => loadModel('skull'));
  document.getElementById('btn-reset').addEventListener('click', resetCamera);

  const coordsBtn = document.getElementById('btn-toggle-coords');
  coordsBtn.addEventListener('click', () => {
    const panel = document.getElementById('coordsPanel');
    const isHidden = window.getComputedStyle(panel).display === 'none';
    panel.style.display = isHidden ? 'block' : 'none';
    coordsBtn.textContent = isHidden ? 'Ocultar coordenadas' : 'Ver coordenadas';
  });

  const menuToggle = document.getElementById('menuToggle');
  const ui = document.getElementById('ui');
  menuToggle.addEventListener('click', () => {
    ui.style.display = ui.style.display === 'block' ? 'none' : 'block';
  });
}
