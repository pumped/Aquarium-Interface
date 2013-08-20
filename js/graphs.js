$(document).ready(function() {
	setupGraph();
	//updateGraph();
	setTimeout(loadLiveData,10000);
	loadCsv();
});


var historyChart;
var colors = ['#294EA3', '#536EAD', '#DE6A6A', '#C21919'];
var d = [];
var extremities = [];
var latestPoint = [];

function setExtreme(val,v) {
	val = parseInt(val);
	if (val < extremities[0]) {
		extremities[0] = [val,v];
	} else if (val > extremities[1]) {
		extremities[1] = [val,v];
	}
	
	return extremities;
}

function updateGraph() {
	$.getJSON('data/every_10.json', function(data) {
		//console.log(data);
		d = generateData(data);
		
		setGraphData(historyChart, 0, d[0]);
		setGraphData(historyChart, 3, d[1]);
		setGraphData(historyChart, 1, d[2]);
		setGraphData(historyChart, 2, d[3], true);

		console.log("Finished updating graph")
		
	});
	//generateData(data);
}

function loadLiveData() {
	$.getJSON('data/current.json', function(newData){
		console.log('live data')
		console.log(newData);
		var d = generateData(newData);
		latestPoint = d;
		
		if (updateLock){
			setTimeout(loadLiveData, 1000);
			console.log('updating live locked');
			return;
		}
		updateLock++;		
		historyChart.series[0].addPoint(d[0][0],false);
		historyChart.series[3].addPoint(d[1][0],false);
		historyChart.series[1].addPoint(d[2][0],false);
		historyChart.series[2].addPoint(d[3][0],true);		
		updateLock--;
		
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
		phLine[i] = [parseInt(ts), parseFloat(d.PH_ph)];
		tempLine[i] = [parseInt(ts), parseFloat(d.Temperature_temp)];
		phSet[i] = [parseInt(ts), parseFloat(d.PH_set_point)];
		tempSet[i] = [parseInt(ts), parseFloat(d.Temperature_set_point)];
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
			renderTo : 'historyGraph',
			zoomType: 'x'
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
			},
			ordinal: false,
			events : {
				afterSetExtremes : loadCsv
			},
			minRange: 3600 // one minute
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
			},
			visible: false
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
	//console.log("Series " + id + " data set");
}

updateLock = 0;

function loadCsv(e) {
	if (updateLock) {
		return;
	}
	
	console.log('loading');
	if (e == undefined) {
		url = 'cgi-bin/data.py?start=1&end=1200000';
	} else {
		currentExtremes = this.getExtremes(),
		range = e.max - e.min;
		url = 'cgi-bin/data.py?start=' +  Math.round(e.min/1000) + '&end='+ Math.round(e.max/1000);
	}
	
	historyChart.showLoading('Loading data from server...');
	categories = [];
	csvData = {};
	
	$.get(url, function(data) {
		
		tsID = 0;
		
		console.log("loading csv")
		// Split the lines
		var lines = data.split('\n');
		$.each(lines, function(lineNo, line) {
			var items = line.split(',');
			
			// header line containes categories
			if (lineNo == 0) {
				$.each(items, function(itemNo, item) {
					categories.push(item);
					csvData[categories[itemNo]] = [];
					name = item.replace("\n",'');
					tsID = itemNo; //hack
				});
			} /*else if (lineNo == 1) {
				//set minimum extreme
				ts = items[tsID];
				setExtreme(parseInt(ts),parseFloat(line));
				if (ts > extremities[0][0]) {
					csvData[categories[itemNo]].push(extremities[0]);
				}
			}*/ else {
				$.each(items, function(itemNo, item) {
					csvData[categories[itemNo]].push([parseInt(items[tsID]),parseFloat(item)]);
				});
			}
			
			
		});
		updateLock++;
		setGraphData(historyChart, 0, csvData['PH_ph']);
		setGraphData(historyChart, 3, csvData['PH_set_point']);
		setGraphData(historyChart, 2, csvData['Temperature_temp']);
		setGraphData(historyChart, 1, csvData['Temperature_set_point'], true);
		historyChart.hideLoading();
		console.log('loading hidden');
		updateLock--;
	});
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