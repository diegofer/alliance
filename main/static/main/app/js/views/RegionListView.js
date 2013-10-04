define(function (require) {

	"use strict";

	var $                   = require('jquery'),
		_         		    = require('lodash'),
		Backbone            = require('backbone'),
		tastypie            = require('tastypie'),
		LMap                = require('dgo/maps/leaflet/LMap'),
		RegionListItemView  = require('js/views/RegionListItemView'),
        RegionListChartView = require('js/views/RegionListChartView'),

        tpl                 = require('text!tpl/regionList.html');


   
    var RegionListView = Backbone.View.extend({

        template: _.template(tpl),


    	initialize: function() {
    		console.log('inicializando RegionListView');
    		//console.log(this.collection);
    	},

    	render: function() {
            this.$el.html(this.template()); 
    		this.setRegiones();                    
    	},

        setRegiones: function() {
            for (var i = 0; i < this.collection.length; i++) {
                var region = this.collection.at(i);
                region.set('color', LMap.colors[i] );
                this.addRegion(region);
            };

            this.setGrafico();
        },
        
    	addRegion: function(region) {
    		var regionListItemView = new RegionListItemView({
    			model: region,
    		});
    		regionListItemView.render();
            regionListItemView.on('overEnRegion', this.alOverRegion, this);
            regionListItemView.on('outEnRegion', this.alOutRegion, this);
    	},

        alOverRegion: function(event) {
            this.regionListChartView.selectRegion(event);
        },

        alOutRegion: function() {
            this.regionListChartView.deselectRegion();
        },
        
        


        setGrafico: function() {
            this.regionListChartView = new RegionListChartView({
                el:          this.$el.find('#content-grafico'), 
                collection:  this.collection,
            });  
        },
        
    	
    	
    	

    });
   
    return RegionListView; 
});