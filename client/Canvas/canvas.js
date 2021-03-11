var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Passing methods to draw on the canvas.
var c = canvas.getContext('2d');
//          x    y   width  height
c.fillRect(100, 100, 100, 100);

console.log(canvas);

