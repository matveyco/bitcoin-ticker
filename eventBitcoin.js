updateBadge(1);

chrome.alarms.create('updateIcon', {periodInMinutes: 1});

chrome.alarms.onAlarm.addListener(function(){
	updateBadge(0);
});

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.executeScript(null, {file: "content.js"});

});

function updateBadge(start){
	var req = new XMLHttpRequest;
    req.open('GET', 'http://mining-profit.com/api/bitcoinprice', true);
    req.onload  = function(){
      	var jsonResponse = JSON.parse(req.responseText);
      	var curr_price_BTC =  parseFloat(jsonResponse.last_price_BTCUSD);
      	
      	chrome.storage.local.get(function(items){
      		var previous_price_BTC = (items['price'])?items['price']:curr_price_BTC;
      		if(curr_price_BTC != previous_price_BTC || start == 1){
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
				if(course_BTC){up_down_rate.src = "img/up.png";}
				else{up_down_rate.src = "img/down.png";}
				icon.onload = function(){
					up_down_rate.onload = function(){
				  		var canvas = document.createElement('canvas');
						var c = canvas.getContext('2d');
						c.beginPath();
						c.fillStyle = '#fff';
						c.moveTo(3, 1);
						c.lineTo(17, 1); c.lineTo(19, 3); c.lineTo(19, 17); c.lineTo(17, 19); 
						c.lineTo(3, 19); c.lineTo(1, 17); c.lineTo(1, 3); c.lineTo(3, 1);
						c.fill();
						c.drawImage(icon, 2, 1);
						c.drawImage(up_down_rate, 11, 4);
						c.beginPath();
						c.fillStyle = '#000';
						c.font = 'bold 9px sans-serif';
						c.textBaseline = 'top';
						var draw_price = ''+Math.round(curr_price_BTC);
						var lng_draw_price = c.measureText(draw_price).width;
						var left_margin = Math.floor((19 - lng_draw_price)/2);
						c.fillText (draw_price, left_margin, 10);
						c.fill();
						var imageData = c.getImageData(0, 0, 19, 19);
						chrome.browserAction.setIcon({
							imageData: imageData
						});
						chrome.storage.local.set({'price': curr_price_BTC});
					};
				};
			}
      	});
    };
    req.send(null);
}