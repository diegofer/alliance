define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',
	'goog!visualization,1,packages:[corechart]',
], 
function($, _, Backbone, tastypie) {
   
    var ChartView = Backbone.View.extend({

        initialize: function() {  
        	console.log('Inicializando vista ChartView'); 
            //this.listenTo(app.regionListView, 'clickRegion', this.selectRegion);
            this.render();
            //console.log(this.el);
        },

        render: function() { 
            this.dibujarChart();
        },

        dibujarChart: function() {        
            var dt = new google.visualization.DataTable();
            dt.addColumn('string', 'Region');
            dt.addColumn('number', 'Iglesias');

            var indexRegion = {};
            var colors = [];

            this.collection.each(function(data) {
                var index = dt.addRow([data.get('nombre'), data.get('iglesias')]);
                indexRegion[data.get('nombre')] = index;
                colors.push(data.get('color'));
            });

            this.indexRegion = indexRegion;

            var opt = { 
                title: 'Iglesias por cada Región', 
                pieHole: 0.4,
                backgroundColor: 'white',
                colors: colors,
                chartArea: {
                    left:20,
                    top: 40,
                    width:"90%",
                    height:"90%"
                },
                pieSliceText: 'value',
                tooltip: {
                    showColorCode: true,
                    trigger: 'focus',
                }
            };

            this.chart = new google.visualization.PieChart(this.el);
            this.chart.draw(dt, opt);
        },

        selectRegion: function(nombre) {  
            var rowIndex = this.indexRegion[nombre];
            this.chart.setSelection([{row:rowIndex}]);
        },

        deselectRegion: function() {
            this.chart.setSelection(null);
        },
        



    }); 
   
    return ChartView; 
});