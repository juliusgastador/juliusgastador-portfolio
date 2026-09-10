const stage = document.getElementById('stage');
const ring = document.getElementById('ring');
const cards = Array.from(ring.querySelectorAll('.card'));
const dotsWrap = document.getElementById('dots');
const count = cards.length;
const angleStep = 360 / count;
const radius = 380;

let currentIndex = 0;
let dragStartX = 0;
let dragDeltaX = 0;
let isDragging = false;
let baseRotation = 0;

cards.forEach((card, i) => {
  card.style.transform = `rotateY(${i * angleStep}deg) translateZ(${radius}px)`;
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});
const dots = Array.from(dotsWrap.children);

function updateRing(rotation){
  ring.style.transform = `translateZ(${-radius}px) rotateY(${rotation}deg)`;
}

function updateActiveStates(){
  cards.forEach((card, i) => card.classList.toggle('active', i === currentIndex));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

function goTo(index){
  currentIndex = ((index % count) + count) % count;
  baseRotation = -currentIndex * angleStep;
  ring.classList.remove('no-transition');
  updateRing(baseRotation);
  updateActiveStates();
}

function pointerDown(x){
  isDragging = true;
  dragStartX = x;
  dragDeltaX = 0;
  ring.classList.add('no-transition');
  stage.classList.add('dragging');
}

function pointerMove(x){
  if(!isDragging) return;
  dragDeltaX = x - dragStartX;
  updateRing(baseRotation + dragDeltaX * 0.35);
}

function pointerUp(){
  if(!isDragging) return;
  isDragging = false;
  stage.classList.remove('dragging');
  const stepsMoved = Math.round((dragDeltaX * 0.35) / angleStep);
  goTo(currentIndex - stepsMoved);
}

stage.addEventListener('mousedown', e => pointerDown(e.clientX));
window.addEventListener('mousemove', e => pointerMove(e.clientX));
window.addEventListener('mouseup', pointerUp);

stage.addEventListener('touchstart', e => pointerDown(e.touches[0].clientX), { passive: true });
stage.addEventListener('touchmove', e => pointerMove(e.touches[0].clientX), { passive: true });
stage.addEventListener('touchend', pointerUp);

goTo(0);