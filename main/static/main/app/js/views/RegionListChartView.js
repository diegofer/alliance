define([
	'jquery',
	'lodash',
	'backbone',
	'tastypie',
	'goog!visualization,1,packages:[corechart]',
], 
function($, _, Backbone, tastypie) {
   
    var ChartView = Backbone.View.extend({

        tagName: 'div',
        id: 'content-chart',

        dt          : null,
        opt         : {},
        colors      : [],
        indexRegion : {},



        initialize: function() {  
        	console.log('Inicializando vista ChartView'); 
            this.dt = new google.visualization.DataTable();
        },

        render: function() { 
            this.dibujarChart();
            return this.el;
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
                    //height:"80%"
                },
                pieSliceText: 'value',
                tooltip: {
                    showColorCode: true,
                    trigger: 'focus',
                },
                pieStartAngle: 180,
                slices: {},
            };

            //var content = this.$el.find('#content-chart')[0];
            this.chart = new google.visualization.PieChart(this.el);
            this.chart.draw(this.dt, this.opt);
        },

        selectRegion: function(nombre) {             
            var rowIndex = this.indexRegion[nombre];
            this.opt.slices[rowIndex] = {offset: 0.1};
            this.chart.draw(this.dt, this.opt);

            this.chart.setSelection([{row:rowIndex}]);
        },

        deselectRegion: function() {
            this.opt.slices = {};
            this.chart.draw(this.dt, this.opt);
        },


        onClose: function() {
            this.chart.clearChart();
            this.chart = null;
        },
        
        



    }); 
   
    return ChartView; 
});