define(function(require) {

    "use strict";

	var $            = require('jquery'),
		_            = require('lodash'),
		Backbone     = require('backbone'),
		tastypie     = require('tastypie'),
		tpl          = require('text!tpl/perfil.html');

	


   
    var PerfilView = Backbone.View.extend({

    	tagName: 'div',
    	className: 'panel',



    	initialize: function() {

    		console.log('inicializando vista PerfilView');
            this.template = _.template(tpl);
 
    	},


    	render: function() {
    		this.$el.html(this.template(this.model.attributes)); // le agrego el template a $el.
    		console.log(this.model.attributes);
            return this.el;
    	},	
    	


    });
   
    return PerfilView; 
});