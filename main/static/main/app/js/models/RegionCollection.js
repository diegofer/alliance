define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',
	'js/models/RegionModel'
], 

function($, _, Backbone, tastypie, RegionModel) {
   
    var RegionCollection = Backbone.Collection.extend({

    	url: "/api/v1/region/", //"/api/v1/iglesia/?user__username=zarzal",
    	model: RegionModel

    });
   
    return RegionCollection; 
});