define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',
	'bootstrap',
	'gmaps',
	'js/utils/GoogleMapsUtil',
], 

function($, _, Backbone, tastypie, bootstrap, gmaps, Maps) {


   
    var RegionListView = Backbone.View.extend({

    	initialize: function(argument) {
    		console.log('Inicializando vista RegionList');
            this.render();
    	},

       

    	render: function() {
            for (var i = 0; i < this.model.length; i++) {
                var region = this.model.at(i);
                region.set('color', Maps.colors[i])
                this.addRegion(region);
            };
    	},

        addRegion: function(region) {        
            var regionItem = new RegionListItemView({
                model: region,
            });
            regionItem.on('clickEnRegion', function(event) {
                this.trigger('clickRegion', event);
            }, this);
        },

        showRegion: function(id) {        
            _.each(Maps.regionPolyArray, function(regionPoly){
                if (regionPoly.id == id) {
                    regionPoly.setVisible(true);
                } else{
                    regionPoly.setVisible(false);
                }; 
            })
        },

    });





    var RegionListItemView = Backbone.View.extend({


        initialize: function() { 
            this.render();            
        },

        render: function(event) {        
            this.setRegion();
        },

        ////  SETEAR REGIONES  //////

        setRegion: function() {
            var self = this;

            var poly = Maps.setPolygono({
                'path':        Maps.decode( this.model.get('path') ),
                'id':          this.model.id,
                'fillColor':   this.model.get('color'),//Math.floor(Math.random()*16777215).toString(16),
                'strokeColor': this.model.get('color'),
            });


            google.maps.event.addListener(poly, 'mouseover', function(){
                poly.setOptions({fillOpacity: 1,});
                self.trigger("clickEnRegion", self.model.get('nombre'));
            });

            google.maps.event.addListener(poly, 'mouseout', function(){
                poly.setOptions({fillOpacity: 0.20,});
            });           

        },

        alClickPoly: function(event) {                
            this.trigger("clickEnRegion", this.model.get('nombre'));
        },

    });
   
    return RegionListView; 
});