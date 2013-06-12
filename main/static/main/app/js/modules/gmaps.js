// convert Google Maps into an AMD module
define('gmaps', ['async!https://maps.googleapis.com/maps/api/js?sensor=false&libraries=drawing,geometry&language=es'],
function(){
    // return the gmaps namespace for brevity
    return window.google.maps;
});