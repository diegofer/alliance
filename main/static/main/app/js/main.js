require([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',  
    'js/views/LMapView',
    'js/models/RegionCollection',
    'js/models/IglesiaCollection'
], 

function($, _, Backbone, tastypie, LMapView, RegionCollection, IglesiaCollection) { 


	// Este codigo, libera la memoria al cambiar de vista...
	Backbone.View.prototype.close = function() {
        console.log('Closing view ' + this.cid);
        if (this.beforeClose) {
            this.beforeClose();
        }
        this.remove();
        this.unbind();
    };


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
            ""                         : "inicio",
    		//"nacional"                 : "nacional",
            //"editar/:ambito/:username" : "editar",
    		//"empleados/*path"   : "empleadoDetalle"
    	},

        inicio: function() {
            //this.navigate(this.ambito, true);
            console.log('en Inicio');
            // var region = this.regionCollection.get('c2');
            // this.regionListView.showRegion(region.id);
            //this.charView = new ChartView({model:this.regionCollection});

        },

    	showView: function(selector, view) {
            if (this.currentView) this.currentView.close();

            $(selector).html(view.render());
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


