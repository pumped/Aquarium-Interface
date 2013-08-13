$(document).ready(function() {
	$('#schedAddButton').click(addNew);
		
	//setup time selector
	$('input[name="time"]').ptTimeSelect();
	
	//setup submit buttons
	$('#manualSetPH').click(function() {
		ph = $('#phManual').val();
		
		console.log("Set pH Target: " + ph);

		post('ph','Point', ph);
		
	});
	$('#manualSetTemp').click(function() {
	
		temp = $('#tempManual').val();
		
		console.log("Set Temp Target: " + temp);
		
		post('temp','Point', temp);
		
	});
	
	$('#scheduleTable').on('click', '.schedDelete', function(){
		console.log($(this));
		$(this).parent().parent().remove();
	})
});

function post(sensor, type, value) {
	$.ajax({
		type : "POST",
		url : "/aquarium/"+sensor+"/set/" + type,
		// The key needs to match your method's input parameter (case-sensitive).
		data : value,
		contentType : "application/json; charset=utf-8",
		dataType : "text",
		success : function(data) {
			alert(data);
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
