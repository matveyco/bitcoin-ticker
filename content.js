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
			}
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

	var iframe_conv = document.createElement('iframe');
    iframe_conv.src = chrome.runtime.getURL('frame_convertor.html')
    iframe_conv.style.cssText = 'display:block;width:100%;height:44px;margin:0;padding:0;';
    iframe_conv.setAttribute('scrolling', 'no');
    iframe_conv.setAttribute('frameborder', 'no');

    var button_close = document.createElement('div');
    button_close.setAttribute('id', 'mp_container_ext_close_cross');

    up_ext.appendChild(iframe_conv);
    up_ext.appendChild(button_close);

	mp_container.appendChild(up_ext);

	
	var down_ext = document.createElement('div');
	down_ext.setAttribute('class', 'down-ext');

	var mp_chart_box = document.createElement('div');
	mp_chart_box.setAttribute('class', 'mp-chart');

	var mp_label_bitstamp = document.createElement('div');
	mp_label_bitstamp.setAttribute('class', 'mp-bitstamp-label');
	mp_label_bitstamp.innerHTML = 'Bitstamp.net';

	var iframe_chrt = document.createElement('iframe');
    iframe_chrt.src = chrome.runtime.getURL('frame_chart.html')
    iframe_chrt.style.cssText = 'display:block;width:100%;height:220px;margin:0 0 0 5px;padding:0;';
    iframe_chrt.setAttribute('scrolling', 'no');
    iframe_chrt.setAttribute('frameborder', 'no');

    mp_chart_box.appendChild(mp_label_bitstamp);
    mp_chart_box.appendChild(iframe_chrt);

    var mp_info_box = document.createElement('div');
    mp_info_box.setAttribute('class', 'mp-info');
    mp_info_box.innerHTML = ''+
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
			'<a href ="https://mining-profit.com/" class="powered-link">Mining-Profit.com</a>'+
		'</div>';

	down_ext.appendChild(mp_chart_box);
	down_ext.appendChild(mp_info_box);

	mp_container.appendChild(down_ext);

	document.body.appendChild(mp_container);

	var cont_in_DOM = document.getElementById('mp_container_extension');
	document.getElementById('mp_container_ext_close_cross').onclick = function(){
		document.body.removeChild(cont_in_DOM);
		clearInterval(update_data);
	}
}