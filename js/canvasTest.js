const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const addSquareButton = document.getElementById('addSquareButton');
const refreshButton = document.getElementById('refreshButton');

let isDragging = false;
let selectedSquare = null;

addSquareButton.addEventListener('click', addSquare);
refreshButton.addEventListener('click', refreshCanvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let squares = [];

refreshCanvas();

function addSquare() {
  const newSquare = {
    x: Math.random() * (canvas.width - 50),
    y: Math.random() * (canvas.height - 50),
    width: 50,
    height: 50,
    color: getRandomColor(),
    prevX: 0,
    prevY: 0
  };

  for (let i = 0; i < squares.length; i++) {
    if (checkCollision(newSquare, squares[i])) {
      newSquare.x = Math.random() * (canvas.width - 50);
      newSquare.y = Math.random() * (canvas.height - 50);
      i = -1;
    }
  }

  squares.push(newSquare);
  redrawCanvas();
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawSquare(square) {
  ctx.fillStyle = square.color;
  ctx.fillRect(square.x, square.y, square.width, square.height);
}

function isMouseInsideSquare(square, mouseX, mouseY) {
  return mouseX > square.x && mouseX < square.x + square.width &&
         mouseY > square.y && mouseY < square.y + square.height;
}

function checkCollision(square1, square2) {
  return !(square1.x + square1.width < square2.x ||
           square1.x > square2.x + square2.width ||
           square1.y + square1.height < square2.y ||
           square1.y > square2.y + square2.height);
}

function addEventListeners() {
  canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    for (let i = squares.length - 1; i >= 0; i--) {
      if (isMouseInsideSquare(squares[i], mouseX, mouseY)) {
        isDragging = true;
        selectedSquare = squares[i];
        break;
      }
    }
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - canvas.getBoundingClientRect().top;

      selectedSquare.x = Math.max(0, Math.min(canvas.width - selectedSquare.width, mouseX - selectedSquare.width / 2));
      selectedSquare.y = Math.max(0, Math.min(canvas.height - selectedSquare.height, mouseY - selectedSquare.height / 2));

      for (let j = 0; j < squares.length; j++) {
        if (selectedSquare !== squares[j] && checkCollision(selectedSquare, squares[j])) {
          selectedSquare.x = selectedSquare.prevX;
          selectedSquare.y = selectedSquare.prevY;
          break;
        }
      }

      selectedSquare.prevX = selectedSquare.x;
      selectedSquare.prevY = selectedSquare.y;
      redrawCanvas();
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    selectedSquare = null;
  });
}

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < squares.length; i++) {
    drawSquare(squares[i]);
  }
}

function refreshCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  squares = [];
  addEventListeners(); // Re-bind event listeners after refreshing
}

redrawCanvas();
