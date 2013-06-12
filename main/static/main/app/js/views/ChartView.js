define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',
    'js/utils/GoogleMapsUtil',
	'goog!visualization,1,packages:[corechart]',
], 
function($, _, Backbone, tastypie, Maps) {
   
    var ChartView = Backbone.View.extend({

        initialize: function() {  
        	console.log('Inicializando vista ChartView'); 
            this.listenTo(app.regionListView, 'clickRegion', this.selectRegion);
            this.render();
        },

        render: function() { 
            this.dibujarChart();
        },

        dibujarChart: function() {        
            var dt = new google.visualization.DataTable();
            dt.addColumn('string', 'Region');
            dt.addColumn('number', 'Iglesias');

            var indexRegion = {};

            this.model.each(function(data) {
                var index = dt.addRow([data.get('nombre'), data.get('iglesias')]);
                indexRegion[data.get('nombre')] = index;
            });

            this.indexRegion = indexRegion;

            var opt = { 
                title: 'Iglesias por cada Región', 
                backgroundColor: 'white',
                colors: Maps.colors,
                //chartArea: {left:20},
                pieSliceText: 'value',
                tooltip: {
                    showColorCode: true,
                    trigger: 'focus',
                }
            };

            this.chart = new google.visualization.PieChart(document.getElementById('sidebar-right'));
            this.chart.draw(dt, opt);
        },

        selectRegion: function(nombre) {  
            var rowIndex = this.indexRegion[nombre];
            this.chart.setSelection([{row:rowIndex}]);
        },



    }); 
   
    return ChartView; 
});