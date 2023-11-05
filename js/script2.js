const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let shapes = [];
let selectedShape = null;
let isDragging = false;

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(shape => {
        ctx.beginPath();
        if (shape.type === 'rectangle') {
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === 'square') {
            ctx.rect(shape.x, shape.y, shape.size, shape.size);
        }
        ctx.fillStyle = shape.color;

        if (shape.isSelected || shape.isHovered) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }

        ctx.fill();
        ctx.closePath();
    });
}
function hitTest(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (
            x >= shape.x &&
            x <= shape.x + (shape.type === 'square' ? shape.size : shape.width) &&
            y >= shape.y &&
            y <= shape.y + (shape.type === 'square' ? shape.size : shape.height)
        ) {
            return shape;
        }
    }
    return null;
}

function handleMouseDown(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    selectedShape = hitTest(mouseX, mouseY);

    if (selectedShape) {
        isDragging = true;
        canvas.style.cursor = 'move';
    }
}

function handleMouseUp() {
    isDragging = false;
    canvas.style.cursor = 'auto';
    drawShapes();
}

function handleMouseMove(e) {
    if (isDragging) {
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;

        if (selectedShape) {
            selectedShape.x = mouseX - (selectedShape.type === 'square' ? selectedShape.size / 2 : selectedShape.width / 2);
            selectedShape.y = mouseY - (selectedShape.type === 'square' ? selectedShape.size / 2 : selectedShape.height / 2);

            drawShapes();
        }
    }
    else {
        handleMouseOver(e);
    }
}

function handleMouseOver(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    const hoveredShape = hitTest(mouseX, mouseY);

    shapes.forEach(shape => {
        shape.isHovered = false;
    });

    if (hoveredShape) {
        canvas.style.cursor = 'pointer';
        hoveredShape.isHovered = true;
    } else {
        canvas.style.cursor = 'auto';
    }

    drawShapes();
}
function handleMouseOut() {
    canvas.style.cursor = 'auto';
    shapes.forEach(shape => {
        shape.isHovered = false;
    });
    drawShapes();
}

function handleClick() {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    const clickedShape = hitTest(mouseX, mouseY);

    if (clickedShape) {
         clearSelection();
        if (selectedShape && selectedShape !== clickedShape) {
            selectedShape.isSelected = false;
        }

        clickedShape.isSelected = !clickedShape.isSelected;

        if (clickedShape.isSelected) {
            selectedShape = clickedShape;
        } else {
            selectedShape = null;
        }

        drawShapes();
    }
}

function clearSelection() {
    shapes.forEach(shape => {
        shape.isSelected = false;
    });
    selectedShape = null;
    drawShapes();
}

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseover', handleMouseOver);
canvas.addEventListener('mouseout', handleMouseOut);
canvas.addEventListener('click', handleClick);

// Funções para adicionar e manipular formas
function addRectangle(x, y, width, height, color) {
    shapes.push({
        type: 'rectangle',
        x,
        y,
        width,
        height,
        color,
        isHovered: false,
        isSelected: false
    });
    drawShapes();
}


function addSquare(x, y, size, color) {
    shapes.push({
        type: 'square',
        x,
        y,
        size,
        color,
        isHovered: false,
        isSelected: false
    });
    drawShapes();
}

// Adicionar formas à canvas
addRectangle(50, 50, 100, 70, 'blue');
addSquare(200, 100, 50, 'red');
