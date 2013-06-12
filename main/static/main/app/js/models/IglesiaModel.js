define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie'
], 

function($, _, Backbone, tastypie) {
   
    var IglesiaModel = Backbone.Model.extend({
    	urlRoot: "/api/v1/iglesia/"//?user__username=zarzal",
    });
   
    return IglesiaModel; 
});