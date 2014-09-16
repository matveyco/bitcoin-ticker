var bitcoinPrice = {
  setPrice: function(){
    var req = new XMLHttpRequest;
    req.open('GET', 'http://mining-profit.com/api/bitcoinprice', true);
    req.onload  = function(){
      var jsonResponse = JSON.parse(req.responseText);
      document.getElementById('btc_price_USD').innerText = jsonResponse.last_price_BTCUSD;
    };
    req.send(null);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  bitcoinPrice.setPrice();
});