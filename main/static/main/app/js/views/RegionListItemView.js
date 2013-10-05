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
    		this.setRegionItem();
    	},


    	setRegionItem: function() {

    		this.regionItem = LMap.setPolygono({
    			latlngs:      LMap.decode(this.model.get('path')),
    			fillColor:    this.model.get('color'),
                fillOpacity:  0.5,
    			color:        this.model.get('color'), 
                label:        this.model.get('nombre'),
    		});

            LMap.groupLayer1.addLayer(this.regionItem);

            this.regionItem.on('mouseover', this.alMouseOver, this);
    		this.regionItem.on('mouseout', this.alMouseOut, this);
            this.regionItem.on('click', this.alClick, this);
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
            LMap.groupLayer1.removeLayer(this.regionItem); // removeLayer me ayuda a revomer el label..
            app.navigate('region/'+this.model.id, {
                trigger: true,
                //replace: true  // replace hace que History no grabe esta vista...
            });
        },


        onClose: function() {
            this.regionItem.clearAllEventListeners();
        },
        


    });
   
    return RegionListItemView; 
});