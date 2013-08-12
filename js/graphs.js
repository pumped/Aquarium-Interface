$(document).ready(function() {
	setupGraph();
	updateGraph();
});
var historyChart;
var phLine = [];
var tempLine = [];
var phSet = [];
var tempSet = [];
var colors = ['#294EA3', '#536EAD', '#DE6A6A', '#C21919'];

function updateGraph() {
	$.getJSON('data/every_10.json', function(data) {
		//console.log(data);
		generateData(data);
		setTimeout(updateGraph, 10000)
	});
	//generateData(data);
}

function generateData(data) {
	//console.log(data);

	console.log("Generating Data")

	//foreach element
	i = 0;
	for(point in data) {
		d = data[point]
		ts = d.ts;
		phLine[i] = [parseFloat(ts), parseFloat(d.PH.ph)];
		tempLine[i] = [parseFloat(ts), parseFloat(d.Temperature.temp)];
		phSet[i] = [parseFloat(ts), parseFloat(d.PH.set_point)];
		tempSet[i] = [parseFloat(ts), parseFloat(d.Temperature.set_point)];
		i++;
	}

	console.log("Data points: " + i)

	setGraphData(historyChart, 0, phLine);
	setGraphData(historyChart, 3, phSet);
	setGraphData(historyChart, 1, tempSet);
	setGraphData(historyChart, 2, tempLine, true);

	console.log("Finished updating graph")
}

function setupGraph() {
	console.log('setting up graph');
	
	Highcharts.setOptions({                                            // This is for all plots, change Date axis to local timezone
                global : {
                    useUTC : false
                }
            });


	historyChart = new Highcharts.StockChart({
		chart : {
			renderTo : 'historyGraph'
		},
		plotOptions : {
			line : {
				animation : false
			}
		},

		rangeSelector : {
			selected : 1,
			buttons : [{
				type : 'minute',
				count : 720,
				text : '12h'
			}, {
				type : 'day',
				count : 1,
				text : '1d'
			}, {
				type : 'week',
				count : 1,
				text : '1w'
			}, {
				type : 'month',
				count : 1,
				text : '1m'
			},{
				type : 'ytd',
				text : 'YTD'
			}, {
				type : 'year',
				count : 1,
				text : '1y'
			}, {
				type : 'all',
				text : 'All'
			}]
		},

		title : {
			text : 'History'
		},

		xAxis : {
			type : 'datetime',
			dateTimeLabelFormats : {// don't display the dummy year
				month : '%e. %b',
				year : '%b'
			}
		},

		yAxis : [{
			title : {
				text : 'Temperature (C)',
				style : {
					color : colors[3]
				}
			},
			labels : {
				style : {
					color : colors[3]
				}
			}
		}, {
			title : {
				text : 'pH',
				style : {
					color : colors[0]
				}
			},
			opposite : true,
			labels : {
				style : {
					color : colors[0]
				}
			}
		}],

		series : [{
			name : 'pH',
			yAxis : 1,
			data : [1, 1, 1],
			color : colors[0],
			tooltip : {
				valueDecimals : 3
			}
		}, {
			name : 'Temperature Setpoint',
			color : colors[2],
			dashStyle : 'ShortDash',
			data : [1, 1, 1],
			tooltip : {
				valueDecimals : 1
			}
		}, {
			name : 'Temperature',
			color : colors[3],
			data : [1, 1, 1],
			tooltip : {
				valueDecimals : 1
			}
		}, {
			name : 'pH Setpoint',
			dashStyle : 'ShortDash',
			yAxis : 1,
			color : colors[1],
			data : [1, 1, 1],
			tooltip : {
				valueDecimals : 3
			}
		}]
	});
}

function setGraphData(graph, id, data, redraw) {
	if(redraw == undefined) {
		redraw = false;
	}
	graph.series[id].setData(data, redraw);
	console.log("Series " + id + " data set");
}

/*,{
 name : 'Temperature Setpoint',
 data : datas,
 tooltip: {
 valueDecimals: 2
 }
 },{
 name : 'pH Setpoint',
 data : datap,
 yAxis: 1,
 tooltip: {
 valueDecimals: 2
 }
 }
 */