define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',
	'bootstrap',
    'gmaps',
    'js/utils/GoogleMapsUtil',
    'js/models/IglesiaModel',
    'js/models/IglesiaCollection',
], 

function($, _, Backbone, tastypie, bootstrap, gmaps, Maps, IglesiaModel, IglesiaCollection ) {
   
    var MapaView = Backbone.View.extend({

        ambito: '',  // local, regional, nacional
    	el: $('#map_canvas'),
        infoWindow: null,
     

    	initialize: function(attributes) {
            if (attributes.ambito) this.ambito = attributes.ambito;
    		console.log('Inicializando vista MapaView');

            
            //this.collection.bind('reset', this.addAll, this);      
            this.render();
    	},

    	render: function() {
            google.maps.visualRefresh = true;
            this.infoWindow = new google.maps.InfoWindow();
    		this.crearMapa(); 
            this.definirAmbito();
            this.cargarDatos();        
    	},

    	crearMapa: function() {           
            Maps.initMapa(this.el, 6, '4.520855,-74.098308');      
    	},

        definirAmbito: function() {
            if (this.ambito == 'nacional') this.setNacional();
            if (this.ambito == 'regional') {};
            if (this.ambito == 'local') {};
        },

        setNacional: function() {
            this.resetMap(false);
            this.moverMapTo( Maps.toLatLong('4.520855,-74.098308') );
            Maps.map.setZoom(6);
        },

        setRegional: function() {

        },

        setLocal: function() {

        },


        ////// MOSTRAR IGLESIAS //////////////////


        showIglesias: function() {

        },


        cargarDatos: function() {
            this.iglesiaCollection =  new IglesiaCollection();
            var self = this;
            this.iglesiaCollection.fetch({
                success: function(data, response, options) {
                    self.iglesiaCollection.each(function(iglesia){
                        self.addMarker({
                            'latlng': Maps.toLatLong(iglesia.get('geolocation')), 
                            'draggable': false
                        });
                    });
                    //console.log(self.iglesiaCollection.toJSON());

                },
            });      
        },



        ///////  SETEAR MARKERTS  ////////////

        setMarker: function(latlng) {
            if (marker) {
                self.updateMarker(latlng);
            } else {
                self.addMarker({'latlng': latlng, 'draggable': true});
            }
        },

        addMarker: function(Options) {
            marker = new google.maps.Marker({
                map: Maps.map,
                position: Options.latlng
            });

            var draggable = Options.draggable || false;
            if (draggable) {
                self.addMarkerDrag(marker);
            }
        },

        addMarkerDrag: function() {
            marker.setDraggable(true);
            google.maps.event.addListener(marker, 'dragend', function(new_location) {
                self.updateGeolocation(new_location.latLng);
                map.panTo(new_location.latLng);  // Agrego esto para centrar el mapa.
            });
        },

        updateMarker: function(latlng) {
            marker.setPosition(latlng);
        },

        setEdit: function() {
            this.updateZoom();
            this.setListenerZoom(this);

            if (this.ambito == 'nacional') this.setEditNacional();
            if (this.ambito == 'regional') {};
            if (this.ambito == 'local') {};
        },

        setEditNacional: function() {
            Maps.setDrawingManager(); 
            this.setListenerDrawingManager(this);
        },

        alCrearOverlay: function(event) {
            Maps.resetDrawingManager();
            var overlay = event.overlay;
            
            if (event.type == gmaps.drawing.OverlayType.POLYGON) {
                overlay.setEditable(false);
                this.pathEncode = Maps.encode(overlay);
                this.updatePath(this.pathEncode);
                Maps.polyArray.push(overlay);
            }

            if (event.type == gmaps.drawing.OverlayType.MARKER) {
                this.moverMapTo(overlay.getPosition());
                this.setListenerDrag(overlay);
                Maps.markersArray.push(overlay);
            }
        },



        // LISTENERS

        setListenerDrag: function(marker) {
            var self = this;
            gmaps.event.addListener(marker, 'dragend', function(new_location) {
                self.moverMapTo(new_location.latLng);
            });
        },

        setListenerZoom:function(self) {
            gmaps.event.addListener(Maps.map, 'zoom_changed', function(event){
                self.updateZoom();
            })
        },
        setListenerDrawingManager:function(self) {
            gmaps.event.addListener(Maps.drawingManager, 'overlaycomplete', function(event){
                self.alCrearOverlay(event);
            } );
        },

        updateZoom: function() {
            $('#zoom').val(Maps.map.getZoom());
        },

        updateCentro: function(latlng) {
            $("#centro").val(latlng.lat() + "," + latlng.lng());
        },

        updatePath: function(path) {
            $('#path').val(path);
        },

        resetMap: function(deleteOverlays) {
            Maps.clearMarkers(deleteOverlays);
            Maps.clearPolygonos(deleteOverlays);
            Maps.removeDrawgManager();
        },

        moverMapTo: function(latlng) {
            Maps.map.panTo(latlng);  // Agrego esto para centrar el mapa.
            this.updateCentro(latlng);
        },





      

        // manejarAmbitoLocal: function() {
        //     var geolocation  =   $('#iglesia-geolocation').val();
        //     var zoom         =   $('#iglesia-zoom').val();
        //     var codigo       =   $('#iglesia-codigo').val();
        //     var address      =   $('#iglesia-address').val();
            
        //     var point     =  geolocation.split(',');
        //     var latlng    =  new gmaps.LatLng( parseFloat(point[0]), parseFloat(point[1]) );
        //     var html      =  '<h4 class="">Iglesia Alianza Cristiana - '+codigo+'</h4>'+ address;        

        //     this.setMarkert(latlng, this.infoWindow, html);
        //     this.setCenter(latlng); 
        //     this.setZoom(parseInt(zoom));
        // },

        // addOne: function(iglesia) {
        //     var address =  iglesia.get('geolocation');
        //     var point = address.split(',');
        //     var latlng = new gmaps.LatLng( parseFloat(point[0]), parseFloat(point[1]) );

        //     var marker = new gmaps.Marker({
        //         position: latlng,
        //         map: this.mapa,
        //         title: iglesia.get('address')
        //     });
        // },

        // addAll: function() {
        //     _.each( this.collection.models, function(iglesia) {

        //         this.addOne(iglesia);

        //     }, this );

        //},

        // setMarkert: function(latlng, infoWindow, html) {
        //     var marker = new gmaps.Marker({
        //         position: latlng,
        //         map: this.mapa,
        //         //title: iglesia.get('address')
        //     });

        //     marker.setIcon('/static/shell/img/mapicons/church-2.png');

        //     this.setInfoWindow(marker, infoWindow, html);

        // },

        // setCenter: function(latlng) {
        //     this.mapa.setCenter(latlng);
        // },

        // setZoom: function(zoom) {
        //     this.mapa.setZoom(zoom);
        // },

        // setInfoWindow: function(marker, infoWindow, html) {

        //     gmaps.event.addListener(marker, 'click', function() {

        //         infoWindow.setContent(html);
        //         infoWindow.open(marker.getMap(), marker);           
        //     });
        // },


    });
   
    return MapaView; 
});