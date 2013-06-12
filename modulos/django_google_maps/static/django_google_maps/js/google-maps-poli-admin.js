
/*
Integration for Google Maps in the django admin.

How it works:

You have an address field on the page.
Enter an address and an on change event will update the map
with the address. A marker will be placed at the address.
If the user needs to move the marker, they can and the geolocation
field will be updated.

Only one marker will remain present on the map at a time.

This script expects:

<input type="text" name="address" id="id_address" />
<input type="text" name="geolocation" id="id_geolocation" />

<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

*/

function googleMapAdmin() {

    google.maps.visualRefresh = true;

    var map;
    var marker;
    var polygono;
    var drawingManager;
    var pathEncode;
    var infoWindow;
    //var bounds_col; // el bounds de colombia.

    var self = {
        initialize: function() {
            var lat = 4.520855;
            var lng = -74.098308;
            var zoom = 6;
            // set up initial map to be world view. also, add change
            // event so changing address will update the map
            existinglocation = self.getExistingLocation();
            if (existinglocation) {
                lat = existinglocation[0];
                lng = existinglocation[1];
            }
            existingZoom = self.getExistingZoom();
            if (existingZoom) zoom = existingZoom;

            var latlng = new google.maps.LatLng(lat,lng);
            var myOptions = {
                zoom: zoom,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            self.setStyleMap();


            if (existinglocation) self.setMarker(latlng);

            existingPath = self.getExistingPath();
            if (existingPath) {
                self.setPolygono(existingPath);
            }else {
                self.setDrawingManager();
            }
 
            google.maps.event.addListener(map, 'zoom_changed', self.updateFieldZoom);         
        },

        getExistingLocation: function() {
            var geolocation = $("#id_center").val();
            if (geolocation) return geolocation.split(','); 
        },

        getExistingPath: function() {
            var path = $("#id_path").val();
            if (path) return self.decode(path);
        },

        getExistingZoom: function() {
            var zoom = $("#id_zoom").val();
            if (zoom) return parseInt(zoom);
        },


        ///// SETEAR API DE DUBUJO

        setDrawingManager: function() {
            drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: null,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT,
                    drawingModes: [
                        //google.maps.drawing.OverlayType.MARKER,      
                        google.maps.drawing.OverlayType.POLYGON,
                        //gmaps.drawing.OverlayType.CIRCLE,
                        //gmaps.drawing.OverlayType.POLYLINE,
                        //gmaps.drawing.OverlayType.RECTANGLE
                    ]
                },

                polygonOptions: {
                    clickable: true,
                    editable: true,
                    zIndex: 1,
                    strokeColor: "#3F4C6B",
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: "#4096EE",
                    fillOpacity: 0.35
                },

                markerOptions:{
                    draggable: true,
                }
            });
            drawingManager.setMap(map);
            google.maps.event.addListener(drawingManager, 'overlaycomplete', self.alCrearOverlay );                     
        },

        alCrearOverlay: function(event) {
            self.resetDrawingManager();
            self.removeDrawgManager();

            if (event.type == google.maps.drawing.OverlayType.POLYGON) {
                polygono = event.overlay;
                polygono.setEditable(false);
                pathEncode = self.encode(polygono);         
            }

            var latlng = self.getCenterPolygono();

            self.setMarker(latlng);
            self.mostrarInfoWindow();

            self.updateFieldPath();         
            self.updateFieldCenter(latlng);
            self.updateFieldZoom();
            map.panTo(latlng);

            self.setListeners();
        },


        ///// SETEAR POLYGONO

        setPolygono: function(path) {
            polygono = new google.maps.Polygon({
                paths: path,
                clickable: true,
                editable: false,
                zIndex: 1,
                strokeColor: "#3F4C6B",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "#4096EE",
                fillOpacity: 0.35
            })
            polygono.setMap(map);
            self.setListeners();
        },

        setListeners: function() {
            google.maps.event.addListener(polygono, 'mouseout', self.alPolyOut );
            google.maps.event.addListener(polygono, 'dblclick', self.eliminarNode ); 
            google.maps.event.addListener(marker, 'click', self.alMarkerOver );
        },

        alPolyOut: function() {
            pathEncode = self.encode(polygono); 
            self.updateFieldPath();  
        },

        polygonoModoEditable: function(val) {
            polygono.setEditable(val);
        },

        resetDrawingManager: function() {
            drawingManager.setDrawingMode(null);
        },

        removeDrawgManager: function() {
            if (drawingManager) {
                drawingManager.setDrawingMode(null);
                drawingManager.setMap(null);
            };
        },

        eliminarNode: function(event) {
            if (event.vertex != null && polygono.getPath().getLength() > 3) {
                polygono.getPath().removeAt(event.vertex);
            }
        },

        ///  SETEAR INFOWINDOW

        mostrarInfoWindow: function(latlng) {
            var content = '<div>'+
            '<h4>Mapa De la Region</h4>'+
            'Arrastre el marcador lo mas al centro posible'+
            '<p><button id="editar-poly" title="Editar el Mapa" type="button">Editar Mapa</button>'+
            '<button id="eliminar-poly" title="Ojo! Eliminar el Mapa" type="button">Eliminar Mapa</button></p>'+
            '</div>';

            if (!infoWindow) {
                infoWindow  = new google.maps.InfoWindow;
            }
            
            infoWindow.setContent(content);            
            infoWindow.open(map, marker); 
            $("#editar-poly").live('click', self.alClickEditarPoly); 
            $("#eliminar-poly").live('click', self.alClickEliminarPoly);             
        },

        alClickEditarPoly: function() {
            self.polygonoModoEditable(true);
            infoWindow.close();
        },

        alClickEliminarPoly: function() {
            self.removeOverlays();
            self.setDrawingManager();
        },


        // SETEAR EL MARKER

        setMarker: function(latlng) {
            if (marker) {
                self.updateMarker(latlng);
            } else {
                self.addMarker({'latlng': latlng, 'draggable': true});
            }
        },

        addMarker: function(Options) {
            marker = new google.maps.Marker({
                map: map,
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
                self.updateFieldCenter(new_location.latLng);
                map.panTo(new_location.latLng);  // Agrego esto para centrar el mapa.
            });
        },

        updateMarker: function(latlng) {
            marker.setPosition(latlng);
        },

        alMarkerOver: function() {
            self.mostrarInfoWindow();
        },


        //// ACTUALICAR LOS CAMPOS EN EL FORMULARIO CON LOS VALORES OBTENIDOS

        updateFieldPath: function() {
            $('#id_path').val(pathEncode);
        },

        updateFieldCenter: function(latlng) {
            $("#id_center").val(latlng.lat() + "," + latlng.lng());
        },

        updateFieldZoom: function(latlng) {
            $("#id_zoom").val(map.getZoom());
        },


        /////  UTILES

        encode: function(overlay) {
            var path = overlay.getPath(); //obtengo en MVCArray 
            console.log(path);
            var pathEncode = google.maps.geometry.encoding.encodePath(path); // encoding el path
            return pathEncode;      
        },

        decode: function(encodePath) {
            var pathArray = google.maps.geometry.encoding.decodePath(encodePath);
            return pathArray;    
        },

        getCenterPolygono: function () {     
            var bounds = new google.maps.LatLngBounds();
            var path = polygono.getPath();
            var posicion;

            path.forEach(function(element, index){ 
                bounds.extend(element);
            });

            posicion = bounds.getCenter();

            if( google.maps.geometry.poly.containsLocation( posicion, polygono ) == false ) {
                posicion = path.getAt(0);
            } 

            return posicion;
        },

        removeOverlays: function() {
            polygono.setMap(null);
            marker.setMap(null);

            marker = null;
        },

        setStyleMap: function() {
            var featureOpts = [
                {
                    featureType: 'administrative.country',
                    elementType: 'geometry.stroke',
                    stylers: [
                        { "visibility": "on" },
                        { "color": "#000000" },
                        { "weight": 1.8 }
                    ]
                },
                {
                    featureType: 'administrative.province',
                    elementType: 'geometry.stroke',
                    stylers: [
                        { "visibility": "on" },
                        { "color": "#ff2ccc" },
                        { "weight": 1.8 }
                    ]
                },
                {
                    featureType: 'administrative.locality',
                    elementType: 'geometry.stroke',
                    stylers: [
                        { "visibility": "on" },
                        { "color": "#007d00" },
                        { "weight": 2.1 }
                    ]
                },
                {
                    featureType: 'administrative.neighborhood',
                    elementType: 'geometry.stroke',
                    stylers: [
                        { "visibility": "on" },
                        { "color": "#007d00" },
                        { "weight": 2.1 }
                    ]
                }

            ];

            var styledMapOptions = {
                name: 'division politica'
            };

            var mapTypeStyle = new google.maps.StyledMapType( featureOpts, {name: "Provincias"} );

            map.mapTypes.set('Provincias', mapTypeStyle);
            map.setMapTypeId('Provincias');
        },



    }

    return self;
}

$(document).ready(function() {
    var googlemap = googleMapAdmin();
    googlemap.initialize();
});