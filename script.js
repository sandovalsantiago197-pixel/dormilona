// Fondo de estrellas dinámicas
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005
  });
}

function animateStars() {
  ctx.clearRect(0, 0, width, height);
  
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
    
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = Math.abs(s.alpha);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateStars);
}
animateStars();

// Evento del clic super sencillo y 100% compatible
const startBtn = document.getElementById('start');
const sceneView = document.getElementById('scene');

function openScene() {
  startBtn.classList.add('hide');
  sceneView.classList.remove('hide');
}

startBtn.addEventListener('click', openScene);
startBtn.addEventListener('touchstart', openScene);
