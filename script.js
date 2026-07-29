const c = document.getElementById('stars');
const ctx = c.getContext('2d');

function rs() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}
window.onresize = rs;
rs();

const st = [...Array(220)].map(() => ({
  x: Math.random() * c.width,
  y: Math.random() * c.height,
  r: Math.random() * 2
}));

function an() {
  ctx.fillStyle = '#020611';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = 'white';

  st.forEach(s => {
    ctx.globalAlpha = 0.5 + Math.random() * 0.5; // Efecto de titileo
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    s.y += 0.2;
    if (s.y > c.height) s.y = 0;
  });

  requestAnimationFrame(an);
}
an();

document.getElementById('heart').onclick = () => {
  document.getElementById('start').classList.add('hide');
  document.getElementById('scene').classList.remove('hide');
};
