var input = document.getElementById('input'),
  carousel = document.getElementById('carousel'),
  hint = document.querySelector('div'),
  left = document.querySelector('.fa-chevron-left'),
  right = document.querySelector('.fa-chevron-right'),
  container = document.getElementById('container'),
  width = 222, //item's width
  count = 3, //кол-во перематываемых items
  position = 0,
  containerWidth,
  elemsWidth,
  scroll = 0;

function checkValue() {
  if (input.value && event.keyCode === 13) {
    for (var i = 0; i < input.value.length; i++) {
      if (input.value.charCodeAt(i) < 49 || input.value.charCodeAt(i) > 57) {
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
    container.onwheel = wheel;

  } else if (!input.value && event.keyCode === 13) {
    hint.style.visibility = 'visible';
    left.style.visibility = 'hidden';
    right.style.visibility = 'hidden';
  }
}

function pushItems() {
  var amount = +input.value;
  for (var j = 0; j < amount; j++) {
    var item = document.createElement('div');
    item.innerHTML = j + 1;
    item.className = 'item';
    carousel.appendChild(item);
  }
  scrollLength();
}

function removeItems() {
  while (carousel.lastChild) {
    carousel.removeChild(carousel.lastChild);
  }
}

function scrollLength(e) {
  var elem = document.querySelectorAll('.item');
  containerWidth = container.offsetLeft + container.offsetWidth;
  elemsWidth = elem[elem.length - 1].offsetLeft + elem[elem.length - 1].offsetWidth;
  if (containerWidth > elemsWidth) {
    left.style.opacity = '.5';
    right.style.opacity = '.5';
    left.onclick = null;
    right.onclick = null;
  } else {
    left.onclick = scrollLength;
    right.onclick = scrollLength;
    left.style.opacity = '.5';
    right.style.opacity = '1';

    if (event.target.id === 'right' || e === 100) {
      if (containerWidth < elemsWidth) {
        position = Math.max(position - width * count, -width * (elem.length - count));
      }
      carousel.style.marginLeft = position + 'px';
      if (position === -width * (elem.length - count) || position === -width * (elem.length - count - 1) || position === -width * (elem.length - count - 2)) {
        left.style.opacity = '1';
        right.style.opacity = '.5';
        right.onclick = null;
      } else {
        right.style.opacity = '1';
        left.style.opacity = '1';
      }
    }

    if (event.target.id === 'left' || e === -100) {
      right.onclick = scrollLength;
      position = Math.min(position + width * count, 0);
      carousel.style.marginLeft = position + 'px';

      if (position >= 0) {
        left.style.opacity = '.5';
        right.style.opacity = '1';
      } else {
        left.style.opacity = '1';
        right.style.opacity = '1';
      }
    }
  }
}

function wheel() {
  if (containerWidth > elemsWidth) return;
  else if (event.deltaY > 100 || event.deltaY < -100) return;
  else if (event.deltaY > 0 && elemsWidth > containerWidth) scroll += 200;
  else if (event.deltaY < 0 && position >= 0) scroll -= 200;
  carousel.style.marginLeft = scroll + 'px';
  scrollLength(event.deltaY);
}

var svgNS = 'http://www.w3.org/2000/svg',
  colors = ['#66ccff', '#110000', '#c16100', '#be6700', '#be6700', '#cdcaa2', '#0d004c', '#ffffff', '#b1a89e'],
  screenWidth = window.innerWidth;

function createCircles() {
  var store = [];
  for (var c = 1; c <= 280; c++) {
    store.push(c);
  }
  store.forEach(function (e) {
    var radius = getRandom(6, 32);
    var x = getRandom(50, screenWidth + 450);
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
    circle[i].addEventListener('mouseover', function () {
      circleHover(this);
    });
  }
}

changeColor();
