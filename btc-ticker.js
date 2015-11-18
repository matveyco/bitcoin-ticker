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

(function() {
	var script = document.createElement('script');
	script.async = 1;
	script.type = 'application/javascript';
	script.src = 'https://ad.bitmedia.io/js/adbybm.js/5642098a8adf218d7c894015';
	document.getElementsByTagName('head')[0].appendChild(script);
})();

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-45756917-2', 'auto');
ga('set', 'checkProtocolTask', function(){});
ga('send', 'pageview', '/btc-ticker-back.html'); 