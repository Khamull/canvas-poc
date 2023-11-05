const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const addSquareButton = document.getElementById('addSquareButton');
const addRectangleButton = document.getElementById('addRectangleButton');
const refreshButton = document.getElementById('refreshButton');
const rotationSlider = document.getElementById('slider');

rotationSlider.oninput = function() {
  console.log(this.value);
  Rotation(this.value);
}

addSquareButton.addEventListener('click', addSquare);
addRectangleButton.addEventListener('click', addRectangle);
refreshButton.addEventListener('click', refreshCanvas);
let isDragging = false;

let shapes = [];
let squares = [];
let LastSelected = null;
let selectedSquare = null;
let selectedShape = null;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


refreshCanvas();
populateProjectDropdown();

function addSquare() {
  const newSquare = {
    shapeName: 'Square', 
    Id : getRandomID(), 
    x: Math.random() * (canvas.width - 50),
    y: Math.random() * (canvas.height - 50),
    width: 50,
    height: 50,
    color: getRandomColor(),
    prevX: 0,
    prevY: 0,
    rotation: 0,
    isSelected: false,  // Adicionando isSelected
    isHovered: false    // Adicionando isHovered
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

function addRectangle() {
  const newSquare = {
    shapeName: 'Rectangle', 
    Id : getRandomID(), 
    x: Math.random() * (canvas.width - 50),
    y: Math.random() * (canvas.height - 50),
    width: 50,
    height: 100,
    color: getRandomColor(),
    prevX: 0,
    prevY: 0,
    rotation: 0,
    isSelected: false,  // Adicionando isSelected
    isHovered: false    // Adicionando isHovered
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

// function drawSquare(square) {
//   ctx.fillStyle = square.color;
//   ctx.fillRect(square.x, square.y, square.width, square.height);
// }

function drawSquare(square) {
  ctx.save(); // Salva o estado atual do contexto

  ctx.translate(square.x + square.width / 2, square.y + square.height / 2); // Move o ponto de origem para o centro do quadrado
  ctx.rotate((Math.PI / 180) * square.rotation); // Aplica a rotação em radianos

  ctx.fillStyle = square.color;
  ctx.fillRect(-square.width / 2, -square.height / 2, square.width, square.height); // Desenha o quadrado centrado

  ctx.restore(); // Restaura o estado do contexto para antes da rotação
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
        squares[i].isSelected = true;
        
        selectedSquare = squares[i];
        LastSelected = selectedSquare.Id;
        // console.log(selectedSquare);
        // console.log(LastSelected);
        break;
      }
      else {
        squares[i].isSelected = false;
      }
    }

    if (selectedSquare) {
      selectedSquare.isSelected = true;
      redrawCanvas();
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
      selectedSquare.prevY = selectedSquare.y;  // Update prevX and prevY
      redrawCanvas();
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    if (selectedSquare) {
      selectedSquare.isSelected = false;
      selectedSquare = null;
      redrawCanvas();
    }
  });
}

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < squares.length; i++) {
    drawSquare(squares[i]);

    if (squares[i].isSelected || squares[i].isHovered) {
      ctx.save(); // Salva o estado atual do contexto

      ctx.translate(squares[i].x + squares[i].width / 2, squares[i].y + squares[i].height / 2); // Move o ponto de origem para o centro do quadrado
      ctx.rotate((Math.PI / 180) * squares[i].rotation); // Aplica a rotação em radianos

      ctx.lineWidth = 3;
      ctx.strokeStyle = 'black';
      ctx.strokeRect(-squares[i].width / 2, -squares[i].height / 2, squares[i].width, squares[i].height); // Desenha o retângulo de seleção centrado

      ctx.restore(); // Restaura o estado do contexto para antes da rotação
    }
  }
}

function refreshCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  squares = [];
  addEventListeners(); // Re-bind event listeners after refreshing
}

function getRandomID() {
  return Math.floor(Math.random() * 1000000); // Generate a random ID
}

redrawCanvas();

function generateJSON() {
  const jsonData = JSON.stringify(squares);
  return jsonData;
}

// Function to save project data
function saveProjectData() {
  const jsonData = generateJSON();
  const projectName = prompt('Informe um Nome de Projeto: ');
  const id = countProjects() + 1;
  const project = {
    id: id,
    name: projectName || `Projeto ${projectIdentifier}`,
    data: jsonData
  };

  // Save project data to local storage
  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  projects.push(project);
  localStorage.setItem('projects', JSON.stringify(projects));
  populateProjectDropdown();
}

// Function to load project data
function loadProjectData(projectIdentifier) {
  const id = parseInt(projectIdentifier, 10);

  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  console.log('Projects from local storage:', projects);

  for (const project of projects) {
    if (project.id === id) {
      const loadedShapes = JSON.parse(project.data);
      squares = loadedShapes;
      redrawCanvas();
      return;
    }
  }

  console.error('Project not found');
}
function populateProjectDropdown() {
  const projects = JSON.parse(localStorage.getItem('projects')) || [];

  const projectDropdown = document.getElementById('projectDropdown');

  projects.forEach(project => {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.name;
    projectDropdown.appendChild(option);
  });
}

function loadSelectedProject() {
  const projectDropdown = document.getElementById('projectDropdown');
  const selectedProjectId = projectDropdown.value;

  if (selectedProjectId) {
    loadProjectData(selectedProjectId);
  }
}

function countProjects() {
  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  return projects.length;
}

function Rotation(value) {
  squares.forEach(element => {
    if (LastSelected == element.Id)
    {
      element.rotation = value;
      console.log("Updated Element: "+element.rotation);
    }
  });
  redrawCanvas();
}
