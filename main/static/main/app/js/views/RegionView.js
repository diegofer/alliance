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


    	initialize: function() {
    		console.log('inicializando RegionView');
    		this.template  = _.template(tpl);
    		this.center    =  LMap.toLatLng(this.model.get('center'));
    		this.zoom      =  parseInt(this.model.get('zoom'));
    		//console.log(this.model);
    	},

    	render: function() {
    		this.$el.html(this.template(this.model.attributes));
    		this.setRegion();
    		return this.el;
    	},

    	setRegion: function() {
    		LMap.setView(this.center, this.zoom, -150); 

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



    	onClose: function() {
    		LMap.map.removeLayer(this.region);
    	},
    	
    	
    	
    

    });
   
    return RegionView; 
});