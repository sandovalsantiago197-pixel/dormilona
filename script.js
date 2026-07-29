// --- 1. Evento Clic para Entrar ---
const startBtn = document.getElementById('start');
startBtn.addEventListener('click', () => startBtn.classList.add('oculto'));
startBtn.addEventListener('touchstart', () => startBtn.classList.add('oculto'));

// --- 2. Configuración de la Escena 3D ---
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

function ajustarCamara() {
  if (window.innerWidth > window.innerHeight) {
    camera.position.set(0, 3.5, 4.5);
  } else {
    camera.position.set(0, 4.5, 5.5);
  }
  camera.lookAt(0, 0, 0);
}
ajustarCamara();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- 3. Generar Galaxia Espiral ---
const parameters = {
  count: 35000,
  size: 0.013,
  radius: 4.8,
  branches: 3,
  spin: 1.2,
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

const galaxyPoints = new THREE.Points(geometry, material);
scene.add(galaxyPoints);

// --- 4. Textos 3D Ubicados en Diferentes Partes de la Galaxia ---
const mensajes = [
  { texto: "✨ Te quiero dormilona", pos: new THREE.Vector3(2.2, 0.3, -1.2) },
  { texto: "😊 Te quiero cachetona", pos: new THREE.Vector3(-2.4, -0.2, 1.5) },
  { texto: "😤 Te quiero enojona", pos: new THREE.Vector3(0.5, 0.4, 2.3) }
];

// Crear elementos HTML para vincular a la posición 3D
const textElements = mensajes.map(m => {
  const el = document.createElement('div');
  el.className = 'galaxy-text';
  el.innerText = m.texto;
  container.appendChild(el);
  return { element: el, pos: m.pos.clone() };
});

// --- 5. Animación y Proyección 3D a 2D ---
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  const angle = elapsedTime * 0.12;

  // Rotar la galaxia
  galaxyPoints.rotation.y = angle;

  // Actualizar la posición de cada texto en pantalla según la rotación 3D
  textElements.forEach(item => {
    // Clonar y rotar el punto en 3D
    const posRotada = item.pos.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    
    // Proyectar coordenadas 3D a píxeles 2D de la pantalla
    const tempV = posRotada.clone();
    tempV.project(camera);

    const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(tempV.y * 0.5) + 0.5) * window.innerHeight;

    item.element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    
    // Ocultar suavemente si pasa por detrás del centro
    item.element.style.opacity = tempV.z > 0.95 ? '0.2' : '1';
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Resposivo
window.addEventListener('resize', () => {
  ajustarCamara();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
