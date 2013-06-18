({
    baseUrl: "..",
    mainConfigFile: '../js/config.js',
    
    name:  "js/main",
    out:   "../js/main-built.js",

    //optimize: "none",

    paths: {
        //jquery: "empty:"
    },

    uglify: {
        toplevel: true,
        ascii_only: true,
        //beautify: true,
        max_line_length: 1000,        
    },

    stubModules : ['text'],
})