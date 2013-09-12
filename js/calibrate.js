values = [3.2,6.4,''];
nextLock = 0;
stage = 1;
var stages = ['Low','Neutral','High'];
 

$(document).ready(function(){
	console.log('calibration ready');
	$('#calibrateButton').click(function(){
		$('#calibrateWindow').modal('show')
		nextLock = 0;
		stage = 1;	
		$('#solutionValue').html(stage);
		$('#phCalibrateValue').val(values[stage-1]);
		$('#calibrateWindow .loadImage').hide();
		$('#calibrateWindow .instructions').show();
		$('#calibrateWindow .finish').hide();
		$('#calibrateWindow .alert').hide();
		$('#calibrateWindow .mdal-next').show();
	});
	
	$('#calibrateWindow .mdal-next').click(function(){
		
		//obtain lock or return
		if (nextLock) { return; }
		nextLock = 1;
		
		//error check the ph value
		if (($('#phCalibrateValue').val() == '' && stage < 3) || isNaN(Number($('#phCalibrateValue').val()))) {
			$('#calibrateWindow .alert').show();
			console.log('error')
			nextLock = 0;
			return;
		} else { $('#calibrateWindow .alert').hide(); }
		
		//set the calibration based on stage
		if (stage == 1) {
			setPhCalibration();
		} else if (stage == 2) {
			setPhCalibration();
		} else if (stage == 3) {
			setPhCalibration();
		}
		
		stage++;
		$('#solutionValue').html(stage);
		$('#phCalibrateValue').val(values[stage-1]);
	});
});

function setPhCalibration() {
	$('#calibrateWindow .loadImage').show();
	$('#calibrateWindow .instructions').hide();
	value = $('#phCalibrateValue').val();
	
	//finish calibration if not using 3rd point
	if (value == '' && stage == 3) {
		finishCalibration();
		return;
	}
	
	//set data
	$.ajax({
		type : "POST",
		url : "/aquarium/ph/calibration/" + stages[stage-1],
		data : value,
		contentType : "application/json; charset=utf-8",
		dataType : "text",
		success : function(data) {
			nextLock = 0;
			console.log('loaded');
			requestInput();
			
			console.log(stage)
			if (stage == 4) {
				finishCalibration();
			}
		},
		failure : function(errMsg) {
			alert('error calibrating');
		}
	});
	setTimeout(function(data) {
		
	});
}

function finishCalibration() {
	console.log('finish up');
	$('#calibrateWindow .loadImage').hide();
	$('#calibrateWindow .instructions').hide();
	$('#calibrateWindow .finish').show();
	$('#calibrateWindow .mdal-next').hide();
}

function requestInput() {
	$('#calibrateWindow .loadImage').hide();
	$('#calibrateWindow .instructions').show();
}




