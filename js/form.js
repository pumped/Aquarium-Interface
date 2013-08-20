$(document).ready(function() {
	$('#schedAddButton').click(addNew);
		
	//setup time selector
	$('input[name="time"]').ptTimeSelect();
	
	//setup submit buttons
	
	//manual pH
	$('#manualSetPH').click(function() {
		console.log("click");
		ph = $('#phManual').val();		
		console.log("Set pH Target: " + ph);
		post('ph','Point', ph);		
	});
	
	//manual Temp
	$('#manualSetTemp').click(function() {	
		temp = $('#tempManual').val();		
		console.log("Set Temp Target: " + temp);		
		post('temp','Point', temp);		
	});
	
	//turning parameters
	$('#turningPoints').click(function(){
		kp = $('#Kp').val();
		ki = $('#Ki').val();
		kd = $('#Kd').val();
		 
		post('ph','Kp',kp);
		post('ph','Ki',ki);
		post('ph','Kd',kd);
		
		console.log(ki + " " + kp + " " + kd);
	});
	
	
	//Schedule
	//Schedule delete buttons
	$('#scheduleTable').on('click', '.schedDelete', function(){
		console.log($(this));
		$(this).parent().parent().remove();
	});
	
	
	//get defaults
	$.get('cgi/test.txt',function(d){
		console.log(d);
		
		cats = d.split('\r\n')
		settings = {};
		
		//emails
		for (i in cats) {
			cats[i] = cats[i].split(':')[1];
		}
		settings['emails'] = cats[0].split(',');
		
		//schedules
		temp = {};
		schedules = cats[1].split(',')
		for (i in schedules) {
			temp[i] = schedules[i].split('|')[1];
		}	
		settings['schedules'] = temp;
		
		//schedule
		settings['schedule'] = cats[2].split(',')[0]	
		setDefaults(settings);	
		console.log(settings);
	});
	
	$('#setSched').click(function(){
		val = '';
		$.get('cgi-bin/params.py?type=setSched&name='+val,function(){
			
		});
	});
});

function setDefaults(settings) {
	s = settings['schedules'];
	for (i in s) {
		console.log(s[i] + ':' + settings['schedule']);
		if (s[i] == settings['schedule']) {
			selected = 'selected';
			console.log('selected');
		} else {
			selected = '';
		}
		$('#scheduleSelect').append('<option '+selected+' val="'+s[i]+'">'+s[i]+'</option>');
	}	
}

function post(sensor, type, value) {
	$.ajax({
		type : "POST",
		url : "/aquarium/"+sensor+"/set/" + type,
		// The key needs to match your method's input parameter (case-sensitive).
		data : value,
		contentType : "application/json; charset=utf-8",
		dataType : "text",
		success : function(data) {
			console.log(data);
		},
		failure : function(errMsg) {
			alert(errMsg);
		}
	});

}

function getIndex(val) {
	var i = 0;
	var current = timeToNumber(val);
	$('#scheduleTable').find('tbody').children('tr').each(function(){
		var time = timeToNumber($(this).find('.time').html());
		console.log(time + " " + current);
		if (time > current) {
			console.log("returning: " + i);
			return i;
		}
		i++;
	});
	return i;
}

function timeToNumber(val) {
	if (val == undefined)
		return 0;
	val = val.replace(":",'');
	var i = val.split(" ");
	var t = i[0];
	if (i[1] == "PM" && i[0] < 1200){
		t = parseInt(i[0]) + 1200; 
	}
	if (i[1] == "AM" && i[0] >= 1200) {
		t = t - 1200
		console.log(t);
	}
	
	return parseInt(t);
}

function addNew() {
	/*point = $(this).parent().children('.inputs');
	$(this).parent().parent().children('.schedule').append("<li>" + point.html() + "</li>")
	*/
	
	var temp = $('#schTemp').val();
	var ph = $('#schPH').val();
	var time = $('#schTime').val();
	//times = timeToNumber(time);
	
	console.log('Test');
	console.log(temp + " " + ph + " " + time);
	var index = getIndex(time)-1;
	console.log("Index:" + index);
	
	$('#scheduleTable').find('tbody tr').eq(index)
		.after($('<tr>')
	        .append($('<td>')
	            .html(time)
	            .attr('class','time')
	        )
	        .append($('<td>')
	            .html(temp + "&deg;c")
	        )
	        .append($('<td>')
	            .html(ph)
	        )
	        .append($('<td>')
	            .html('<a class="glyphicon glyphicon-remove schedDelete"></a>')
	        )
	        
	    );
}
