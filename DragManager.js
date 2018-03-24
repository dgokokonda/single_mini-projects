'use strict'
var DragManager = {}; // object for drag-events
var dragObject = {}; // object for DOM-elements
var origin;
var header;
var target;

function onMouseDown(e) {
    if (e.which != 1) return;
    else {
        target = e.target;
        if (e.target.className === 'list-name') {
            header = e.target;
            origin = e.target.closest('.list-wrapper');
            createClone(e, document.body, 1, 61, 0);
        } else if (e.target.className === 'list-card') {
            origin = e.target;
            createClone(e, document.querySelector('.main-content'), origin.closest('.list-wrapper').offsetLeft, origin.closest('.list-cards').offsetTop + 23.5, -10.05);
        } else return;
    }
    return false;
}

function createClone(e, location, left, top, width) {
    var elem = origin.cloneNode(true);
    location.appendChild(elem);
    origin.style.opacity = '.3';
    elem.classList.add('clone');
    elem.style.left = left + origin.offsetLeft - board.scrollLeft + 5 + 'px';
    elem.style.top = top + origin.offsetTop + 'px';
    elem.style.width = origin.clientWidth + width + 'px';
    dragObject.elem = elem;
    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;
}

function onMouseMove(e) {

    if (!dragObject.elem) return;  // элемент не зажат
    if (!dragObject.avatar) { // если перенос не начат...
        var moveX = e.pageX - dragObject.downX;
        var moveY = e.pageY - dragObject.downY;
        if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) return;
        dragObject.avatar = createAvatar();
        if (!dragObject.avatar) {// отмена переноса, нельзя "захватить" эту часть элемента
            dragObject = {};
            return;
        }

        var coords = getLocation(dragObject.avatar);
        dragObject.shiftX = dragObject.downX - coords.left;
        dragObject.shiftY = dragObject.downY - coords.top;
        startDrag();
    }

    dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

    return false;
}

function dragElem(e, dragObject, origin) {
    var thisElem = document.elementFromPoint(e.pageX, e.pageY);// current list
    var currentElem = thisElem.closest('.list-wrapper'); // current list-wrapper

    if (currentElem && origin.className === 'list-card') {
        var originListId = origin.closest('.list-wrapper').id; // id of origin list
        var draggablePos = storage[originListId].tasks[origin.id].position;
        var droppablePos = 1;
        console.log(currentElem.id, originListId)
        if (thisElem.className === 'list-card') {
            droppablePos = storage[currentElem.id].tasks[thisElem.id].position;
            if (draggablePos < droppablePos) {
                thisElem = thisElem.nextElementSibling;
            } else if (draggablePos === droppablePos && currentElem.id === originListId) {
                dragObject.avatar.rollback();
                return;
            }
            moveDraggableElem(thisElem, currentElem.id, originListId, droppablePos, 'card')
            //} else if (draggablePos > droppablePos) {
            //if (draggablePos === droppablePos && currentElem === originListId) return;
            //moveDraggableElem(thisElem, currentElem.id, originListId, droppablePos, 'card');
            //} else 
            return;
        } else if (currentElem.id !== originListId) {
            moveDraggableElem(thisElem, currentElem.id, originListId, droppablePos, 'card');
            return;
        }
    } else if (!currentElem) {
        dragObject.avatar.rollback();
    } else {
        var draggablePos = storage[origin.id].position;
        var droppablePos = storage[currentElem.id].position;
        if (draggablePos > droppablePos) {
            moveDraggableElem(currentElem, currentElem.id, null, droppablePos, 'list');
        } else if (draggablePos < droppablePos) {
            moveDraggableElem(currentElem.nextElementSibling, currentElem.id, null, droppablePos, 'list');
        } else dragObject.avatar.rollback();
    }
}

function onMouseUp(e) {
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
        DragManager.onDragEnd(e, dragObject, origin);
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

function createAvatar() {
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

function startDrag() {
    var avatar = dragObject.avatar;
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
}

function findDroppable(e) {
    if (target == null) {
        return null;
    }
    if (target.className === 'list-card') {
        return target;
    }
    return target.closest('.list-wrapper');
}

document.addEventListener('mousemove', function (e) {
    if (e.which === 1) {
        onMouseMove(e);
    } else return;
});
document.addEventListener('mouseup', function (e) {
    if (Math.abs(e.pageX - dragObject.downX) === 0 && Math.abs(e.pageY - dragObject.downY) === 0) {
        dragObject.elem.remove();
        origin.removeAttribute('style', '');
        if (target.className === 'list-card') {
            showCardWindowPopup(origin.parentElement.id.slice(1), origin.id);
        } else if (target.className === 'list-name') {
            header.focus();
            header.selectionStart = header.value.length;
        }
    }
    onMouseUp(e);
});
document.addEventListener('mousedown', function (e) {
    closeWindow(e);
    onMouseDown(e);
});

function getLocation(elem) {
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

}