const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const addSquareButton = document.getElementById('addSquareButton');
const addRectangleButton = document.getElementById('addRectangleButton');
const refreshButton = document.getElementById('refreshButton');

let isDragging = false;
let selectedSquare = null;

addSquareButton.addEventListener('click', addSquare);
addRectangleButton.addEventListener('click', addRectangle);
refreshButton.addEventListener('click', refreshCanvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let squares = [];

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
    rotation: 0 // Initialize rotation to 0 degrees
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
    rotation: 0 // New property for rotation angle
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

// Modify drawSquare function to account for rotation
function drawSquare(square) {
  ctx.translate(square.x + square.width / 2, square.y + square.height / 2);
  ctx.rotate(square.rotation * Math.PI / 180);
  ctx.fillStyle = square.color;
  ctx.fillRect(-square.width / 2, -square.height / 2, square.width, square.height);
  ctx.rotate(-square.rotation * Math.PI / 180);
  ctx.translate(-(square.x + square.width / 2), -(square.y + square.height / 2));
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
      selectedSquare.prevY = selectedSquare.y;  // Update prevX and prevY
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
  const projectName = prompt('Enter a project name (or leave blank for project number):');
  const id = countProjects() + 1;
  const project = {
    id: id,
    name: projectName || `Project ${projectIdentifier}`,
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

