$(document).ready(function() {
	$('.schedAddButton').click(addNew);
	
	//setup schedule
	addNew();
	
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

function addNew() {
	point = $(this).parent().children('.inputs');
	$(this).parent().parent().children('.schedule').append("<li>" + point.html() + "</li>")
}
