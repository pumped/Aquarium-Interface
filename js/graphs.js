$(document).ready(function() {
	setupGraph();
	updateGraph();
});


var historyChart;
var colors = ['#294EA3', '#536EAD', '#DE6A6A', '#C21919'];
var d = [];

function updateGraph() {
	$.getJSON('data/every_10.json', function(data) {
		//console.log(data);
		d = generateData(data);
		
		setGraphData(historyChart, 0, d[0]);
		setGraphData(historyChart, 3, d[1]);
		setGraphData(historyChart, 1, d[2]);
		setGraphData(historyChart, 2, d[3], true);

		console.log("Finished updating graph")
		setTimeout(loadLiveData,1000);
	});
	//generateData(data);
}

function loadLiveData() {
	$.getJSON('data/current.json', function(newData){
		console.log('live data')
		console.log(newData);
		var d = generateData(newData);
		
		historyChart.series[0].addPoint(d[0][0],false);
		historyChart.series[3].addPoint(d[1][0],false);
		historyChart.series[1].addPoint(d[2][0],false);
		historyChart.series[2].addPoint(d[3][0],true);
		
		setTimeout(loadLiveData, 10000);
	});
}

function generateData(data) {
	//console.log(data);
	console.log("Generating Data")

	var phLine = [];
	var tempLine = [];
	var phSet = [];
	var tempSet = [];

	//foreach element
	var i = 0;
	for(point in data) {
		d = data[point]
		ts = d.ts;
		phLine[i] = [parseInt(ts), parseFloat(d.PH.ph)];
		tempLine[i] = [parseInt(ts), parseFloat(d.Temperature.temp)];
		phSet[i] = [parseInt(ts), parseFloat(d.PH.set_point)];
		tempSet[i] = [parseInt(ts), parseFloat(d.Temperature.set_point)];
		i++;
	}

	console.log("Data points: " + i)
	
	return [phLine, phSet, tempSet, tempLine];
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