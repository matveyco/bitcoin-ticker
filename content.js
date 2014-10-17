var direction_course = '';

var reqToMP = new XMLHttpRequest;
reqToMP.open('GET', 'https://mining-profit.com/api/bitcoinprice', true);
reqToMP.onload  = buildExtencion.bind(this);
reqToMP.send(null);

var update_data = setInterval(function(){
	updateReq();
}, 60*1000);

function updateReq(){
	var reqToMP = new XMLHttpRequest;
	reqToMP.open('GET', 'https://mining-profit.com/api/bitcoinprice', true);
	reqToMP.onload  = updateExtField.bind(this);
	reqToMP.send(null);
}

function updateExtField(e){
	var dataBTC = JSON.parse(e.target.responseText);
	var curr_price =  parseFloat(dataBTC.last_price_BTCUSD);
	if(document.getElementById('mp_container_extension')){
		var prev_price = parseFloat(document.getElementById('mp_container_extension').getElementsByClassName('course-value').item(0).innerHTML);
		if(curr_price != prev_price){
			var today_open = parseFloat(dataBTC.today_open);
			var today_change = (((curr_price - today_open)/today_open)*100).toFixed(2);
			var arrow_direction = (curr_price >= today_open)?'up':'down';
			document.getElementById('mp_container_extension').getElementsByClassName('course-value').item(0).innerHTML = curr_price.toFixed(2);
			document.getElementById('mp_container_extension').getElementsByClassName('pch-value').item(0).innerHTML = today_change+'%';
			var col_right = document.getElementById('mp_container_extension').getElementsByClassName('price-detail-col-right');
			col_right.item(0).innerHTML = '$'+dataBTC.today_open;
			col_right.item(1).innerHTML = '$'+dataBTC.high;
			col_right.item(2).innerHTML = '$'+dataBTC.low;
			if(arrow_direction != direction_course){
				var arrow_box = document.getElementById('mp_container_extension').getElementsByClassName('big-change-'+direction_course).item(0);
				arrow_box.className = 'big-price-change big-change-'+arrow_direction;
				direction_course = arrow_direction;
				console.log('change direction');
			}
			console.log('success!!: direction: '+direction_course);
		}
	}
}

function buildExtencion(e){
	var dataBTC = JSON.parse(e.target.responseText);
	var curr_price =  parseFloat(dataBTC.last_price_BTCUSD);
	var today_open = parseFloat(dataBTC.today_open);
	var today_high = dataBTC.high;
	var today_low = dataBTC.low;
	var today_change = (((curr_price - today_open)/today_open)*100).toFixed(2);
	var arrow_direction = (curr_price >= today_open)?'up':'down';
	direction_course = arrow_direction;

	var mp_container = document.createElement("div");
	mp_container.setAttribute('id', 'mp_container_extension');

	var up_ext = document.createElement("div");
	up_ext.setAttribute('class', 'up-ext');

	up_ext.innerHTML = ''+
		'<iframe id="mp_build_convertor" scrolling="no" frameborder="no" '+
			'src="https://mining-profit.com/btc-cnv-extension" name="conv_frame" width="100%" height="44px">'+
		'</iframe>'+
		'<div id="mp_container_ext_close_cross"></div>';
	mp_container.appendChild(up_ext);

	var down_ext = document.createElement('div');
	down_ext.setAttribute('class', 'down-ext');

	down_ext.innerHTML = ''+
		'<div class="mp-chart">'+
			'<div class="mp-bitstamp-label">'+
				'Bitstamp.net'+
			'</div>'+
			'<iframe id="mp_build_chart" scrolling="no" frameborder="no" style="margin-left: 5px;"'+
				'src="https://mining-profit.com/btc-chrt-extension" name="chart_frame" width="100%" height="220px">'+
			'</iframe>'+
		'</div>'+
		'<div class="mp-info">'+
			'<div class="mp-wrp-bigprice">'+
				'<div class="big-price">'+
					'<span class="course-icon">$</span>'+
					'<span class="course-value">'+curr_price.toFixed(2)+'</span>'+
				'</div>'+
				'<div class="big-price-change big-change-'+arrow_direction+'">'+
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
				'<a href ="https//mining-profit.com/" class="powered-link">Mining-Profit.com</a>'+
			'</div>'+
		'</div>';

	mp_container.appendChild(down_ext);

	document.body.appendChild(mp_container);

	var cont_in_DOM = document.getElementById('mp_container_extension');
	document.getElementById('mp_container_ext_close_cross').onclick = function(){
		document.body.removeChild(cont_in_DOM);
		clearInterval(update_data);
	}
}