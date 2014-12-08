updateBadge(1);
var IS_NORML = false;

chrome.alarms.create('updateIcon', {periodInMinutes: 1});

chrome.alarms.onAlarm.addListener(function(al){
	if(al.name == 'updateIcon'){
		updateBadge(0);
	}
});

function updateBadge(start){
	var req = new XMLHttpRequest;
    req.open('GET', 'https://mining-profit.com/api/bitcoinprice', true);
    req.onload  = function(){
      	var jsonResponse = JSON.parse(req.responseText);
      	var curr_price_BTC =  parseFloat(jsonResponse.last_price_BTCUSD);
      	
      	chrome.storage.local.get(function(items){
      		var previous_price_BTC = (items['price'])?items['price']:curr_price_BTC;
      		if(curr_price_BTC != previous_price_BTC || start == 1){
      			if(!IS_NORML && start == 0){
      				chrome.alarms.clear('updateIcon', function(wasClear){
      					if(wasClear){
      						chrome.alarms.create('updateIcon', {periodInMinutes: 15});
      						IS_NORML = true;
      					}
      				});
      			}
      			var today_open = jsonResponse.today_open;
      			var course_BTC;
		  		if(curr_price_BTC >= today_open){
		  			course_BTC = 1;
		  		}
		  		else{
		  			course_BTC = 0;
		  		}
				var icon = new Image();
				var up_down_rate = new Image();
				icon.src = "img/mp-icon.png";
				icon.onload = function(){
					if(course_BTC) {
						up_down_rate.src = "img/up.png";
					}
					else {
						up_down_rate.src = "img/down.png";
					}

					up_down_rate.onload = function(){

						var isRetina = window.devicePixelRatio > 1;
						var imageData = createIcon(curr_price_BTC, icon, up_down_rate, 1);

						if(!isRetina){
							chrome.browserAction.setIcon({
								imageData: imageData
							});
						}
						else {
							var icon2X = new Image();
							icon2X.src = "img/mp-icon@2x.png";
							icon2X.onload = function() {
								var up_down_rate2X = new Image();
								if(course_BTC) {
									up_down_rate2X.src = "img/up@2x.png";
								}
								else {
									up_down_rate2X.src = "img/down@2x.png";
								}
								up_down_rate2X.onload = function() {
									var imageData2X = createIcon(curr_price_BTC, icon2X, up_down_rate2X, 2);
									chrome.browserAction.setIcon({
										imageData: {
											"19": imageData,
											"38": imageData2X
										}
									});
								};
							};
						}

						chrome.storage.local.set({'price': curr_price_BTC});

					};

				};
			}
      	});
    };
    req.send(null);
}

function createIcon(curr_price_BTC, icon, up_down_rate, scale) {
	var canvas = document.createElement('canvas');
	var c = canvas.getContext('2d');
	c.beginPath();
	c.fillStyle = '#fff';
	c.moveTo(3*scale, 1*scale);
	c.lineTo(17*scale, 1*scale); c.lineTo(19*scale, 3*scale); c.lineTo(19*scale, 17*scale); c.lineTo(17*scale, 19*scale);
	c.lineTo(3*scale, 19*scale); c.lineTo(1*scale, 17*scale); c.lineTo(1*scale, 3*scale); c.lineTo(3*scale, 1*scale);
	c.fill();
	c.drawImage(icon, 3*scale, 2*scale);
	c.drawImage(up_down_rate, 11*scale, 4*scale);
	c.beginPath();
	c.fillStyle = '#000';
	c.font = scale>1? 'bold 18px sans-serif': 'bold 9px sans-serif';
	c.textBaseline = 'top';
	var draw_price = ''+Math.round(curr_price_BTC);
	var lng_draw_price = c.measureText(draw_price).width;
	var left_margin = Math.floor((19*scale - lng_draw_price)/2);
	c.fillText (draw_price, left_margin + 2, 9*scale);
	c.fill();
	var imageData = c.getImageData(0, 0, 19*scale, 19*scale);
	return imageData;
}