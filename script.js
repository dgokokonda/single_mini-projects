var input = document.getElementById('input'),
  carousel = document.getElementById('carousel'),
  hint = document.querySelector('div'),
  position = 0,
  left = document.querySelector('.fa-chevron-left'),
  right = document.querySelector('.fa-chevron-right'),
  container = document.getElementById('container'),
  width = 202, //items' width
  count = 3, //кол-во перематываемых items
  offsetSum = 0;

function checkValue() {
  if (input.value && event.keyCode === 13) {
    for (var i = 0; i < input.value.length; i++) {
      if (input.value.charCodeAt(i) < 48 || input.value.charCodeAt(i) > 57) {
        hint.style.visibility = 'visible';
        left.style.visibility = 'hidden';
        right.style.visibility = 'hidden';
        return;
      }
    }
    hint.style.visibility = 'hidden';
    left.style.visibility = 'visible';
    right.style.visibility = 'visible';
    removeItems();
    carousel.style.marginLeft = '0px';
    position = 0;
    pushItems();
  } else if (!input.value && event.keyCode === 13) {
    hint.style.visibility = 'visible';
    left.style.visibility = 'hidden';
    right.style.visibility = 'hidden';
  }
}

function pushItems() {
  var items = [];
  var amount = +input.value;
  for (var j = 1; j <= amount; j++) {
    items.push(j);
  }
  items.forEach(function(e) {
    var item = document.createElement('div');
    item.innerHTML = e;
    item.className = 'item';
    carousel.appendChild(item);
  });
  checkLength();
}

function removeItems() {
  while (carousel.lastChild) {
    carousel.removeChild(carousel.lastChild);
  }
}
function checkLength() {
  var elem = document.querySelectorAll('.item');

  if (container.offsetLeft + container.offsetWidth > elem[elem.length - 1].offsetLeft + elem[elem.length - 1].offsetWidth - offsetSum) {
    left.onclick = 'return false';
    right.onclick = 'return false';
    left.style.opacity = '.5';
    right.style.opacity = '.5';
    offsetSum = 0;
  } else {
    left.style.opacity = '.5';
    right.style.opacity = '1';
    offsetSum = 0;
    right.onclick = function rewindLeft() {
      if (container.offsetLeft + container.offsetWidth > elem[elem.length - 1].offsetLeft + elem[elem.length - 1].offsetWidth) {
        if (elem[0].offsetLeft >= 0) {
          position = 0;
        }
      } else if (container.offsetLeft + container.offsetWidth < elem[elem.length - 1].offsetLeft + elem[elem.length - 1].offsetWidth) {
        position = Math.max(position - width * count, -width * (elem.length - count));
      }
      carousel.style.marginLeft = position + 'px';

      if (position === -width * (elem.length - count)) {
        left.style.opacity = '1';
        right.style.opacity = '.5';
        offsetSum = position;
      } else if (position === -width * (elem.length - count - 1)) {
        left.style.opacity = '1';
        right.style.opacity = '.5';
        offsetSum = position;
      } else {
        right.style.opacity = '1';
        left.style.opacity = '1';
      }
    };

    left.onclick = function rewindRight() {
      position = Math.min(position + width * count, 0);
      carousel.style.marginLeft = position + 'px';
      offsetSum = 0;

      if (position >= 0) {
        left.style.opacity = '.5';
        right.style.opacity = '1';
      } else {
        left.style.opacity = '1';
        right.style.opacity = '1';
      }
    };
  }
}

var svgNS = 'http://www.w3.org/2000/svg',
  colors = ['#66ccff', '#110000', '#c16100', '#be6700', '#be6700', '#cdcaa2', '#0d004c', '#ffffff', '#b1a89e'],
  screenWidth = window.innerWidth;

function createCircles() {
  var store = [];
  for (var c = 1; c <= 280; c++) {
    store.push(c);
  }
  store.forEach(function(e) {
    var radius = getRandom(6, 32);
    var x = getRandom(50, screenWidth + 500);
    var y = getRandom(50, 360);
    var bubble = document.createElementNS(svgNS, 'circle');
    bubble.setAttributeNS(null, 'class', 'circle');
    bubble.setAttributeNS(null, 'r', radius);
    bubble.setAttributeNS(null, 'cx', x);
    bubble.setAttributeNS(null, 'cy', y);
    document.getElementById('bubbles-footer').appendChild(bubble);
  });
}

function getRandom(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}
createCircles();
var circle = document.querySelectorAll('circle');

function circleHover(circle) {
  circle.setAttribute('style', 'fill:' + colors[Math.floor(Math.random() * colors.length)]);
}
function changeColor() {
  for (var i = 0; i < circle.length; i++) {
    circle[i].addEventListener('mouseover', function() {
      circleHover(this);
    });
  }
}

changeColor();
