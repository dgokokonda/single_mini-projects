'use strict'

var navMenu = document.querySelector('.nav');
var header = document.querySelector('.main-head');
var logo = document.querySelector('.extra-info--logo');
var defaultTop = header.offsetTop + header.scrollHeight;

document.addEventListener('scroll', function () {
    if (navMenu.offsetTop > defaultTop) {
        logo.style.visibility = 'visible';
    } else logo.style.visibility = 'hidden';
});