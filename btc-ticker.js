chrome.alarms.create('updateInfo', {periodInMinutes: 1});

chrome.alarms.onAlarm.addListener(function(al){
	if(al.name == 'updateInfo'){
		sendReqData();
	}
});

function sendReqData(){
	var req = new XMLHttpRequest;
    req.open('GET', 'https://mining-profit.com/api/bitcoinprice', true);
    req.onload  = this.fillOutInfo.bind();
    req.send(null);
}

function fillOutInfo(e){
	var dataBTC = JSON.parse(e.target.responseText);
	var curr_price =  parseFloat(dataBTC.last_price_BTCUSD);
	var today_open = parseFloat(dataBTC.today_open);
	var today_high = dataBTC.high;
	var today_low = dataBTC.low;
	var today_change = (((curr_price - today_open)/today_open)*100).toFixed(2);
	var arrow_direction = (curr_price >= today_open)?'up':'down';
	document.getElementById('mp_container_extension').getElementsByClassName('course-value').item(0).innerHTML = curr_price.toFixed(2);
	document.getElementById('mp_container_extension').getElementsByClassName('pch-value').item(0).innerHTML = today_change+'%';
	var col_right = document.getElementById('mp_container_extension').getElementsByClassName('price-detail-col-right');
	col_right.item(0).innerHTML = '$'+dataBTC.today_open;
	col_right.item(1).innerHTML = '$'+dataBTC.high;
	col_right.item(2).innerHTML = '$'+dataBTC.low;
	var arrow_box = document.getElementById('mp_container_extension').getElementsByClassName('big-price-change').item(0);
	arrow_box.className = 'big-price-change big-change-'+arrow_direction;
}

document.addEventListener('DOMContentLoaded', function () {
  	sendReqData();
  	document.getElementById('mp_container_ext_close_cross').onclick = function(){
		window.close();
	}
	window.onunload = function(){
		chrome.alarms.clear('updateInfo');
	}
});