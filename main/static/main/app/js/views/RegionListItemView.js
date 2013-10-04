define(function (require) {

	"use strict";

	var _        = require('lodash'),
		Backbone = require('backbone'),
		tastypie = require('tastypie'),
		LMap     = require('dgo/maps/leaflet/LMap');



   
    var RegionListItemView = Backbone.View.extend({


    	initialize: function() {
    		console.log('inicializando RegionListItemView');
    		//console.log(this.model);
    	},


    	render: function() {
    		this.setRegion();
    	},


    	setRegion: function() {

    		var region = LMap.setPolygono({
    			latlngs:      LMap.decode(this.model.get('path')),
    			fillColor:    this.model.get('color'),
                fillOpacity:  0.5,
    			color:        this.model.get('color'), 
                label:        this.model.get('nombre'),
    		});


            region.on('click', this.alClick, this);
            region.on('mouseover', this.alMouseOver, this);
    		region.on('mouseout', this.alMouseOut, this);
    	},


    	alClick: function(event) {
            console.log('click en: '+this.model.get('nombre'));
    	},

        alMouseOver: function(event) {
            event.target.setStyle({fillOpacity: 0.9});
            this.trigger('overEnRegion', this.model.get('nombre'));
        },

        alMouseOut: function(event) {
            event.target.setStyle({fillOpacity: 0.5});
            this.trigger('outEnRegion');
        },
        
        
    	
    	
    	
    	



    });
   
    return RegionListItemView; 
});