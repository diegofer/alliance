define(function (require) {

	var L             = require('leaflet'),
        leafletLabel  = require('leafletLabel'),
        leafletEncoded  = require('leafletEncoded');
   
    
    var LMap = {

        map          : null,
        groupLayer1  : new L.LayerGroup(),


    	initMap: function(contenedor, options) {  //latLng, zoom) {
            console.log('inicializando mapa');

    		var osmUrl     = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            //var localUrl   = '/static/main/app/img/tiles/{z}/{x}/{y}.png';
    		var osmAttrib  = 'Map data &copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    		var capa = L.tileLayer(osmUrl, { attribution: osmAttrib	});

    		this.map = L.map(contenedor, {
                zoomControl: false,
                layers: [capa],
            });
            //this.addListeners();
            
            //this.map.setView(latLng, zoom);

            var controlZoom = L.control.zoom({position: 'bottomright'});
            this.map.addControl(controlZoom);                    		
    	},

        setView: function(latLng, zoom, offsetX, offsetY) {
            var x = offsetX ? offsetX : 0;
            var y = offsetY ? offsetY : 0;
            var newLatLng = this.ajustarCenter(latLng, x, y);

            this.map.setView(newLatLng, zoom, {
                animate: true
            });
        },


        addListeners: function() {
            this.map.on('load', this.onLoad, this);
            this.map.on('viewreset', this.onViewReset, this);
        },

            onLoad: function(evt) {
                console.log('mapa cargado correctamente');       
            },        
        
            onViewReset: function(event) {
                console.log('evento viewreset fired');
            },


        ////////  MARKERTS   ///////////


        crearMarker: function(latlng) {
            var marker = L.marker(latlng).addTo(this.map);
            return marker;
        },


        ////////  POLYGONOS   ///////////


        setPolygono: function(data) {
            var options = {
                color:       data.color ? data.color : "#3F4C6B",
                weight:      data.weight ? data.weight :  1.5,
                fillColor:   data.fillColor ? data.fillColor : "#4096EE",
                fillOpacity: data.fillOpacity ? data.fillOpacity : 0.2,
            }

            var poly = new L.Polygon(data.latlngs, options);

            if (data.label) poly.bindLabel(data.label);

            return poly;
        },
        


        ////////  UTILS   ///////////

         ajustarCenter: function(latLng, offsetX, offsetY) {
            var x = offsetX ? offsetX : 0;
            var y = offsetY ? offsetY : 0;
            var centerPoint     = this.map.project(latLng);
            var newCenterPoint  = new L.Point(centerPoint.x+x, centerPoint.y+y);
            var newCenterLatLng = this.map.unproject(newCenterPoint);
            return newCenterLatLng;
        },       

        toLatLng: function(address) {
            var point = address.split(',');
            var latlng = new L.LatLng(parseFloat(point[0]), parseFloat(point[1]));
            return latlng;
        },  

        decode: function(encodePath) {
           return L.PolylineUtil.decode(encodePath);
        },

        colors: new Array('#ff6600', '#0191CF', '#A21983', '#E0134F', '#5d3aa3', '#6cb33e', '#FEC425', '#999999'),
        


    };
   
    return LMap; 
});