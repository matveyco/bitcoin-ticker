var reqToMP = new XMLHttpRequest;
reqToMP.open('GET', 'http://mining-profit.com/api/bitcoinprice', true);
reqToMP.onload  = buildExtencion.bind(this);
reqToMP.send(null);


function buildExtencion(e){
	var dataBTC = JSON.parse(e.target.responseText);
	var curr_price =  parseFloat(dataBTC.last_price_BTCUSD);
	var today_open = dataBTC.today_open;
	var today_high = dataBTC.high;
	var today_low = dataBTC.low;
	var today_change = (((curr_price - today_open)/today_open)*100).toFixed(2);

	var mp_container = document.createElement("div");
	mp_container.setAttribute('id', 'mp_container_extension');

	var up_ext = document.createElement("div");
	up_ext.setAttribute('class', 'up-ext');

	up_ext.innerHTML = ''+
		'<iframe id="convertor" scrolling="no" frameborder="no" '+
			'src="http://mining-profit.com/btc-cnv-extension" name="conv_frame" width="100%" height="44px">'+
		'</iframe>'+
		'<div id="close_cross"></div>';
	mp_container.appendChild(up_ext);

	var down_ext = document.createElement('div');
	down_ext.setAttribute('class', 'down-ext');

	down_ext.innerHTML = ''+
		'<div class="mp-chart"></div>'+
		'<div class="mp-info">'+
			'<div class="mp-wrp-bigprice">'+
				'<div class="big-price">'+
					'<span class="course-icon">$</span>'+
					'<span class="course-value">'+curr_price.toFixed(2)+'</span>'+
				'</div>'+
				'<div class="big-price-change big-change-up">'+
					'<div class="pch-arrow"></div>'+
					'<div class="pch-value">'+today_change+'%</div>'+
				'</div>'+
			'</div>'+
			'<div class="mp-wrp-price-details">'+
				'<div class="price-detail-row bott-bord">'+
					'<div class="price-detail-col-left">Today`s OPEN</div>'+
					'<div class="price-detail-col-right">$'+today_open+'</div>'+
				'</div>'+
				'<div class="price-detail-row bott-bord">'+
					'<div class="price-detail-col-left">Today`s HIGH</div>'+
					'<div class="price-detail-col-right">$'+today_high+'</div>'+
				'</div>'+
				'<div class="price-detail-row">'+
					'<div class="price-detail-col-left">Today`s LOW</div>'+
					'<div class="price-detail-col-right">$'+today_low+'</div>'+
				'</div>'+
			'</div>'+
			'<div class="mp-powered">'+
				'Powered by '+
				'<a href ="http://mining-profit.com/" class="powered-link">Mining-Profit.com</a>'+
			'</div>'+
		'</div>';

	mp_container.appendChild(down_ext);

	document.body.appendChild(mp_container);

	var cont_in_DOM = document.getElementById('mp_container_extension');
	document.getElementById('close_cross').onclick = function(){
		document.body.removeChild(cont_in_DOM);
	}
}