function CompositeForm(id) {
    GeometricalForm.call(this, id);
    this.children = [];
}

CompositeForm.prototype = Object.create(GeometricalForm.prototype);
CompositeForm.prototype.constructor = CompositeForm;

CompositeForm.prototype.addChild = function(child) {
    this.children.push(child);
};

CompositeForm.prototype.removeChild = function(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
        this.children.splice(index, 1);
    }
};

CompositeForm.prototype.drag = function(dx, dy) {
    this.position.x += dx; // Move the group itself
    this.position.y += dy;

    for (const child of this.children) {
        child.position.x += dx; // Move the children
        child.position.y += dy;
    }
};

CompositeForm.prototype.pivot = function(angle) {
    const centerX = this.position.x + this.size.width / 2;
    const centerY = this.position.y + this.size.height / 2;

    // Calculate the pivot transformation matrix
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    for (const child of this.children) {
        const relativePosition = {
            x: child.position.x - centerX,
            y: child.position.y - centerY
        };

        const rotatedPosition = {
            x: cosA * relativePosition.x - sinA * relativePosition.y + centerX,
            y: sinA * relativePosition.x + cosA * relativePosition.y + centerY
        };

        child.setPosition(rotatedPosition.x, rotatedPosition.y);
    }
};