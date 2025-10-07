export function fadeIn(obj) {
  obj.traverse(child => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = 0;
    }
  });
  let opacity = 0;
  const fadeInterval = setInterval(() => {
    opacity += 0.05;
    obj.traverse(child => {
      if (child.isMesh) child.material.opacity = Math.min(opacity, 1);
    });
    if (opacity >= 1) clearInterval(fadeInterval);
  }, 30);
}

export function clearObject(scene, obj) {
  if (!obj) return;
  obj.traverse(o => {
    if (o.isMesh) {
      o.geometry?.dispose?.();
      if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
      else o.material?.dispose?.();
    }
  });
  scene.remove(obj);
}
