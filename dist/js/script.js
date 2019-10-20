'use strict'

var form = document.getElementById('regForm');
var mainPopup = document.getElementById('mainPopup');
var overlay = document.querySelector('.overlay');
var close = document.querySelectorAll('.popup__close');
var cityList = document.getElementById('cityList');
var city = document.getElementById('reg-city');
var isValid = false;
var sendingFlag = 0;
var formFlags = {};

function showPopup(el) {
    el.style.display = 'block';
    overlay.style.display = 'block';
    document.body.className = 'no-scroll';
}

function closePopup() {
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.body.className = '';
}

function initFormFlags(el) {
    formFlags[el.name] = false;
}

function cleanField(el) {
    var field = el.previousElementSibling.previousElementSibling;
    var tooltip = el.nextElementSibling;

    el.style.display = '';
    field.value = '';
    field.classList.remove('inp-error');
    tooltip.style.display = '';
    validateForm(field);
}

function toggleVisibleList() {
    if (cityList.classList.contains('js-visible')) {
        cityList.classList.remove('js-visible');
    } else {
        cityList.classList.add('js-visible');
    }
}

function showCleanMarker(el) {

    if (el.type !== 'checkbox') {
        var marker = el.nextElementSibling.nextElementSibling;
        if (el.value) {
            marker.style.display = 'block';
        } else {
            marker.style.display = '';
        }
    }
}

function createNewEvent(eventName, elem) {
    var event;
    if (typeof(Event) === 'function') {
        event = new Event(eventName);
    } else {
        // ie 11
        elem.disabled = false;
        event = document.createEvent('CustomEvent');
        event.initEvent(eventName, true, true);
    }
    return event;
}

function selectCity(el) {
    var choosenCity = el.innerText;
    city.value = choosenCity;
    toggleVisibleList();
    city.dispatchEvent(createNewEvent('change', city));
}

function setValidFlag(el) {
    var isValidField = !!formFlags[el.name];
    toggleFormClasses(el, isValidField);

    var count = 0;
    for (var key in formFlags) {
        if (formFlags.hasOwnProperty(key)) {
            if (formFlags[key] == false) {
                isValid = false;
                count--;
                break;
            } else {
                count++;
            }
        }
    }

    if (count === Object.keys(formFlags).length) {
        isValid = true;
    }

    return isValid;
}

function validateForm(el) {
    // паттерн email допускает ввод символов кириллицы
    var emailPattern = /(^.+@.+)(\.).{1,}.+/i;
    var urlPattern = /(.*(ftp|https|http|www\.).*)/i;
    var wrongName = /[^a-zа-яА-Я-\s]{1,}/gi;
    var val = el.value;
    showCleanMarker(el);

    switch (el.name) {
        case 'reg-name':
            if (val.length &&
                !val.match(urlPattern) &&
                !wrongName.test(val)) {
                formFlags[el.name] = true;
            } else {
                formFlags[el.name] = false;
            }
            break;

        case 'reg-email':
            if (emailPattern.test(val)) {
                formFlags[el.name] = true;
            } else {
                formFlags[el.name] = false;
            }
            break;

        case 'reg-city':
            if (val) {
                formFlags[el.name] = true;
            } else {
                formFlags[el.name] = false;
            }
            break;

        case 'agree':
            if (el.checked) {
                formFlags[el.name] = true;
            } else {
                formFlags[el.name] = false;
            }
            break;

        default:
            break;
    }

    return setValidFlag(el);
}

function toggleFormClasses(el, valid) {
    if (el.type !== 'checkbox') {
        var tooltip = el.parentElement.querySelector('.error-tooltip');

        if (!valid) {
            el.classList.add('inp-error');
        } else {
            el.classList.remove('inp-error');
        }

        if (tooltip) {
            if (!valid) {
                tooltip.style.display = 'block';
            } else {
                tooltip.style.display = '';
            }
        }
    }
}

var listElems = document.querySelectorAll('.js-list li');
for (var el = 0; el < listElems.length; el++) {
    listElems[el].addEventListener('click', function() {
        showPopup(mainPopup);
    });
}

var formElems = document.querySelectorAll('#regForm input:not([type=submit])');
for (var el = 0; el < formElems.length; el++) {
    var elem = formElems[el];
    var eventType = 'input';

    if (elem.type == 'checkbox') {
        eventType = 'change';
    }
    elem.addEventListener(eventType, function(e) {
        validateForm(e.target);
    });
    initFormFlags(elem);
}

city.addEventListener('change', function(e) {
    e.target.disabled = true;
    validateForm(e.target);
});

document.body.addEventListener('click', function(e) {
    switch (e.target.className) {
        case 'popup__close':
        case 'overlay':
        case 'link js-close':
        case 'btn js-close':
            closePopup();
            break;

        case 'field-marker':
            cleanField(e.target);
            break;

        case 'js-city':
            selectCity(e.target);
            break;

        default:
            break;
    }
});

document.querySelector('.js-dropdown').addEventListener('click', function() {
    toggleVisibleList();
});

form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (isValid) {
        // ajax
        // reset fields
    } else {
        for (var i = 0; i < formElems.length; i++) {
            setValidFlag(formElems[i]);
        }
        alert('Необходимо заполнить все поля формы и подтвердить свое согласие с условиями');
    }
});