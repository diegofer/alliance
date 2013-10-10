define(function (require) {

	var L                          = require('leaflet'),
        leafletLabel               = require('leafletLabel'),
        leafletEncoded             = require('leafletEncoded'),
        leafletAwesomeMarkers      = require('leaflet.awesome-markers');
   
    
    var LMap = {

        map          : null,
        groupLayer1  : new L.LayerGroup(),

        iconDefault  : new L.Icon.Default(),


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
            this.addListeners();
            
            var controlZoom = L.control.zoom({position: 'bottomright'});
            this.map.addControl(controlZoom);                    		
    	},

        setView: function(latLng, zoom, offsetX, offsetY) {
            var x = offsetX ? offsetX : 0;
            var y = offsetY ? offsetY : 0;
            var newLatLng = this.ajustarCenter(latLng, zoom, x, y);

            this.map.setView(newLatLng, zoom, {
                animate: true,
                zoom: {
                    animate:true
                }
            });
        },

        ////////  LISTENERS   ///////////
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
        

        getIconDefault: function(arg) {
            return new L.Icon.Default();
        },
        

        setMarker: function(data) {

            var options = {
                icon    : data.icon ? data.icon : this.iconDefault,
                title   : data.title ? data.title : '',
                opacity : 0.8,
                id      : data.id ? data.id : null,
            }


            var marker = L.marker(data.latLng, options);
            return marker;
        },


        setIcon: function(icon, color) {
            var iconMarker = L.AwesomeMarkers.icon({
                icon: icon, 
                color: color
            });
            return iconMarker;
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

         ajustarCenter: function(latLng, zoom, offsetX, offsetY) {
            var x = offsetX ? offsetX : 0;
            var y = offsetY ? offsetY : 0;
            var centerPoint     = this.map.project(latLng,zoom);
            var newCenterPoint  = new L.Point(centerPoint.x+x, centerPoint.y+y);
            var newCenterLatLng = this.map.unproject(newCenterPoint, zoom);
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