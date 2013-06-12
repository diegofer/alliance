define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie'
], 

function($, _, Backbone, tastypie) {
   
    var RegionModel = Backbone.Model.extend({
    	urlRoot: "/api/v1/region/"//?user__username=zarzal",
    });
   
    return RegionModel; 
});