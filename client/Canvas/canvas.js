// create canvas element and append it to document body
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth - 500;
canvas.height = 600;

var radius = 10;
var drag = false;
var start_bg_color = "white";
context.lineWidth = radius * 2; // Smoothes out the line

var putPoint = function(e){
    if(drag){
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
        context.beginPath();
        //context.arc(x, y, radius, start, end);
        context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.moveTo(e.offsetX, e.offsetY);
    }
}

var engage = function(e){
    drag = true;
    putPoint(e);
}
var disengage = function(){
    drag = false;
    context.beginPath(); 
}

canvas.addEventListener('mousedown', engage);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', disengage);

function clear_canvas(){
    context.fill() = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
}
