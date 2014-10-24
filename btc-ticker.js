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
}

document.addEventListener('DOMContentLoaded', function () {
  sendReqData();
});