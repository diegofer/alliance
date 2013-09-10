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
        leaflet:    "src/leaflet/leaflet-src",

        lodash:     "js/libs/backbone/lodash",
        backbone:   "js/libs/backbone/backbone",
        tastypie:   "js/libs/backbone/backbone-tastypie",

        tpl:        "tpl",
        text:       "js/libs/require/text", 

        dgo:       "js/dgo",

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

    }

});

requirejs(["js/main"]);