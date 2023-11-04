// Circle class
function Circle(id, diameter) {
    GeometricalForm.call(this, id, 'circle');
    this.radius = diameter / 2;
    this.size = { width: diameter, height: diameter };
}

Circle.prototype = Object.create(GeometricalForm.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.getDiameter = function() {
    return this.radius * 2;
};

Circle.prototype.setDiameter = function(diameter) {
    this.radius = diameter / 2;
    this.size = { width: diameter, height: diameter };
};