'use strict'
var storage = {}; //storage for lists and cards
var actionList = {}; //storage for actions in Show Menu
var dateMsec;
var board = document.querySelector('.board-scroll-area');
var boardName = document.querySelector('.board-header-name');
var popup = document.querySelector('.open-popup-window');
var popupContent = document.querySelector('.popup-content');
var backBtn = document.querySelector('.back-btn');
var currentId;
var currentFormId;
var id = 1; //here's id for lists and cards in storage
var actionId = 0; //here's id for actions in actionList
var listPosition = 1;
var List = function (name, listPosition) {
    this.name = name;
    this.position = listPosition;
    this.tasks = {};
};
var Task = function (name, position) {
    this.name = name;
    this.position = position;
};
var Action = function (data, action, time) {
    this.data = data;
    this.action = action;
    this.time = time;
};

/*---------- Here's work with LocalStorage----------*/
function createList(name) {
    storage[id] = new List(name, listPosition);
    id++;
    localStorage.setItem('id', id);
    listPosition++;
}

function createTask(listId, name, position) {
    storage[listId].tasks[id] = new Task(name, position);
    id++;
    localStorage.setItem('id', id);
}

function createAction(actionId, data, action, time) {
    actionId = +localStorage.getItem('actionId') + 1;
    actionList[actionId] = new Action(data, action, time);
    localStorage.setItem('actionId', actionId);
    displayActivity(actionId, data, action, time);
}

function refreshStorage() {
    localStorage.setItem('storage', JSON.stringify(storage));
    localStorage.setItem('actions', JSON.stringify(actionList));

    for (var a in actionList) {
        var value = timer(actionList[a].time);
        if (+a !== actionId) {
            document.getElementById('act' + a).innerHTML = value;
        } else continue;
    }
}

/*---------- Here's DISPLAY functions ----------*/

/*-- to display a list --*/
function displayList(id) {
    var wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.className = 'list-wrapper';
    var content = `<div class="list-content">
            <div class="list-header">
                <textarea id="e${id}" class="list-name">${storage[id].name}</textarea>
                <a href="#" class="list-menu-btn">
                    <span id="btn${id}" class="menu-btn">...</span>
                </a>
            </div>
            <div class="list-cards" id="a${id}">
                <div class="add-card-form" id="i${id}">
                    <div class="add-card">
                        <textarea class="card-name" onkeydown="saveCardName(event)" autofocus></textarea>
                    </div>
                    <div class="add-card-btns">
                        <input type="submit" id="id${id}" class="save" onclick="saveCardName(event)" value="Save">
                        <a href="#" id="close${id}" class="close"></a>
                    </div>
                </div>
            </div>
            <a href="#" id="form${id}" class="new-card">Add a card...</a>
        </div>`;
    board.insertBefore(wrapper, document.getElementById('add-list-wrapper'));
    wrapper.innerHTML = content;

    document.getElementById('close' + id).addEventListener('click', function () {
        closeForm(currentFormId);
    });

    document.getElementById('form' + id).addEventListener('click', function (e) {
        if (!currentFormId || document.getElementById(currentFormId).style.display !== 'block') {
            showAddCardForm(e);
        } else {
            closeForm(currentFormId);
            showAddCardForm(e);
        }
    });

    document.getElementById('btn' + id).addEventListener('click', function () {
        getCoords.call(this, 0, 13);
        showActionsListPopup(id);
    });

    document.getElementById('e' + id).addEventListener('input', function () {
        if (this.value !== '') {
            this.style.height = this.scrollHeight - 4 + 'px';
            this.innerHTML = storage[id].name = this.value;
            refreshStorage();
        }
    });

    document.getElementById('e' + id).addEventListener('keydown', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            this.blur();
        }
    });
}

function closeForm(currentFormId) {
    document.getElementById(currentFormId).style.display = '';
    document.getElementById(currentFormId).parentElement.nextElementSibling.style.display = 'block';
}

/*-- to display a task --*/
function displayTask(listId, taskId) {
    var listCards = document.getElementById(listId + '').children[0].children[1];
    var listCard = document.createElement('a');
    listCard.className = 'list-card';
    listCard.id = taskId;
    listCard.innerHTML = storage[listId].tasks[taskId].name;
    listCards.insertBefore(listCard, document.getElementById('i' + listId));
    document.getElementById('i' + listId).scrollIntoView(true);

    document.getElementById(taskId + '').addEventListener('click', function () {
        listId = this.parentElement.id.slice(1);
        showCardWindowPopup(listId, taskId);
    });
}

/*-- Here is display of POPUP --*/

function showRenameBoardPopup() {
    if (backBtn) backBtn.style.display = '';
    document.querySelector('.popup-title').innerHTML = 'Rename Board';
    var content = `<div style="display: flex; flex-flow: column wrap; padding: 2px 12px 7px; align-items: flex-start">
    <label>Name</label>
    <input type="text" class="rename-board" value="${localStorage.getItem('board-name')}">
    <input type="submit" class="save" value="Rename" onclick="renameBoard()">
</div>`;
    popupContent.innerHTML = content;
    document.querySelector('.rename-board').addEventListener('keydown', function (e) {
        if (e.which === 13) renameBoard();
    });
}

function showAddCardForm(e) {
    if (e.target.className === 'new-card') {
        e.target.style.display = 'none';
        e.target.previousElementSibling.lastElementChild.style.display = 'block';
        currentFormId = e.target.previousElementSibling.lastElementChild.id;
    }
}

function closeCardForm() {
    document.getElementById(currentFormId).style.display = '';
    document.getElementById(currentFormId).parentElement.nextElementSibling.style.display = 'block';
}

function isOnlyOnePopup() {
    if (popupContent.children.length !== 0) {
        popup.style.display = '';
        popupContent.children[0].remove();
    } else return;
}

//to show a hidden menu(...) in the List
function showActionsListPopup(listId) {
    if (backBtn) backBtn.style.display = '';
    document.querySelector('.popup-title').innerHTML = 'List Actions';
    var content = `<ul class="list-actions">
        <li class="list-action move-list">Move List...</li>
        <li class="list-action copy-list">Copy List...</li>
        <li class="list-action delete-list">Delete This List</li>
    </ul>`;
    popupContent.innerHTML = content;
    document.querySelector('.move-list').addEventListener('click', function () {
        showMoveListForm(listId);
    })
    document.querySelector('.copy-list').addEventListener('click', function () {
        showCopyListForm(listId);
    });
    document.querySelector('.delete-list').addEventListener('click', function () {
        deleteList(listId);
    });
}

function backMenu(listId) {
    backBtn.style.display = '';
    showActionsListPopup(listId);
}

//to show a Copy List Form
function showCopyListForm(listId) {
    var content = `<div style="display: flex; flex-flow: column wrap; padding: 2px 12px 7px; align-items: flex-start;">
        <label>Name</label>
        <div style="display: grid; width: 100%">
            <textarea class="card-name copy-list-name" autofocus>${storage[listId].name}</textarea>
            <input type="submit" class="save copy-btn" onclick="copyList(${listId}, this.previousElementSibling.value)" value="Create List">
        </div>
    </div>`;
    document.querySelector('.popup-title').innerHTML = 'Copy List';
    popupContent.innerHTML = content;
    backBtn.style.display = 'block';
    backBtn.addEventListener('click', backMenu.bind(this, listId));

    document.querySelector('.card-name.copy-list-name').addEventListener('keydown', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            copyList(listId, this.value);
        }
    });
}

//to show a Move List Form
function showMoveListForm(listId) {
    document.querySelector('.popup-title').innerHTML = 'Move List';
    backBtn.style.display = 'block';
    backBtn.addEventListener('click', backMenu.bind(this, listId));
    var content = `<div>
        <div class="title board-name">
            <span class="label">Board</span>
            <span class="value">${localStorage.getItem('board-name')}</span>
        </div>
        <div class="title">
            <span class="label">Position</span>
            <span class="value">${storage[listId].position + ''}</span>
            <select class="position"></select>
        </div>
        <input type="submit" class="save move-btn" onclick="moveList(${listId}, this.previousElementSibling.children[1].innerHTML)" value="Move">
    </div>`;
    popupContent.innerHTML = content;

    for (var i in storage) {
        var option = document.createElement('option');
        if (storage[i].position !== storage[listId].position) {
            option.innerHTML = storage[i].position;
        } else {
            option.innerHTML = storage[listId].position + ' (current)';
            option.setAttribute('selected', '');
        }
        option.value = storage[i].position;
        document.querySelector('select').appendChild(option);
    }

    document.querySelector('select').addEventListener('change', function () {
        document.querySelectorAll('.value')[1].innerHTML = this[this.selectedIndex].value;
    });
}

/*---------- Here's display functions of CARD WINDOW (a click to the Card) ----------*/
function showCardWindowPopup(listId, taskId) {
    document.querySelector('.window-overlay').style.display = 'flex';
    document.querySelector('.window-task-name').innerHTML = storage[listId].tasks[taskId].name;
    document.querySelector('.window-task-name').id = 'i' + taskId;
    document.querySelector('.window-list-name').innerHTML = storage[listId].name;
    document.querySelector('.window-list-name').id = '0' + listId;
    document.querySelector('.action.delete').id = 'pos' + storage[listId].tasks[taskId].position;
}

/*---------- to show a move/copy card form ----------*/
function showCardForm(listId, taskId, taskName, prevListId, e) {
    currentId = +document.querySelector('.window-task-name').id.slice(1);
    var div = document.createElement('div');
    var content = `<div class="title board-name">
            <span class="label">Board</span>
            <span class="value">${localStorage.getItem('board-name')}</span>
        </div>
        <div class="select">
            <div class="title select-list">
                <span class="label">List</span>
                <span class="value">${storage[listId].name}</span>
                <select class="list"></select>
            </div>
            <div class="title select-position">
                <span class="label">Position</span>
                <span class="value">${storage[listId].tasks[currentId].position}</span>
            </div>
        </div>
        <input type="submit" class="save move-btn" value="Move">`;
    document.querySelector('.popup-title').innerHTML = 'Move Card';
    popupContent.appendChild(div);
    div.innerHTML = content;

    if (e.target.className === 'action copy') {
        document.querySelector('.popup-title').innerHTML = 'Copy Card';
        document.querySelector('.save.move-btn').value = 'Copy';
        div.style.paddingTop = '7px';
        var textContent = `<label class="lbl">Title</label>
        <textarea class="card-title">${storage[listId].tasks[currentId].name}</textarea>
        <label class="lbl">Copy to...</label>`;
        div.innerHTML = textContent + content;

        document.querySelector('.save.move-btn').addEventListener('click', function () {
            copyCard(listId, taskName);
            isOnlyOnePopup();
        });
    } else if (e.target.className === 'action move' || e.target.className === 'window-list-name') {
        document.querySelector('.save.move-btn').addEventListener('click', function () {
            moveCard(listId, currentId, taskName, prevListId, document.querySelectorAll('.value')[2].innerHTML);
            document.querySelector('.window-list-name').innerHTML = storage[listId].name;
            document.querySelector('.window-list-name').id = '0' + listId;
            isOnlyOnePopup();
        });
    }

    var list = document.querySelector('.list');

    for (var i in storage) {
        var option = document.createElement('option');
        option.id = '+' + i;

        if (storage[i].name !== storage[listId].name) {
            option.innerHTML = storage[i].name;
        } else {
            option.innerHTML = storage[listId].name + ' (current)';
            option.setAttribute('selected', '');
        }

        option.value = storage[i].name;
        list.appendChild(option);
    }
    refreshListPositions(listId, e);

    list.addEventListener('change', function (e) {
        document.querySelector('.position').remove();
        var index = list.selectedIndex;
        document.querySelectorAll('span.value')[1].innerHTML = list[index].value;
        listId = +list[index].id.slice(1);
        var tasksLength = Object.keys(storage[listId].tasks).length - 1;
        taskId = +Object.keys(storage[listId].tasks)[tasksLength];

        if (tasksLength === -1) {
            document.querySelectorAll('span.value')[2].innerHTML = 1 + '';
        } else {
            document.querySelectorAll('span.value')[2].innerHTML = storage[listId].tasks[taskId].position;
        }
        refreshListPositions(listId, e);
    });
}

/*-- to refresh selected positions in card forms --*/
function refreshListPositions(listId, e) {
    var prevListId = +document.querySelector('.window-list-name').id;
    var position = document.createElement('select');
    position.className = 'position';
    document.querySelector('.title.select-position').appendChild(position);

    if (Object.keys(storage[listId].tasks).length === 0) {
        var option = document.createElement('option');
        option.innerHTML = '1';
        position.appendChild(option);
    } else {
        for (var pos in storage[listId].tasks) {
            var option = document.createElement('option');
            option.value = storage[listId].tasks[pos].position;

            if (storage[listId].tasks[pos] === storage[listId].tasks[currentId]) {
                option.innerHTML = storage[listId].tasks[pos].position + ' (current)';
                option.setAttribute('selected', '');
            } else if (storage[listId].tasks[pos].position) {
                option.innerHTML = storage[listId].tasks[pos].position;
            }
            position.appendChild(option);
        }

        if (listId != prevListId || e.target.className === 'action copy') {
            var option = document.createElement('option');
            option.value = Object.keys(storage[listId].tasks).length + 1;
            option.innerHTML = Object.keys(storage[listId].tasks).length + 1;
            option.setAttribute('selected', '');
            position.appendChild(option);
            document.querySelectorAll('span.value')[2].innerHTML = Object.keys(storage[listId].tasks).length + 1;
        }
    }

    position.addEventListener('change', function (e) {
        var index = position.selectedIndex;
        document.querySelectorAll('span.value')[2].innerHTML = position[index].value;
    });
}

/*---------- Here's display of ACTIONS in the Show Menu ----------*/
function displayActivity(actionId, data, action, time) {
    var output;
    var dateInterval = timer(time);
    var parent = document.querySelector('.menu-action-list');
    var div = document.createElement('div');
    div.className = 'action-event';
    var actionDisplay = `<div class="event-user-icon">U</div>
                        <div class="event-desc"></div>
                        <div class="event-time-data">
                            <a href="#" id="act${actionId}" class="date">${dateInterval}</a>
                        </div>`;

    if (action === 'created') {
        output = `<span class="user">User </span>
        <span>created this board</span>`;
    }
    else if (action === 'renamed') {
        output = `<span class="user">User </span>
        renamed this board (from ${data[0]})`;
    }
    else if (action === 'added') {
        if (data.length === 1) {
            output = `<span class="user">User </span>
            added
            <a href="#" class="action-element">${data[0]}</a>
            to this board`;
        } else {
            output = `<span class="user">User </span>
            added
        <a href="#" class="action-element">${data[0]}</a>
        to ${data[1]}`;
        }
    }
    else if (action === 'copied') {
        output = `<span class="user">User </span>
        copied
        <a href="#" class="action-element">${data[0]}</a>
        from
        <a href="#" class="action-element"> ${data[1]}</a>
        in list ${data[2]}`;
    }
    else if (action === 'moved') {
        output = `<span class="user">User </span>
        moved
        <a href="#" class="action-element">${data[0]}</a>
        from ${data[1]} to ${data[2]}`;
    }
    else if (action === 'deleted') {
        if (data.length === 1) {
            output = `<span class="user">User </span>
            deleted list
        <a href="#" class="action-element">${data[0]}</a>`;
        } else {
            output = `<span class="user">User </span>
            deleted
            <a href="#" class="action-element">${data[0]}</a>
            from ${data[1]}`;
        }
    }

    if (parent.children.length === 0) {
        parent.appendChild(div);
    }
    parent.insertBefore(div, parent.firstChild);
    div.innerHTML = actionDisplay;
    document.querySelector('.event-desc').innerHTML = output;
}

//refresh time of actions in the Action Menu
function timer(time) {
    var dateInterval;
    var interval = Date.now() - time;
    var msecPerMinute = 1000 * 60;
    var msecPerHour = msecPerMinute * 60;
    var msecPerDay = msecPerHour * 24;
    var days = Math.floor(interval / msecPerDay);
    var hours = Math.floor(interval / msecPerHour);
    var minutes = Math.floor(interval / msecPerMinute);
    var seconds = Math.floor(interval / 1000);
    interval = interval - (days * msecPerDay);
    interval = interval - (hours * msecPerHour);
    interval = interval - (minutes * msecPerMinute);

    if (seconds < 60) {
        if (seconds < 5) dateInterval = "few seconds ago";
        else dateInterval = seconds + " seconds ago";
    }
    if (seconds > 60) dateInterval = minutes + " minutes ago";
    if (minutes === 1) dateInterval = minutes + " minute ago";
    if (minutes > 60) dateInterval = hours + " hours ago";
    if (hours === 1) dateInterval = hours + " hour ago";
    if (hours > 24) dateInterval = days + " days ago";
    if (days === 1) dateInterval = days + " day ago";

    return dateInterval;
}

/*---------- Here's LOGICAL functions ----------*/

function renameBoard() {
    displayAction(actionId, [localStorage.getItem('board-name')], 'renamed');
    boardName.innerHTML = document.querySelector('.rename-board').value;
    localStorage.setItem('board-name', boardName.innerHTML);
    refreshStorage();
    isOnlyOnePopup();
}

/*-- to add a List into the List --*/
function saveListName(e) {
    var listName = document.querySelector('.add-list-input');
    if (e.target.className === 'save' || e.which === 13) {
        if (listName.value.trim() !== '') {
            var lastPosition = 0;

            for (var key in storage) {
                if (storage[key].position > lastPosition) lastPosition = storage[key].position;
                listPosition = lastPosition + 1;
            }

            createList(listName.value);
            displayAction(actionId, [listName.value], 'added');
            refreshStorage();
            displayList(id - 1);
            listName.value = '';
        } else return;
    }
}

/*-- to add a Card into the List --*/
function saveCardName(e) {
    var listId;
    var value;
    if (e.target.className === 'save') {
        value = e.target.parentElement.previousElementSibling.children[0].value;

        if (value.trim() !== '') {
            listId = e.target.id.substring(2);
            displayAction(actionId, [value, storage[listId].name], 'added');
            checkPosition(listId, value);
        } else return;
        e.target.parentElement.previousElementSibling.children[0].value = '';
    } else if (e.which === 13) {
        e.preventDefault();
        value = e.target.value;

        if (value.trim() !== '') {
            listId = e.target.parentElement.nextElementSibling.children[0].id.substring(2);
            displayAction(actionId, [value, storage[listId].name], 'added');
            checkPosition(listId, value);
        } else return;
        e.target.value = '';
    } else return;

    displayTask(listId, id - 1);
}

// Sort lists by position 
function checkPosition(listId, value) {
    var cardPosition;
    if (Object.keys(storage[listId].tasks).length === 0) {
        cardPosition = 1;
    } else {
        var obj = storage[listId].tasks;
        var lastPosition = 1;
        for (var key in obj) {
            if (obj[key].position > lastPosition) {
                lastPosition = obj[key].position;
            }
        }
        cardPosition = lastPosition + 1;
    }
    createTask(listId, value, cardPosition);
    refreshStorage();
}

/*---------- Here's functions of ACTIONS WITH LISTS----------*/
function deleteList(listId) {
    isOnlyOnePopup();
    for (var key in storage) {
        if (storage[key].position > storage[listId].position) {
            storage[key].position -= 1;
        } else continue;
    }

    displayAction(actionId, [storage[listId].name], 'deleted');
    delete storage[listId];
    refreshStorage();
    document.getElementById(listId + '').remove();
}

function moveList(listId, value) {
    for (var key in storage) {
        if (storage[listId].position < +value) {
            if (storage[key].position <= +value && storage[key].position > storage[listId].position) {
                if (storage[key].position > 1) {
                    if (storage[key].position === +value) {
                        board.insertBefore(document.getElementById(listId + ''), document.getElementById(key + '').nextElementSibling);
                    }
                    storage[key].position -= 1;
                } else if (storage[key].position === 1) continue;
            } else if (storage[key].position > +value || storage[key].position < storage[listId].position) continue;
        } else {
            if (storage[key].position < storage[listId].position && storage[key].position >= +value) {
                if (storage[key].position === +value) {
                    board.insertBefore(document.getElementById(listId + ''), document.getElementById(key + ''));
                }
                storage[key].position += 1;
            } else if (storage[key].position > storage[listId].position || storage[key].position < +value) continue;
        }
    }

    storage[listId].position = +value;
    refreshStorage();
    isOnlyOnePopup();
    backBtn.style.display = '';
}

function copyList(listId, value) {
    id = localStorage.getItem('id', id);
    if (value !== '') {
        createList(value);
        storage[id - 1].position = storage[listId].position + 1;

        for (var key in storage) {
            if (storage[key].position >= storage[id - 1].position
                && +key !== id - 1) {
                storage[key].position += 1;
            } else continue;
        }

        displayList(id - 1);
        var cloneId = id - 1;

        for (var i in storage[listId].tasks) {
            createTask(cloneId, storage[listId].tasks[i].name, storage[listId].tasks[i].position);
            sortByPosition(cloneId, id - 1);
            displayAction(actionId, [storage[listId].tasks[i].name, storage[listId].tasks[i].name, storage[listId].name], 'copied');
        }

        refreshStorage();
        board.insertBefore(document.getElementById(cloneId + ''), document.getElementById(listId + '').nextElementSibling);

    } else return;
    isOnlyOnePopup();
}

/*---------- Here's functions of ACTIONS WITH CARDS----------*/
function deleteCard(listId, taskId) {
    var pos = +document.querySelector('.action.delete').id.slice(3);
    for (var key in storage[listId].tasks) {
        if (+key !== +taskId) {
            if (storage[listId].tasks[key].position > pos) {
                storage[listId].tasks[key].position -= 1;
            } else continue;
        } else {
            delete storage[listId].tasks[key];
            document.getElementById(key + '').remove();
        }
    }
    refreshStorage();
}

function moveCard(listId, prevTaskId, taskName, prevListId, selectedPos) {
    var prevTaskPos = storage[prevListId].tasks[prevTaskId].position;
    document.getElementById('a' + listId).insertBefore(document.getElementById(prevTaskId + ''), document.getElementById('i' + listId));

    if (prevListId == listId) {
        for (var key in storage[listId].tasks) {
            if (+key !== prevTaskId) {
                if (prevTaskPos < +selectedPos) {
                    if (storage[listId].tasks[key].position <= +selectedPos
                        && storage[listId].tasks[key].position > prevTaskPos) {
                        storage[listId].tasks[key].position -= 1;
                    } else if (storage[listId].tasks[key].position === +selectedPos + 1) {
                        document.getElementById('a' + listId).insertBefore(document.getElementById(prevTaskId + ''), document.getElementById(key));
                    }
                } else if (prevTaskPos > +selectedPos) {
                    if (storage[listId].tasks[key].position >= +selectedPos
                        && storage[listId].tasks[key].position < prevTaskPos) {
                        storage[listId].tasks[key].position += 1;
                        if (key && storage[listId].tasks[key].position === +selectedPos + 1) {
                            document.getElementById('a' + listId).insertBefore(document.getElementById(prevTaskId + ''), document.getElementById(key));
                        }
                    }
                }
            } else {
                storage[listId].tasks[key].position = +selectedPos;
            }
        }
    } else {
        storage[listId].tasks[prevTaskId] = new Task(taskName, +selectedPos);

        if (Object.keys(storage[listId].tasks).length === 0) {
            document.getElementById('a' + listId).insertBefore(document.getElementById(prevTaskId + ''), document.getElementById('i' + listId));
        } else {
            for (var key in storage[listId].tasks) {
                if (+key !== prevTaskId) {
                    if (storage[listId].tasks[key].position >= +selectedPos) {
                        if (storage[listId].tasks[key].position === +selectedPos) {
                            document.getElementById('a' + listId).insertBefore(document.getElementById(prevTaskId + ''), document.getElementById(key));
                        }
                        storage[listId].tasks[key].position += 1;
                    }
                } else {
                    prevTaskPos = storage[listId].tasks[key].position;
                    storage[listId].tasks[key].position = +selectedPos;
                }
            }
        }

        for (var key in storage[prevListId].tasks) {
            if (storage[prevListId].tasks[key].position > storage[prevListId].tasks[prevTaskId].position) storage[prevListId].tasks[key].position -= 1;
        }

        delete storage[prevListId].tasks[prevTaskId];
    }
    displayAction(actionId, [taskName, storage[prevListId].name, storage[listId].name], 'moved');
    refreshStorage();
}

function copyCard(listId, taskName) {
    id = localStorage.getItem('id');
    var selectedValue = document.querySelectorAll('.value');
    taskName = document.querySelector('.card-title').value;
    createTask(listId, taskName, +selectedValue[2].innerHTML);

    if (Object.keys(storage[listId].tasks).length === 0) {
        displayTask(listId, id - 1);
    } else {
        displayTask(listId, id - 1);

        for (var key in storage[listId].tasks) {
            if (storage[listId].tasks[key].position >= +selectedValue[2].innerHTML
                && +key !== id - 1) {
                if (storage[listId].tasks[key].position === +selectedValue[2].innerHTML) {
                    document.getElementById('a' + listId).insertBefore(document.getElementById(id - 1 + ''), document.getElementById(key));
                }
                storage[listId].tasks[key].position += 1;
            } else continue;
        }
    }
    displayAction(actionId, [taskName, document.querySelector('.window-task-name').innerHTML, storage[listId].name], 'copied');
    refreshStorage();
}

//to sort cards by position
function sortByPosition(i, j) {
    displayTask(i, j);
    var cards = document.getElementById('a' + i).children;

    for (var e = 0; e < cards.length - 1; e++) {
        if (storage[i].tasks[j].position < storage[i].tasks[cards[e].id].position) {
            document.getElementById('a' + i).insertBefore(document.getElementById(j), document.getElementById(cards[e].id));
            break;
        }
    }
}

function displaySortedCards(i) {
    for (var j in storage[i].tasks) {
        if (document.getElementById('a' + i).children.length === 1) {
            displayTask(i, j);
            continue;
        }
        sortByPosition(i, j);
    }
}

//to correct coordinates of popup forms
function getCoords(x, y) {
    var container = document.querySelector('.main-content').offsetWidth;
    var coordX = this.getBoundingClientRect().left;
    var coordY = this.getBoundingClientRect().top;
    popup.style.display = 'block';

    if (coordX + document.querySelector('.open-popup-window').offsetWidth > container) {
        coordX = container - document.querySelector('.open-popup-window').offsetWidth - 15;
    }
    popup.style.left = coordX + x + 'px';
    popup.style.top = coordY + y + 'px';
}

function setHandler(content) {
    var elems = content;
    for (var j = 0; j < elems.length; j++) {
        elems[j].addEventListener('click', checkPopupClick, false);
    }
}

function displayAction(actionId, data, action) {
    dateMsec = Date.now();
    createAction(actionId, data, action, dateMsec);
}

// to close popup by click in the document
function checkPopupClick(e) {
    if (this.className === 'main-content') {
        if (e.target.className === 'menu-btn'
            || e.target.className === 'board-header-name'
            || e.target.className === 'new-card') return;

        else if (document.querySelector('.open-popup-window').style.display !== '') {
            isOnlyOnePopup();
        } else if (e.target.id === 'add-list-wrapper'
            || e.target.className === 'list-wrapper'
            || e.target.className === 'board-header') {
            if (document.querySelector('.add-list-btns').style.display !== '') {
                closeListForm();
            } else if (currentFormId && document.getElementById(currentFormId).style.display !== '') {
                closeCardForm();
            }
        } else if (document.querySelector('.window-overlay').style.display !== '') {
            closeListForm();
            if (currentFormId && document.getElementById(currentFormId).style.display !== '') {
                closeCardForm();
            }
        } return;
    }
    else if (this.className === 'open-popup-window') return;
    else if (this.className === 'window-overlay') {
        if (e.target.className === 'close close-window'
            || e.target.className === 'window-overlay') {
            if (popupContent.children.length !== 0) {
                isOnlyOnePopup();
            } else {
                document.querySelector('.window-overlay').style.display = '';
            }
        } else return;
    }
}
function displayCardPopup(a, b, e) {
    var listId = document.querySelector('.window-list-name').id.slice(1);
    var taskId = document.querySelector('.window-task-name').id.slice(1);
    isOnlyOnePopup();
    if (e.target.className === 'action delete') {
        displayAction(actionId, [storage[listId].tasks[taskId].name, storage[listId].name], 'deleted');
        deleteCard(listId, taskId);
        return;
    }
    getCoords.call(this, a, b);
    showCardForm(listId, taskId, storage[listId].tasks[taskId].name, listId, e);
}

/*---------- Listeners for buttons----------*/
document.querySelector('.board-header-name').addEventListener('click', function () {
    getCoords.call(this, -33, 34);
    showRenameBoardPopup();
});

document.querySelector('.close-popup').addEventListener('click', function () {
    isOnlyOnePopup();
});

document.querySelector('.action.move').addEventListener('click', function (e) {
    displayCardPopup.call(this, -8, 37, e);
});

document.querySelector('.window-list-name').addEventListener('click', function (e) {
    displayCardPopup(-6, 13, e);
});

document.querySelector('.action.copy').addEventListener('click', function (e) {
    displayCardPopup.call(this, -8, 37, e);
});

document.querySelector('.action.delete').addEventListener('click', function (e) {
    displayCardPopup.call(this, null, null, e);
    document.querySelector('.window-overlay').style.display = '';
});

/*---------- Display a content with a LocalStorage----------*/
if (localStorage.getItem('storage') === null
    && localStorage.getItem('board-name') === null
    && localStorage.getItem('actions') === null) {
    boardName.innerHTML = 'Board Name';
    localStorage.setItem('board-name', boardName.innerHTML);
    localStorage.setItem('actionId', actionId);
    displayAction(actionId, [boardName.innerHTML], 'created');
    createList('Backlog');
    displayList(1);
    createList('In Process');
    displayList(2);
    createList('Done');
    displayList(3);
    createTask(1, 'Task 1', 1);
    displayTask(1, 4);
    refreshStorage();
} else {
    id = +localStorage.getItem('id');
    document.querySelector('.board-menu').style.display = localStorage.getItem('menu-display');
    boardName.innerHTML = localStorage.getItem('board-name');
    actionList = JSON.parse(localStorage.getItem('actions'));

    for (var a in actionList) {
        displayActivity(+a, actionList[a].data, actionList[a].action, actionList[a].time);
    }

    storage = JSON.parse(localStorage.getItem('storage'));

    for (var i in storage) {
        displayList(i);

        if (document.querySelectorAll('.list-wrapper').length === 0) {
            displaySortedCards(i);
            continue;
        }

        displaySortedCards(i);
        var lists = document.querySelectorAll('.list-wrapper');

        for (var k = 0; k < lists.length; k++) {
            if (storage[i].position < storage[lists[k].id].position) {
                board.insertBefore(document.getElementById(i), document.getElementById(lists[k].id));
                break;
            }
        }
    }
}

document.body.addEventListener('click', function () {
    var windowOverlay = document.querySelectorAll('.window-overlay');
    var mainContent = document.querySelectorAll('.main-content, .open-popup-window');

    if (currentFormId && document.getElementById(currentFormId).style.display !== '') {
        setHandler(mainContent);
    }
    else if (popupContent.children.length !== 0
        || document.querySelector('.add-list-btns').style.display !== '') {
        setHandler(mainContent);
    }
    else if (document.querySelector('.window-overlay, .open-popup-window').style.display !== '') {
        setHandler(windowOverlay);
    }
    else return;
});
