// Obtém referências para o canvas e o contexto de desenho
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Adiciona um evento de clique para adicionar um item no canvas
canvas.addEventListener('click', (event) => {
  // Aqui você pode desenhar o item no contexto do canvas
  // Por exemplo:
  ctx.fillStyle = 'blue';
  ctx.fillRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 50, 50);
});

// Adiciona um evento de arrastar para mover o item
let isDragging = false;
let offsetX, offsetY;

canvas.addEventListener('mousedown', (event) => {
  isDragging = true;
  offsetX = event.clientX - canvas.offsetLeft;
  offsetY = event.clientY - canvas.offsetTop;
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(event.clientX - offsetX, event.clientY - offsetY, 50, 50);
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
