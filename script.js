// Snowfall animation with performance safeguards and reduced-motion support

(function () {
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');
  const toggleBtn = document.getElementById('toggle-snow');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let flakes = [];
  let width = 0;
  let height = 0;
  let animationId = null;
  let enabled = !prefersReducedMotion;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    spawnFlakes();
  }

  function spawnFlakes() {
    const density = Math.min(220, Math.round((width * height) / 12000));
    flakes = new Array(density).fill(0).map(() => createFlake());
  }

  function createFlake() {
    const size = Math.random() * 2.2 + 0.8;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      speedY: size * (Math.random() * 0.5 + 0.6),
      drift: (Math.random() - 0.5) * 0.6,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.6 + 0.25
    };
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#e6f0ff';
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.speedY;
      f.x += Math.sin(f.phase += 0.01) + f.drift;
      if (f.y > height + 8) {
        flakes[i] = createFlake();
        flakes[i].y = -8;
      }
      ctx.globalAlpha = f.opacity;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(step);
  }

  function start() {
    if (animationId != null) return;
    animationId = requestAnimationFrame(step);
  }

  function stop() {
    if (animationId == null) return;
    cancelAnimationFrame(animationId);
    animationId = null;
    ctx.clearRect(0, 0, width, height);
  }

  function setEnabled(next) {
    enabled = next;
    toggleBtn.textContent = `Snow: ${enabled ? 'On' : 'Off'}`;
    if (enabled) start(); else stop();
    localStorage.setItem('snow-enabled', String(enabled));
  }

  // Pointer glow on link cards
  document.addEventListener('pointermove', (e) => {
    const target = e.target.closest('.link-card');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    target.style.setProperty('--x', `${x}%`);
  });

  // Init
  window.addEventListener('resize', resize);
  resize();

  const stored = localStorage.getItem('snow-enabled');
  if (stored !== null) enabled = stored === 'true';
  if (!prefersReducedMotion) {
    if (enabled) start();
  } else {
    enabled = false;
  }
  toggleBtn.addEventListener('click', () => setEnabled(!enabled));
})();


