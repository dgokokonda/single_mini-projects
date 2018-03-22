'use strict'
var DragManager = {}; // object for drag-events
var dragObject = {}; // object for DOM-elements
var origin;

function onMouseDown(e) {
    if (e.which != 1) return;
    else {
        if (e.target.className === 'list-header'
            || e.target.className === 'list-name') {
            origin = e.target.closest('.list-wrapper');
            origin.style.opacity = '.3';
            var elem = origin.cloneNode(true);
            elem.style.opacity = '1';
            elem.style.margin = '0px';
            elem.style.left = origin.offsetLeft + 5 - board.scrollLeft + 'px';
            elem.style.top = origin.offsetTop + 61 + 'px';
            elem.style.position = 'absolute';
            elem.style.width = origin.clientWidth + 'px';
            document.body.appendChild(elem);
            dragObject.elem = elem;
            dragObject.downX = e.pageX;
            dragObject.downY = e.pageY;
        } else if (e.target.className === 'list-card') {
            origin = e.target;
            origin.style.opacity = '.3';
            var elem = origin.cloneNode(true);
            elem.style.opacity = '1';
            elem.style.margin = '0px';
            elem.style.left = origin.offsetLeft + origin.closest('.list-wrapper').offsetLeft - board.scrollLeft + 5 + 'px';
            elem.style.top = origin.offsetTop + origin.closest('.list-cards').offsetTop + 23.5 + 'px'
            elem.style.position = 'absolute';
            elem.style.width = origin.clientWidth - 10.05 + 'px';
            document.querySelector('.main-content').appendChild(elem);
            dragObject.elem = elem;
            dragObject.downX = e.pageX;
            dragObject.downY = e.pageY
        } else return;
    }
    return false;
}

function onMouseMove(e) {

    if (!dragObject.elem) return;  // элемент не зажат
    if (!dragObject.avatar) { // если перенос не начат...
        var moveX = e.pageX - dragObject.downX;
        var moveY = e.pageY - dragObject.downY;
        if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) return;
        // если мышь передвинулась в нажатом состоянии недостаточно далеко
        dragObject.avatar = createAvatar(e);
        if (!dragObject.avatar) {// отмена переноса, нельзя "захватить" эту часть элемента
            dragObject = {};
            return;
        }

        var coords = getLocation(dragObject.avatar);
        dragObject.shiftX = dragObject.downX - coords.left;
        dragObject.shiftY = dragObject.downY - coords.top;
        startDrag(e);
    }

    dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

    return false;
}

function onMouseUp(e) {
    if (Math.abs(e.pageX - dragObject.downX) === 0 && Math.abs(e.pageY - dragObject.downY) === 0) {
        if (e.target.className === 'list-card') {
            e.target.remove();
            origin.removeAttribute('style', '');
            origin.addEventListener('click', showCardWindowPopup(origin.parentElement.id.slice(1), origin.id));
        }
    }
    if (dragObject.avatar) {
        finishDrag(e);// если перенос идет
    }

    // перенос либо не начинался, либо завершился
    dragObject = {};
}

function finishDrag(e) {
    var dropElem = findDroppable(e);
    if (!dropElem) {
        DragManager.onDragCancel(dragObject);
    } else {
        DragManager.onDragEnd(dragObject, origin);
    }
}

function moveDraggableElem(dropElem, currentListId, originListId, droppablePos, target) {
    dragObject.avatar.remove();

    if (target === 'list') {
        document.querySelector('.board-scroll-area').insertBefore(origin, dropElem);
        moveList(origin.id, droppablePos);
    } else if (target === 'card') {
        moveCard(+currentListId, +origin.id, origin.innerText, +originListId, droppablePos);
    }
    origin.removeAttribute('style', '');
}

function createAvatar(e) {
    var avatar = dragObject.elem;
    var old = {
        parent: avatar.parentNode,
        nextSibling: avatar.nextElementSibling,
        position: avatar.position || '',
        left: avatar.left || '',
        top: avatar.top || '',
        zIndex: avatar.zIndex || ''
    };

    avatar.rollback = function () {
        old.parent.insertBefore(avatar, old.nextSibling);
        avatar.style.position = old.position;
        avatar.style.left = old.left;
        avatar.style.top = old.top;
        avatar.style.zIndex = old.zIndex;
        origin.style.opacity = '1';
        dragObject.avatar.remove();
    };
    return avatar;
}

function startDrag(e) {
    var avatar = dragObject.avatar;
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
}

function findDroppable(event) {
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    if (elem == null) {
        return null;
    }
    if (elem.className === 'list-card') {
        return elem;
    }
    return elem.closest('.list-wrapper');
}

document.addEventListener('mousemove', function (e) {
    if (e.which === 1) {
        onMouseMove(e);
    } else return;
});
document.onmouseup = onMouseUp;
document.onmousedown = onMouseDown;

function getLocation(elem) {
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

}