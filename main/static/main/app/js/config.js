// Original concepts provided by Backbone Boilerplate project: https://github.com/tbranyen/backbone-boilerplate
require.config({
    // Initialize the application with the main application file
    //deps: ["js/main"],

    urlArgs: "bust=" + (new Date()).getTime(),

    baseUrl: "/static/main/app",    //Es la url que django nos ofrece.. vea el settings.py

    waitSeconds : 20,

    paths: {
                
        jquery:     "js/libs/jquery/jquery-1.10.2",           
        validate :  "js/libs/jquery/jquery.validate",

        bootstrap:  "src/bootstrap/js/bootstrap",
       
        leaflet                   : "src/leaflet/leaflet-src",
        leafletLabel              : "src/leaflet/leaflet.label", 
        leafletEncoded            : "src/leaflet/Polyline.encoded",
        'leaflet.awesome-markers' : 'src/leaflet/plugins/awesome-markers/leaflet.awesome-markers.min',

        lodash:     "js/libs/backbone/lodash",
        backbone:   "js/libs/backbone/backbone",
        tastypie:   "js/libs/backbone/backbone-tastypie",     

        text:            "js/libs/require/text", 
        goog:            "js/libs/require/goog",
        async:           "js/libs/require/async",
        propertyParser:  "js/libs/require/propertyParser",

        dgo:       "js/dgo",
        tpl:       "tpl",

    },

    shim: { 
        /*jquery: {
            deps: ["async"],
        },*/  

        backbone: {
            deps: ["lodash", "jquery"],
            exports: "Backbone"
        },

        tastypie: {
            deps: ["backbone", "lodash", "jquery"]
        },

        validate: {
            deps: ["jquery"]
        },

        bootstrap: {
            deps: ["jquery"],
        },

        leafletLabel              : ['leaflet'],
        leafletEncoded            : ['leaflet'],
        'leaflet.awesome-markers' : ['leaflet'],

    }

});

requirejs(["js/main"]);