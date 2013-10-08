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
    		this.template  = _.template(tpl);
    		this.center    =  LMap.toLatLng(this.model.get('center'));
    		this.zoom      =  parseInt(this.model.get('zoom'));

            this.icon      =  LMap.setIcon('home', 'red');

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
            console.log(iglesiaModel);
            var geoLocation = LMap.toLatLng(iglesiaModel.get('geolocation'));
            var iglesiaMarker = LMap.setMarker(geoLocation); 
            iglesiaMarker.setIcon(this.icon);
            LMap.groupLayer1.addLayer(iglesiaMarker);
        },
        
        



    	onClose: function() {
            LMap.map.off('viewreset', this.setIglesias, this);
            this.collection = null;

            LMap.groupLayer1.clearLayers();
            LMap.map.removeLayer(LMap.groupLayer1);
    		LMap.map.removeLayer(this.region);
    	},
    	
    	
    	
    

    });
   
    return RegionView; 
});