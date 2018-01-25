var input = document.getElementById('input');
var carousel = document.getElementById('carousel');
var hint = document.querySelector('div');
var position = 0;
var left = document.querySelector('.fa-chevron-left');
var right = document.querySelector('.fa-chevron-right');
var container = document.getElementById('container');
var width = 202; //items' width
var count = 3; //кол-во перематываемых items

right.onclick = function rewindLeft() {
  var item = document.querySelectorAll('.item');
  //console.log(document.querySelectorAll('.item').length);
  if (container.offsetLeft + container.offsetWidth > item[item.length - 1].offsetLeft + item[item.length - 1].offsetWidth) {
    if (item[0].offsetLeft === 0) {
      position = 0;
      //left.style.opacity = '.5';
      //right.style.opacity = '.5';
    }
  } else {
    position = Math.max(position - width * count, -width * (item.length - count));
  }
  //console.log(position);
  carousel.style.marginLeft = position + 'px';
};
left.onclick = function rewindRight() {
  position = Math.min(position + width * count, 0);
  //console.log(position);
  carousel.style.marginLeft = position + 'px';
};

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
  //console.log(items);
}

function removeItems() {
  while (carousel.lastChild) {
    carousel.removeChild(carousel.lastChild);
  }
}
