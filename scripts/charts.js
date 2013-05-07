(function($) {

	$.fn.BarChart = function() {
		$(this).highcharts({
			chart : {
				type : 'bar'
			},
			title : {
				text : 'Continents statistics'
			},
			subtitle : {
				text : 'size (sq km) and population'
			},
			xAxis : {
				categories : ['Africa', 'North America', 'South America', 'Asia', 'Europe', 'Oceania', 'Antarctica'],
				title : {
					text : null
				}
			},
			yAxis : {
				min : 0,
				title : {
					text : null,
					align : 'high'
				},
				labels : {
					overflow : 'justify'
				}
			},
			tooltip : {
				valueSuffix : ' millions'
			},
			plotOptions : {
				bar : {
					dataLabels : {
						enabled : true
					}
				}
			},
			legend : {
				layout : 'vertical',
				align : 'right',
				verticalAlign : 'top',
				floating : true,
				borderWidth : 1,
				backgroundColor : '#FFFFFF',
				shadow : true
			},
			credits : {
				enabled : false
			},
			series : [{
				name : 'Size',
				data : [30.1, 24.3, 17.8, 44.6, 9.9, 8.1, 13.2]
			}, {
				name : 'Population',
				data : [1, 528.7, 387.5, 4.2, 738.2, 36.6, 0]
			}]
		});
	}
	
	
	
	$.fn.PieChart = function() {
        $(this).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Continents size'
            },
			tooltip : {
				valueSuffix : ' %'
			},
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(1) +' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Continents share',
                data: [
                    ['Asia',30.30],
                    ['Africa',20.40],
                    {
                        name: 'North America',
                        y: 16.30,
                        sliced: true,
                        selected: true
                    },
                    ['South America',12],
                    ['Antarctica',8.90],
                    ['Europe',6.70],
                    ['Oceania',5.40]
                ]
            }]
        });
    }
    
})(jQuery);

