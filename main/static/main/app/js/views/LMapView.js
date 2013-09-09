define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',
	'leaflet',
], 

function($, _, Backbone, tastypie, L) {
   
    var LMapView = Backbone.View.extend({


    	
    	initialize: function(data) {
    		console.log('inicializando LMapView');
    		this.initMapa();  
    	},


    	initMapa: function() {
    		var osmUrl     = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    		var osmAttrib  = 'Map data &copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    		var capa = L.tileLayer(osmUrl, { attribution: osmAttrib	});

    		var map = L.map('map_canvas').setView([4.520855, -74.098308], 6);
    		map.addLayer(capa);

    	},
    	



    	   	
    	
    	

    });


    return LMapView; 
});