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

    		this.region = LMap.setPolygono({
    			latlngs:      LMap.decode(this.model.get('path')),
    			fillColor:    this.model.get('color'),
                fillOpacity:  0.5,
    			color:        this.model.get('color'), 
                label:        this.model.get('nombre'),
    		});

            LMap.groupLayer1.addLayer(this.region);

            this.region.on('mouseover', this.alMouseOver, this);
    		this.region.on('mouseout', this.alMouseOut, this);
            this.region.on('click', this.alClick, this);
    	},

        alMouseOver: function(event) {
            event.target.setStyle({fillOpacity: 0.9});
            this.trigger('overEnRegion', this.model.get('nombre'));
        },

        alMouseOut: function(event) {
            event.target.setStyle({fillOpacity: 0.5});
            this.trigger('outEnRegion');
        },
        
        alClick: function(event) {
            app.navigate('region/'+this.model.id, {
                trigger: true,
                replace: true
            });
        },


        onClose: function() {
            this.region.clearAllEventListeners();
        },
        


    });
   
    return RegionListItemView; 
});