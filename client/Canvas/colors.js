// Colors
//Return an array of all elements in the document with the class name "Swatch"
var swatches = document.getElementsByClassName('swatch');

var colors = ['black', 'red', 'green', 'orange', 'brown'];
for(var i = 0 , n = colors.length; i < n; i++){
    var swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = colors[i];
    swatch.addEventListener('click', setSwatch);
    document.getElementById('colors').appendChild(swatch);
}

function setColor(color){
    context.fillStyle = color;
    context.strokeStyle = color;
    var active = document.getElementsByClassName('active')[0];

    if(active){
        active.className = 'swatch';
    }
}

function setSwatch(e){
    //id swatch
    var swatch = e.target

    //set color
    setColor(swatch.style.backgroundColor);

    //give active class
    //adding multiple classes so we need the space
    swatch.className += ' active';
}

// Sets the first Color to the First Swatch.
setSwatch({target: document.getElementsByClassName('swatch')[0]});