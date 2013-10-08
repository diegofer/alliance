define(function(require) {

    "use strict";

	var $            = require('jquery'),
		_            = require('lodash'),
		Backbone     = require('backbone'),
		tastypie     = require('tastypie'),
        LMap         = require('dgo/maps/leaflet/LMap'),
		tpl          = require('text!tpl/perfil.html');	


   
    var PerfilView = Backbone.View.extend({

    	tagName    : 'div',
    	className  : 'panel',
        latLng     : null,
        zoom       : null,



    	initialize: function() {

    		console.log('inicializando vista PerfilView');
            this.template  =  _.template(tpl);
            this.latLng    =  LMap.toLatLng(this.model.get('geolocation'));
            this.zoom      =  parseInt(this.model.get('zoom'));
 
    	},


    	render: function() {
    		this.$el.html(this.template(this.model.attributes)); // le agrego el template a $el.
    		this.setPerfil();
            return this.el;
    	},	


        setPerfil: function() {
            LMap.setView(this.latLng, this.zoom, -200);

            this.marker = LMap.setMarker(this.latLng);
            this.marker.setIcon(LMap.setIcon('home', 'red') );
            this.marker.addTo(LMap.map);
        },


        onClose: function() {
            LMap.map.removeLayer(this.marker);
        },
        
        
    	


    });
   
    return PerfilView; 
});