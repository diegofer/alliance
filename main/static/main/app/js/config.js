// Original concepts provided by Backbone Boilerplate project: https://github.com/tbranyen/backbone-boilerplate
require.config({
    // Initialize the application with the main application file
    //deps: ["js/main"],

    urlArgs: "bust=" + (new Date()).getTime(),

    baseUrl: "/static/main/app",    //Es la url que django nos ofrece.. vea el settings.py
    waitSeconds : 20,
    paths: {
        // Libraries
        /*jquery: [  
            "//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
            "js/libs/jquery-1.9.0.min" 
        ], */
        
        jquery:     "js/libs/jquery-1.9.0.min",           
        validate :  "js/libs/jquery.validate",
        bootstrap:  "src/bootstrap/js/bootstrap",
        async:      "js/libs/async",
        gmaps:      "js/modules/gmaps",
        goog:       'js/libs/goog',
        propertyParser: 'js/libs/propertyParser',
        lodash:     "js/libs/lodash",
        backbone:   "js/libs/backbone-min",
        tastypie:   "js/libs/backbone-tastypie",
        tpl:        "tpl",
        text:       "js/libs/text", 
    },

    shim: { 
        /*jquery: {
            deps: ["async"],
        },*/

        bootstrap: {
            deps: ["jquery"],
        },

        gmaps: {
            deps: ["async"],
        },

        gcharts: {
            deps: ["async"],
        },

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

    }

});

requirejs(["js/main"]);