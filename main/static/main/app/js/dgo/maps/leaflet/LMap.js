define(function (require) {

	var L = require('leaflet');
   
    var LMap = {

        map: null,


    	initMap: function(contenedor, lat, lng, zoom) {
    		var osmUrl     = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    		var osmAttrib  = 'Map data &copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    		var capa = L.tileLayer(osmUrl, { attribution: osmAttrib	});

    		map = L.map(contenedor ).setView([lat, lng], zoom);
    		map.addLayer(capa);
    	},


        moveTo: function(lat, lng, zoom) {
            map.panTo([lat, lng]);
            map.setZoom(zoom);
        },
        
    	



    };
   
    return LMap; 
});