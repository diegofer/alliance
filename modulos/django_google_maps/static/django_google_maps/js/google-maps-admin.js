
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

    var geocoder = new google.maps.Geocoder();
    var map;
    var marker;
    //var bounds_col; // el bounds de colombia.
    var autocomplete; // esto es para que el textinput me de sugerencias restringidas solo a colombia

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
                zoom = 16;
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
            if (existinglocation) {
                self.setMarker(latlng);
            };

            google.maps.event.addListener(map, 'zoom_changed', self.updateZoom);

            /*bounds_col = new google.maps.LatLngBounds(
                new google.maps.LatLng(-4.954223,-79.351043),
                new google.maps.LatLng(13.587181,-66.211395)
            );

            var rectangle = new google.maps.Rectangle({
              strokeColor: '#FF0000',
              strokeOpacity: 0.4,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.10,
              map: map,
              bounds: bounds_col
            });*/

            //$("#id_address").change(function() {self.codeAddress();});
            self.setAutoComplete();
        },

        getExistingLocation: function() {
            var geolocation = $("#id_geolocation").val();
            if (geolocation) {
                return geolocation.split(',');
            }
        },

        getExistingZoom: function() {
            var zoom = $("#id_zoom").val();
            if (zoom) return parseInt(zoom);
        },

        setAutoComplete: function() {
            var options = {
                types: ['(cities)','(regions)'],
                componentRestrictions: {country: 'co'}
            };
            var input = document.getElementById('id_address');
            autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.setComponentRestrictions({country: 'co'});
            autocomplete.setTypes(["geocode"]);
            google.maps.event.addListener(autocomplete, 'place_changed', self.alCambiarInput );
        },

        alCambiarInput: function() {
            var place = autocomplete.getPlace();
            var latlng = place.geometry.location;

            console.log(place.address_components);
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setZoom(15);  
                map.setCenter(place.geometry.location);
            }
           
            self.setMarker(latlng);

            self.updateGeolocation(latlng);
            self.updateZoom();

            var componentes = place.address_components;
            componentes.forEach(function(item, index){
                if (item.types[0] == 'locality') { 
                    console.log(item.long_name);
                    self.updateCiudad(item.long_name);
                };
                if (item.types[0] == 'administrative_area_level_1') { 
                    console.log(item.long_name);
                    self.updateDepto(item.long_name);
                };
            });
        },

        codeAddress: function() {
            var address = $("#id_address").val();

            geocoder.geocode({'address': address, 'bounds': bounds_col, 'region': 'CO'}, function(results, status) {


                //console.log(results[0].geometry)
                if (status == google.maps.GeocoderStatus.OK) {
                    var latlng = results[0].geometry.location;
                    
                    // Este if es para ajustal el mapa al viewport que el tiene..
                    var bounds = results[0].geometry.viewport;
                    if (bounds) { 
                        map.fitBounds(bounds) 
                    }else {
                        map.setCenter(latlng);
                        map.setZoom(15);
                    };
                 
                    self.setMarker(latlng);
                    self.updateGeolocation(latlng);
                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });
        },

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
                self.updateGeolocation(new_location.latLng);
                map.panTo(new_location.latLng);  // Agrego esto para centrar el mapa.
            });
        },

        updateMarker: function(latlng) {
            marker.setPosition(latlng);
        },

        updateGeolocation: function(latlng) {
            $("#id_geolocation").val(latlng.lat() + "," + latlng.lng());
        },

        updateAddress: function(address) {
            $('#id_address').val(address);
        },

        updateZoom: function(latlng) {
            $("#id_zoom").val(map.getZoom());
        },

        updateCiudad: function(ciudad) {
            $('#id_ciudad').val(ciudad);
        },

        updateDepto: function(depto) {
            $('#id_depto').val(depto);
        },
    }

    return self;
}

$(document).ready(function() {
    var googlemap = googleMapAdmin();
    googlemap.initialize();
});