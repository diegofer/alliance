define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',
	'goog!visualization,1,packages:[corechart]',
], 
function($, _, Backbone, tastypie) {
   
    var ChartView = Backbone.View.extend({

        dt          : new google.visualization.DataTable(),
        opt         : {},
        colors      : [],
        indexRegion : {},



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
            this.dt.addColumn('string', 'Region');
            this.dt.addColumn('number', 'Iglesias');

            this.collection.each(function(data) {
                var index = this.dt.addRow([data.get('nombre'), data.get('iglesias')]);
                this.indexRegion[data.get('nombre')] = index;
                this.colors.push(data.get('color'));
            }, this);

            this.opt = { 
                title: 'Iglesias por cada Región', 
                pieHole: 0.4,
                backgroundColor: 'white',
                colors: this.colors,
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
                },
                pieStartAngle: 180,
                slices: {},
            };

            this.chart = new google.visualization.PieChart(this.el);
            this.chart.draw(this.dt, this.opt);
        },

        selectRegion: function(nombre) {             
            var rowIndex = this.indexRegion[nombre];
            this.opt.slices[rowIndex] = {offset: 0.1};
            this.chart.clearChart();
            this.chart.draw(this.dt, this.opt);

            this.chart.setSelection([{row:rowIndex}]);
        },

        deselectRegion: function() {
            this.opt.slices = {};
            this.chart.clearChart();  // este metodo elimina todo, la seleccion tambien
            this.chart.draw(this.dt, this.opt);
        },
        



    }); 
   
    return ChartView; 
});