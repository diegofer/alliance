define(function (require) {

	var L             = require('leaflet'),
        leafletLabel  = require('leafletLabel'),
        leafletEncoded  = require('leafletEncoded');
   
    
    var LMap = {

        map: null,


    	initMap: function(contenedor, lat, lng, zoom) {
    		var osmUrl     = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            //var localUrl   = '/static/main/app/img/tiles/{z}/{x}/{y}.png';
    		var osmAttrib  = 'Map data &copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    		var capa = L.tileLayer(osmUrl, { attribution: osmAttrib	});

    		map = L.map(contenedor, {
                center: [lat, lng],
                zoom: zoom,
                zoomControl: false
            });
            map.addLayer(capa);
            var controlZoom = L.control.zoom({position: 'bottomright'});
            map.addControl(controlZoom);
            
               		

    	},


        moveTo: function(latlng, zoom) {
            map.panTo(latlng);
            map.setZoom(zoom);
        },

        toLatLng: function(address) {
            var point = address.split(',');
            var latlng = new L.LatLng(parseFloat(point[0]), parseFloat(point[1]));
            return latlng;
        },	


        ////////  MARKERTS   ///////////


        crearMarker: function(latlng) {
            var marker = L.marker(latlng).addTo(map);
        },


        ////////  POLYGONOS   ///////////


        setPolygono: function(data) {
            var options = {
                color:       data.color ? data.color : "#3F4C6B",
                weight:      1.5,
                fillColor:   data.fillColor ? data.fillColor : "#4096EE",
                fillOpacity: data.fillOpacity ? data.fillOpacity : 0.2,
            }

            var poly = new L.Polygon(data.latlngs, options);

            if (data.label) poly.bindLabel(data.label);


            map.addLayer(poly);
            return poly;
        },
        


        ////////  UTILS   ///////////


        decode: function(encodePath) {
           return L.PolylineUtil.decode(encodePath);
        },
        


        colors: new Array('#ff6600', '#0191CF', '#A21983', '#E0134F', '#5d3aa3', '#6cb33e', '#FEC425', '#999999'),
        



    };
   
    return LMap; 
});