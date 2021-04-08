//Radius File

var setRadius = function(newRadius){
    if(newRadius < minRad){
        newRadius = minRad;
    }
    else if(newRadius > maxRad){
        newRadius = maxRad;
    }

    radius = newRadius;

    context.lineWidth = radius*2;

    radSpan.innerHTML = radius; // Manipulate the radius value between the span tags.
}
var minRad = 0.5;
var maxRad = 100;
var defaultRad = 20;
var interval = 5;
var radSpan = document.getElementById('radval');
var decRad = document.getElementById('decrad');
var incRad = document.getElementById('incrad');

// Adding the Buttons
decRad.addEventListener('click', function(){
    setRadius(radius - interval);

});

incRad.addEventListener('click', function(){
    setRadius(radius + interval);

});

// Sets Default Rad to 20
setRadius(defaultRad);


