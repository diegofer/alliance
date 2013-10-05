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


    	initialize: function() {
    		console.log('inicializando RegionListView');
            this.template = _.template(tpl);
            this.childViews = [];
    		//console.log(this.collection);
    	},

    	render: function() {
            this.$el.html(this.template()); 
    		this.setRegiones(); 
            return this.el;                   
    	},

        setRegiones: function() {
            LMap.groupLayer1.addTo(LMap.map);  // Agrego un groupLayer al mapa..
 
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

            //registrar cada vista
            this.childViews.push(regionListItemView);
    	},

        alOverRegion: function(event) {
            this.regionListChartView.selectRegion(event);
        },

        alOutRegion: function() {
            this.regionListChartView.deselectRegion();
        },
        
        
        setGrafico: function() {

            this.regionListChartView = new RegionListChartView({ 
                collection:  this.collection,
            });  
            this.$el.append(this.regionListChartView.render());

            // registrar la vista
            this.childViews.push(this.regionListChartView);
        },


        // Clean Views

        onClose: function() {
            // remover las views anidadas...
            _(this.childViews).each(function(view) {
                view.close();
            });
             // Remover las regiones del mapa... 
            LMap.groupLayer1.clearLayers(); 
        },
        
        
    	
    	
    	

    });
   
    return RegionListView; 
});