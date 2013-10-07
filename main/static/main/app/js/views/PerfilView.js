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
        center     : null,
        zoom       : null,



    	initialize: function() {

    		console.log('inicializando vista PerfilView');
            this.template  =  _.template(tpl);
            this.center    =  LMap.toLatLng(this.model.get('geolocation'));
            this.zoom      =  parseInt(this.model.get('zoom'));
 
    	},


    	render: function() {
    		this.$el.html(this.template(this.model.attributes)); // le agrego el template a $el.
    		this.setPerfil();
            return this.el;
    	},	


        setPerfil: function() {

            LMap.setView(this.center, this.zoom);
            this.marker = LMap.crearMarker(this.center);
        },


        onClose: function() {
            LMap.map.removeLayer(this.marker);
        },
        
        
    	


    });
   
    return PerfilView; 
});