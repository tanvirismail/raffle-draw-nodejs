let interval = 100;
let rollStopInterval = 15000;
let speed = 500;
let numArr = [5,9,9,9];
let resultArr = [5,9,9,9];
let _height = 0; 
let domArr = []; 
(function($) {
  $.fn.rollNumber = function(options) {
    let $self = this;
    if (options.number === undefined) return;
    let number = options.number,
        speed = options.speed || 500,
        interval = options.interval || 100,
        fontStyle = options.fontStyle,
        rooms = options.rooms || String(options.number).split('').length,
        _fillZero = !!options.rooms;
    fontStyle.color = fontStyle.color || '#000'; 
    fontStyle['font-size'] = fontStyle['font-size'] || 14;

    $self.css({
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'font-size': fontStyle['font-size'],
      color: 'rgba(0,0,0,0)'
    }).text(number);
    _height = $self.height(); // custom
    // let space = options.space || _height/2;
    let space = '80';
    $self.empty(options);

    let numberHtml = '';
    for (let i = 0; i < 10; i++) numberHtml += `<span style="display: block; width: ${ space }px; height: ${ _height }px; line-height: ${ _height }px; text-align: center; ${ Object.keys(fontStyle).join(': inherit; ') + ': inherit;' }">${ i }</span>`;
    numberHtml = `<div class="_number" style="width: ${ space }px; height: ${ _height }px; line-height: ${ _height }px; display: flex; justify-content: center; align-items: center;"><div style="position: relative; width: ${ space }px; height: ${ _height }px; overflow: hidden;"><div style="position: absolute; width: 100%;">${ numberHtml }</div></div></div>`
    
    let numArr = String(number).split('');
    if (_fillZero) { 
      if (String(number).indexOf('.') !== -1) rooms++;
      for (let i = numArr.length; i < rooms; i++) {
        numArr.unshift(0);
      }
      number = numArr.join('');
    }
    if (!!options.symbol) { 
      let appendHtml = [];
      let symbolHtml = `<span style="display: block; width: ${ space }px; height: ${ _height }px; line-height: ${ _height }px; text-align: center; ${ Object.keys(fontStyle).join(': inherit; ') + ': inherit;' }">${ options.symbol }</span>`;
      let dotHtml = `<span style="display: block; width: ${ space }px; height: ${ _height }px; line-height: ${ _height }px; text-align: center; ${ Object.keys(fontStyle).join(': inherit; ') + ': inherit;' }">.</span>`;
      symbolHtml = `<div class="_number" style="width: ${ space }px; height: ${ _height }px; line-height: ${ _height }px; display: flex; justify-content: center; align-items: center;"><div style="position: relative; width: ${ space }px; height: ${ _height }px; overflow: hidden;"><div style="position: absolute; width: 100%;">${ symbolHtml }</div></div></div>`;
      dotHtml = `<div class="_number" style="width: ${ space }px; height: ${ _height }px; line-height: ${ _height }px; display: flex; justify-content: center; align-items: center;"><div style="position: relative; width: ${ space }px; height: ${ _height }px; overflow: hidden;"><div style="position: absolute; width: 100%;">${ dotHtml }</div></div></div>`;
      
      let numarr = String(number).split('.');
      const re = /(-?\d+)(\d{3})/;
      while (re.test(numarr[0])) {
        numarr[0] = numarr[0].replace(re, '$1,$2');
      }
      numArr = (numarr.length > 1 ? numarr[0] + '.' + numarr[1] : numarr[0]).split('');
      for (let i = 0; i < numArr.length; i++) {
        if (isNaN(Number(numArr[i]))) { 
          if (numArr[i] === '.') { 
            appendHtml.push(dotHtml);
          } else {
            appendHtml.push(symbolHtml);
          }
        } else {
          appendHtml.push(numberHtml);
        }
      }
      $self.append(appendHtml.join('')).css(fontStyle);
    }else {
      $self.append(numberHtml.repeat(rooms)).css(fontStyle);
      if (String(number).indexOf('.') !== -1) {
        $($self.find('._number')[String(number).indexOf('.')]).find('span')[0].innerHTML = '.';
      }
    }
    domArr = $self.find('._number');

    // for (let i = 0; i < domArr.length; i++) {
    //     setTimeout(function(dom, n) {
    //       $(dom.children[0].children[0]).animate({
    //         'top': -_height * n + 'px' // 千分位*number = NaN px
    //       }, speed);
    //     }, interval*(domArr.length - i), domArr[i], numArr[i]);
    // }
  }
})(jQuery);

$('#start').click(function () {
  if(status != "complete"){
    rollRequest()
  }
})
$('body').keydown(function (e) {
  if ((e.which === 10 || e.which === 13 || e.which === 32) && status != "complete") {
    rollRequest()
  }
});
$('#reset').click(function () {
  rollRset()
})

function rollRequest(){
  axios.post('http://localhost:3000/store')
  .then(function (response) {
    var data = response.data
    if(data.status == "success"){
      rollStart(data,data.lock)
    }
    else if(data.status == "complete"){
      status = data.status
      $('#start').addClass('disable');
      rollRset()
    }
  })
  .catch(function (error) {
    console.log(error);
  })
}

function rollStart(data,lock=0){
  let result = ("000" + data.result).slice(-4);
  resultArr = String(result).split('');
  $('#start').addClass('disable');
  for (let i = 0; i < domArr.length; i++) {
    let up = setInterval(function(){
      setTimeout(function(dom, n) {
        $(dom.children[0].children[0]).animate({
            'top': -_height * n + 'px' 
        }, speed);
      }, interval*(domArr.length - i), domArr[i], numArr[i])
    }, 1000)
    let down = setInterval(function(){
      setTimeout(function(dom, n) {
        $(dom.children[0].children[0]).animate({
            'top': -_height / n + 'px'
        }, speed);
      }, interval*(domArr.length - i), domArr[i], numArr[i]);
    }, 1000)
    setTimeout(function(dom, n) {
      clearInterval(down);
      clearInterval(up);
      setTimeout(function(dom, n) {
        $(dom.children[0].children[0]).animate({
            'top': -_height * n + 'px' 
        }, speed);
      }, interval*(domArr.length - i), domArr[i], resultArr[i]);
      setTimeout(function() {
        if(lock != 1){
          $('#start').removeClass('disable');
        }
      }, rollStopInterval);
    }, rollStopInterval );
  }
}

function rollRset(){
  for (let i = 0; i < domArr.length; i++) {
    setTimeout(function(dom) {
      $(dom.children[0].children[0]).animate({
        'top': '0px' 
      }, speed);
    }, interval*(domArr.length - i), domArr[i]);
  }
}