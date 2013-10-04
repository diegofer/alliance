define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',
    'dgo/maps/leaflet/LMap',
], 

function($, _, Backbone, tastypie, LMap) {

   
    var LMapView = Backbone.View.extend({

        	
    	initialize: function(data) {
    		console.log('inicializando LMapView');
    		
            this.render();  
    	},


        render: function() {
            LMap.initMap('map_canvas', 4.520855, -74.098308, 6 );
        },


        irInicio: function() {
            LMap.moveTo(LMap.toLatLng('4.520855, -74.098308'), 6);
        },


        irA: function(data) {

            var latlng = LMap.toLatLng(data.get('geolocation'));

            LMap.moveTo(latlng, data.get('zoom'));
            LMap.crearMarker(latlng);
        },


           	
    	

    });
    return LMapView; 
});