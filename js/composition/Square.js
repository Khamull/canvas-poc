// Square class
function Square(id, sideLength) {
    GeometricalForm.call(this, id, 'square', );
    this.sideLength = sideLength;
    this.size = { width: sideLength, height: sideLength };
}

Square.prototype = Object.create(GeometricalForm.prototype);
Square.prototype.constructor = Square;

Square.prototype.getSideLength = function() {
    return this.sideLength;
};

Square.prototype.setSideLength = function(sideLength) {
    this.sideLength = sideLength;
    this.size = { width: sideLength, height: sideLength };
};