const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let angleX = 0.4;
let angleY = 0;
let isDragging = false;
let lastMouseX = 0, lastMouseY = 0;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Crear partículas de la galaxia espiral
const PARTICLE_COUNT = 2200;
const ARMS = 3;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    // Distribuir en espiral
    const distance = Math.pow(Math.random(), 2) * (Math.min(width, height) * 0.45);
    const armAngle = (Math.floor(Math.random() * ARMS) * (2 * Math.PI / ARMS));
    const spiralAngle = distance * 0.015;
    const finalAngle = armAngle + spiralAngle + (Math.random() - 0.5) * 0.4;

    this.x = Math.cos(finalAngle) * distance;
    this.y = (Math.random() - 0.5) * 30; // Altura 3D
    this.z = Math.sin(finalAngle) * distance;

    this.size = Math.random() * 2 + 0.5;
    
    // Colores galácticos (Violeta, Neón, Blanco, Azul)
    const colors = ['#ffffff', '#a98cff', '#7b5cff', '#e0d5ff', '#3d1b99'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.8 + 0.2;
    this.speed = (0.001 + Math.random() * 0.002) * (1 - distance / (width * 0.5));
  }

  update() {
    // Rotación suave continua
    const cos = Math.cos(this.speed);
    const sin = Math.sin(this.speed);
    const x = this.x * cos - this.z * sin;
    const z = this.z * cos + this.x * sin;
    this.x = x;
    this.z = z;
  }

  draw() {
    // Proyección 3D a 2D
    let cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    let cosX = Math.cos(angleX), sinX = Math.sin(angleX);

    let x1 = this.x * cosY + this.z * sinY;
    let z1 = this.z * cosY - this.x * sinY;

    let y1 = this.y * cosX - z1 * sinX;
    let z2 = z1 * cosX + this.y * sinX;

    const perspective = 600;
    const scale = perspective / (perspective + z2 + 300);

    const screenX = width / 2 + x1 * scale;
    const screenY = height / 2 + y1 * scale;

    if (scale > 0) {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha * Math.min(1, scale);
      ctx.beginPath();
      ctx.arc(screenX, screenY, this.size * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Inicializar partículas
function initGalaxy() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}
initGalaxy();

// Control de Mouse / Touch para girar la galaxia
window.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  let deltaX = e.clientX - lastMouseX;
  let deltaY = e.clientY - lastMouseY;
  angleY += deltaX * 0.005;
  angleX += deltaY * 0.005;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

window.addEventListener('mouseup', () => isDragging = false);

// Soporte táctil para celulares
window.addEventListener('touchstart', (e) => {
  isDragging = true;
  lastMouseX = e.touches[0].clientX;
  lastMouseY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  let deltaX = e.touches[0].clientX - lastMouseX;
  let deltaY = e.touches[0].clientY - lastMouseY;
  angleY += deltaX * 0.005;
  angleX += deltaY * 0.005;
  lastMouseX = e.touches[0].clientX;
  lastMouseY = e.touches[0].clientY;
});

window.addEventListener('touchend', () => isDragging = false);

// Bucle de Animación
function animate() {
  ctx.fillStyle = '#010409';
  ctx.fillRect(0, 0, width, height);

  // Núcleo brillante central
  const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, 180);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(0.2, 'rgba(169, 140, 255, 0.5)');
  grad.addColorStop(0.6, 'rgba(86, 48, 201, 0.15)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Dibujar partículas
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

// Transición al hacer clic en el corazón
document.getElementById('heart').onclick = () => {
  document.getElementById('start').classList.add('hide');
  document.getElementById('scene').classList.remove('hide');
  resize();
  animate();
};
