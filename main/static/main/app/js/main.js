// define(function (require) {

//     "use strict";
   
//     var $                 = require('jquery'),
//         Backbone          = require('backbone'),
//         tastypie          = require('tastypie'),
//         RegionCollection  = require('js/models/RegionCollection'),
//         IglesiaCollection = require('js/models/IglesiaCollection'),
//         LMapView          = require('js/views/LMapView');
   
require([
	'jquery',
    'bootstrap',
	'lodash',
	'backbone',
	'tastypie',  
    'js/models/RegionCollection',
    'js/models/IglesiaCollection',
    'js/views/LMapView',
    'js/views/PerfilView',
    'js/views/RegionListView',
    'js/views/RegionView',
], 

function($, bootstrap, _, Backbone, tastypie, 
    RegionCollection, IglesiaCollection, LMapView, 
    PerfilView, RegionListView, RegionView) { 


	// Este codigo, libera la memoria al cambiar de vista...
    Backbone.View.prototype.close = function() {
        console.log('cerrando view ' + this.cid);

        if (this.onClose) this.onClose();            

        this.remove();
        this.unbind();    };


    var AppRouter = Backbone.Router.extend({

    	initialize: function(options) {
            this.ambito = options.ambito;
            this.regionCollection = options.regionCollection;
            this.iglesiaCollection = options.iglesiaCollection;

    		console.log('inicializando el router');
            console.log('Ambito: '+this.ambito);

            this.lMapView = new LMapView();

    		//this.mapaView = new MapaView({ ambito: this.ambito });
            //this.regionListView = new RegionListView({ model: this.regionCollection });

            
    	},

    	routes: {
            ''                  : 'inicio',
            "perfil/:id"        : 'perfil',
            'region/*path'      : 'regionDetalle',
    		//"nacional"                 : "nacional",
            //"editar/:ambito/:username" : "editar",
    		//"empleados/*path"   : "empleadoDetalle"
    	},

        inicio: function() {          
             this.lMapView.irInicio();

            var regionListView = new RegionListView({
                collection:  this.regionCollection
            });
            
            this.setView($('#content-left'), regionListView);
        },

        regionDetalle: function(id) {
            var regionModel = this.regionCollection.get(id);

            var regionView = new RegionView({
                model: regionModel
            });
            
            this.setView($('#content-left'), regionView);
        },

        perfil: function(id) {
            var igle = this.iglesiaCollection.findWhere({codigo: id});
            this.lMapView.irA(igle);

            var perfilView = new PerfilView({
                model: igle,
            });          
            
            this.setView($('#content-left'), perfilView);
        },        
        
        


        // Renderiza y registra la nueva vista y cierra la vista actual....
        setView: function($selector, view) {
            if (this.currentView) this.currentView.close();

            $selector.html(view.render());
            this.currentView = view;

            return view;
        },
        
        
        
    });


    function inicializar() {
        var ambito = $('#ambito').val();
        var regionCollection = new RegionCollection(); 
        var iglesiaCollection = new IglesiaCollection(); 

        var self = {

            initialize: function() {   
                self.cargarRegiones()
            },

            cargarRegiones: function() {  
                console.log('cargando regiones');                      
                regionCollection.once('sync', self.alCargarRegiones);
                regionCollection.fetch();
            },

            alCargarRegiones: function(data) {
                
                //console.log(data);
                self.cargarIglesias();
            },

            cargarIglesias: function() { 
                console.log('cargando iglesias');                  
                iglesiaCollection.once('sync', self.alCargarIglesias);
                iglesiaCollection.fetch();
            },

            alCargarIglesias: function(data) {
                //console.log(data);
                self.iniciarRouter();
            },

            iniciarRouter: function(argument) {
                window.app = new AppRouter({
                    ambito: ambito,
                    regionCollection: regionCollection,
                    iglesiaCollection: iglesiaCollection,
                });
                Backbone.history.start();  
            }

        }
        return self;      
    };

    var initApp = inicializar();
    initApp.initialize();
  
});


