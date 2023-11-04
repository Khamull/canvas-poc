function GeometricalForm(id, shapeName) {
    this.id = id;
    this.shapeName = shapeName;
    this.position = { x: 0, y: 0 };
    this.size = { width: 0, height: 0 };
    this.rotation = 0;
}

GeometricalForm.prototype.getId = function() {
    return this.id;
};

GeometricalForm.prototype.getShapeName = function() {
    return this.shapeName;
};

GeometricalForm.prototype.getPosition = function() {
    return this.position;
};

GeometricalForm.prototype.setPosition = function(x, y) {
    this.position = { x, y };
};

GeometricalForm.prototype.getSize = function() {
    return this.size;
};

GeometricalForm.prototype.setSize = function(width, height) {
    this.size = { width, height };
};

GeometricalForm.prototype.rotate = function(angle) {
    this.rotation = angle;
};

GeometricalForm.prototype.pivot = function(pivotPoint, angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const relativePosition = {
        x: this.position.x - pivotPoint.x,
        y: this.position.y - pivotPoint.y
    };

    const rotatedPosition = {
        x: cosA * relativePosition.x - sinA * relativePosition.y + pivotPoint.x,
        y: sinA * relativePosition.x + cosA * relativePosition.y + pivotPoint.y
    };

    this.position = rotatedPosition;
};
