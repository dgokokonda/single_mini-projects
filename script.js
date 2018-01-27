var input = document.getElementById('input');
var carousel = document.getElementById('carousel');
var hint = document.querySelector('div');
var position = 0;
var left = document.querySelector('.fa-chevron-left');
var right = document.querySelector('.fa-chevron-right');
var container = document.getElementById('container');
var width = 202; //items' width
var count = 3; //кол-во перематываемых items
var offsetSum = 0;


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
    items.forEach(function (e) {
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
                console.log(position)
                left.style.opacity = '1';
                right.style.opacity = '.5';
                offsetSum = position;
            }
            else if (position === -width * (elem.length - count - 1)) {
                console.log(position)
                left.style.opacity = '1';
                right.style.opacity = '.5';
                offsetSum = position;
            } else {
                console.log(position)
                right.style.opacity = '1';
                left.style.opacity = '1';
            }
        };

        left.onclick = function rewindRight() {
            position = Math.min(position + width * count, 0);
            carousel.style.marginLeft = position + 'px';
            offsetSum = 0;

            if (position >= 0) {
                left.style.opacity = '.5'
                right.style.opacity = '1';
            } else {
                left.style.opacity = '1';
                right.style.opacity = '1';
            }
        };
    }
}
