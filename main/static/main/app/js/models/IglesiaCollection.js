define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',
	'js/models/IglesiaModel'
], 

function($, _, Backbone, tastypie, IglesiaModel) {
   
    var IglesiaCollection = Backbone.Collection.extend({

    	url: "/api/v1/iglesia/", //?limit=0", //"/api/v1/iglesia/?user__username=zarzal",
    	model: IglesiaModel


    });
   
    return IglesiaCollection; 
});