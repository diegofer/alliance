define([
	'jquery',
	'gmaps',
], 

function($, gmaps) { 
    var Maps = {

    	map: null,
    	iglesiaMarkerArray: [],
    	regionPolyArray: [],
    	drawingManager: null,

    	initMapa: function(mapCanvas, zoom, center) {
    		var centro = center instanceof gmaps.LatLng ? center : this.toLatLong(center);

    		var options = {
    			zoom     : zoom,
    			center   : centro,
    			mapTypeId : google.maps.MapTypeId.ROADMAP,
    			mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.BOTTOM_CENTER
                },
                panControl: true,
                panControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                }, 
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
    		};

    		this.map = new google.maps.Map(mapCanvas, options);
    		return this.map;
    	},

    	setDrawingManager: function() {
            this.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: null,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.BOTTOM_LEFT,
                    drawingModes: [
                        google.maps.drawing.OverlayType.MARKER,      
                        google.maps.drawing.OverlayType.POLYGON,
                        //google.maps.drawing.OverlayType.CIRCLE,
                        //google.maps.drawing.OverlayType.POLYLINE,
                        //google.maps.drawing.OverlayType.RECTANGLE
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
            this.drawingManager.setMap(this.map);
                     
        },

        resetDrawingManager: function() {
		    this.drawingManager.setDrawingMode(null);
        },

        removeDrawgManager: function() {
        	if (this.drawingManager) {
				this.drawingManager.setDrawingMode(null);
				this.drawingManager.setMap(null);
			};
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
                }
            ];

            var styledMapOptions = {
                name: 'division politica'
            };

            var mapTypeStyle = new google.maps.StyledMapType( featureOpts, {name: "Provincias"} );

            this.mapa.mapTypes.set('Provincias', mapTypeStyle);
            this.mapa.setMapTypeId('Provincias');
        },

    	toLatLong: function(address) {
    		var point = address.split(',');
            var latlng = new google.maps.LatLng( parseFloat(point[0]), parseFloat(point[1]) );
    		return latlng;
    	},

    	encode: function(overlay) {
            var path = overlay.getPath(); //obtengo en MVCArray 
            var pathEncode = google.maps.geometry.encoding.encodePath(path); // encoding el path
            return pathEncode;      
        },

        decode: function(encodePath) {
            var pathArray = google.maps.geometry.encoding.decodePath(encodePath);
            return pathArray; 
        },

        getCenterPolygono: function (polygono) {
        
            var bounds = new google.maps.LatLngBounds();
            var path = polygono.getPath();
            var posicion;

            path.forEach(function(element, index){ 
                bounds.extend(element);
            });

            posicion = bounds.getCenter();

            if( google.maps.geometry.poly.containsLocation( posicion, polygono ) == false )
            {
                posicion = path.getAt(0);
            } 

            return posicion;
        }, 


        /////  SETEAR POLYGONO ///////

        setPolygono: function(opt) {
            console.log('en setpoligono'+opt.fillColor);
            var polygono = new google.maps.Polygon({
                path: opt.path,
                clickable: true,
                editable: false,
                strokeColor: opt.strokeColor ? opt.strokeColor : "#3F4C6B",
                strokeOpacity: 1,
                strokeWeight: 1.5,
                fillColor: opt.fillColor ? opt.fillColor : "#4096EE",
                fillOpacity: 0.20,
                geodesic: true,
                id: opt.id,
            })
            polygono.setMap(Maps.map);
            this.regionPolyArray.push(polygono);
            return polygono;
        }, 

        clearMarkers: function(eliminar) {
        	if (this.iglesiaMarkerArray) {
        		for (i in this.iglesiaMarkerArray) {
        			this.iglesiaMarkerArray[i].setMap(null);
        		}
        		if (eliminar) this.iglesiaMarkerArray.length = 0;
        	}
        },

        clearPolygonos: function(eliminar) {
        	if (this.regionPolyArray) {
        		for (i in this.regionPolyArray) {
        			this.regionPolyArray[i].setMap(null);
        		}
        		if (eliminar) this.regionPolyArray.length = 0;
        	}
        },

        colors: new Array('#ff6600', '#0191CF', '#A21983', '#E0134F', '#5d3aa3', '#6cb33e', '#FEC425', '#999999'),
   

    }; 
    return Maps; 
});