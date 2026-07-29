// --- 1. Evento Clic para cambiar de pantalla ---
const startBtn = document.getElementById('start');
const cardScreen = document.getElementById('card-screen');

function abrirGalaxia() {
  startBtn.classList.add('oculto');
  cardScreen.classList.remove('oculto');
}

startBtn.addEventListener('click', abrirGalaxia);
startBtn.addEventListener('touchstart', abrirGalaxia);

// --- 2. Galaxia 3D Centrada con Three.js ---
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();

// Cámara colocada para ver la galaxia justo en el centro
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 4, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Parámetros de la Galaxia Espiral
const parameters = {
  count: 35000,
  size: 0.015,
  radius: 4.5,
  branches: 3,
  spin: 1,
  randomness: 0.5,
  insideColor: '#ff5599',
  outsideColor: '#2b1b84'
};

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(parameters.count * 3);
const colors = new Float32Array(parameters.count * 3);

const colorInside = new THREE.Color(parameters.insideColor);
const colorOutside = new THREE.Color(parameters.outsideColor);

for (let i = 0; i < parameters.count; i++) {
  const i3 = i * 3;
  const radius = Math.random() * parameters.radius;
  const spinAngle = radius * parameters.spin;
  const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

  const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
  const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
  const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

  positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
  positions[i3 + 1] = randomY;
  positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

  const mixedColor = colorInside.clone();
  mixedColor.lerp(colorOutside, radius / parameters.radius);

  colors[i3] = mixedColor.r;
  colors[i3 + 1] = mixedColor.g;
  colors[i3 + 2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: parameters.size,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// Ajuste automático al cambiar tamaño de pantalla
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animación de rotación continua
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  points.rotation.y = elapsedTime * 0.15;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
