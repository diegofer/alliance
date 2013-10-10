define(function (require) {

	"use strict";

	var $                   =  require('jquery'),
		_                   =  require('lodash'),
		Backbone            =  require('backbone'),
		tastypie            =  require('tastypie'),
		LMap                =  require('dgo/maps/leaflet/LMap'),

		tpl                 =  require('text!tpl/region.html');

   
    var RegionView = Backbone.View.extend({

    	center : null,
    	zoom   : null,
        icon   : null,


    	initialize: function() {
    		console.log('inicializando RegionView');
    		this.template      =  _.template(tpl);
    		this.center        =  LMap.toLatLng(this.model.get('center'));
    		this.zoom          =  parseInt(this.model.get('zoom'));
            
            this.icon          =  LMap.setIcon('home', 'red');
            this.childMarkers  =  [];

            LMap.map.on('viewreset', this.setIglesias, this);
    	},

    	render: function() {
    		this.$el.html(this.template(this.model.attributes));
            this.setRegion();
    		return this.el;
    	},
      

    	setRegion: function() {
    		LMap.setView(this.center, this.zoom, -200); 

    		this.region = LMap.setPolygono({
    			latlngs     :    LMap.decode(this.model.get('path')),
    			color       :    this.model.get('color'),
    			fillColor   :    this.model.get('color'),
    			fillOpacity :    0.05,
    			weight      :    7,
    			label       :    this.model.get('nombre'),
    		});

    		this.region.addTo(LMap.map);     		  		
    	},

        setIglesias: function() {
            LMap.groupLayer1.addTo(LMap.map);  // Agrego un groupLayer al mapa..
            for (var i = 0; i < this.collection.length; i++) {
                var iglesia = this.collection[i];
                this.addIglesia(iglesia);
            };            
        },

        addIglesia: function(iglesiaModel) {             
            var iglesiaMarker = LMap.setMarker({
                latLng : LMap.toLatLng(iglesiaModel.get('geolocation')),
                icon   : this.icon,
                //title  : 'sede '+iglesiaModel.get('sede') +' '+ iglesiaModel.get('ciudad'),
                id     : iglesiaModel.id,
            }); 
            iglesiaMarker.bindLabel('sede '+iglesiaModel.get('sede') +' '+ iglesiaModel.get('ciudad'));
            iglesiaMarker.bindPopup(iglesiaModel.get('codigo'));
            iglesiaMarker.togglePopup();

            iglesiaMarker.on('click', this.alClickMarker, this);
            iglesiaMarker.on('dblclick', this.alDobleClickMarker, this);

            LMap.groupLayer1.addLayer(iglesiaMarker);

            this.childMarkers.push(iglesiaMarker);
        },


        alClickMarker: function(event) {
            //event.target.bindLabel('hola');
        },
        


        alDobleClickMarker: function(event) {
            LMap.groupLayer1.removeLayer(event.target);
            app.navigate('iglesia'+event.target.options.id, {trigger:true})
        },
        
        
        



    	onClose: function() {         
            this.collection = [];
            this.clearEvents();
            this.clearLayers();            
    	},


        clearEvents: function() {
            LMap.map.off('viewreset', this.setIglesias, this);

             _(this.childMarkers).each(function (marker) {
                marker.unbindPopup();
                marker.clearAllEventListeners();                
            });
        },

        clearLayers: function() {
            LMap.groupLayer1.clearLayers();
            LMap.map.removeLayer(LMap.groupLayer1);
            LMap.map.removeLayer(this.region);
        },
        
        
    	
    	
    	
    

    });
   
    return RegionView; 
});