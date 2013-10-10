define(function (require) {

	var $          = require('jquery'),
		_          = require('lodash'),
		Backbone   = require('backbone'),
		tastypie   = require('tastypie'),
		LMap       = require('dgo/maps/leaflet/LMap'),
		tpl        = require('text!tpl/iglesia.html');	
   
    var IglesiaView = Backbone.View.extend({

    	latLng : null,
    	zoom   : null,

    	initialize: function() {
    		console.log('inicializando IglesiaView');
    		this.template  = _.template(tpl);
    		this.latLng    = LMap.toLatLng(this.model.get('geolocation'));
    		this.zoom      = parseInt(this.model.get('zoom'));

            LMap.map.on('viewreset', this.setIglesia, this);
    	},


    	render: function() {
    		this.$el.html(this.template(this.model.attributes));
            LMap.setView(this.latLng, this.zoom, -200);
    		return this.el;
    	},


    	setIglesia: function() {
            console.log('crea marker para vista iglesia');
    		this.marker = LMap.setMarker({
                latLng: this.latLng,
                icon: LMap.setIcon('home', 'red')
            });
            
            this.marker.addTo(LMap.map);

    	},

        

    	onClose: function() {
            LMap.map.off('viewreset', this.setIglesia, this);
            LMap.map.removeLayer(this.marker);
        },  	


    });
   
    return IglesiaView; 
});