/**
 * Created by excilys on 01/06/16.
 */
/* From http://www.html5rocks.com/en/tutorials/dnd/basics/ */

// All the 'e.target' are normally interchangeable with 'this'.
'use strict';
//*
// var dragSrcEl = null;
var ownControllerUUID = {uuid: getGuid()};
var otherControllerUUID = {uuid: null};
var linearColumns;
var exchangeFile = null;

// will be stored w/ a localStorage using ownControllerUUID as key
var fileStorage = null;

var uuidStorage = null;

// JSON Object used :
// ownControllerUUID
// objectToReplaceUUID
// objectUUID
// objectBody : TBD

var cols = [document.querySelectorAll('#columns1 .column'),
    document.querySelectorAll('#columns2 .column')];

// var cols = document.querySelectorAll('#columns1 .column');

/* ********************************** */
/* ****** Function declaration ****** */
/* ********************************** */

// Perso
// var init = init;
// var findObjectViaInnerHTML = findObjectViaInnerHTML;
// var getGuid = getGuid;

// Drag'n'Drop (DnD)
// var handleDragStart = handleDragStart;
// var handleDragEnter = handleDragEnter;
// var handleDragOver = handleDragOver;
// var handleDragLeave = handleDragLeave;
// var handleDrop = handleDrop;
// var handleDragEnd = handleDragEnd;


// Créer des objets représentants les objets dispo avec ou non un UUID
// Stocker le tout dans le localStorage en String JSON
// Les manipuler par la suite


function handleDragStart(e) {
    if (fileStorage === null) {
        init();
    }
    // Target (this) element is the source node.
    e.target.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';

    // dragSrcEl = e.target;

    var json = findObjectViaInnerHTML(e.target.innerHTML);
    console.log(json);

    // e.dataTransfer.setData('text/html', e.target.innerHTML);
    localStorage.setItem('exchangeFile', JSON.stringify(json));
}

function handleDragOver(e) {
    if (e.preventDefault) {
        // Prevents the default behavior of a browser; for instance preventing link opening to allow the DnD.
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    // Some browsers may not need this, but some do so we add it
    return false;
}


// dragenter is used to toggle the 'over' class instead of the dragover.
// If we were to use dragover, our CSS class would be toggled many times
// as the event dragover continued to fire on a column hover.
// Ultimately, that would cause the browser's renderer to do a large amount of unnecessary work.
// Keeping redraws to a minimum is always a good idea.
function handleDragEnter(e) {
    // this / e.target is the current hover target.
    e.target.classList.add('over');
}

function handleDragLeave(e) {
    e.target.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) { // this/e.target is current target element.
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // We get the object that's being dragged/dropped
    var source = JSON.parse(localStorage.getItem('exchangeFile'));

    // Don't do anything if dropping the same column we're dragging.
    if (e.target.innerHTML !== source.body) {
        // console.log(source);
        var target = findObjectViaInnerHTML(e.target.innerHTML);
        var tmp = target.body;
        e.target.innerHTML = source.body;
        target.body = source.body;
        updateFileStorage(target);
        source.body = tmp;
        localStorage.setItem('exchangeFile', JSON.stringify(source));
    }


    return false;
}

function handleDragEnd(e) {
    // this/e.target is the source node.
    var json = JSON.parse(localStorage.getItem('exchangeFile'));
    linearColumns = JSON.parse(localStorage.getItem('linearColumns' + ownControllerUUID.uuid));

    console.log(json);

    var i, j, k = 0;
    for (i = 0; i < cols.length; i++) {
        for (j = 0; j < cols[i].length; j++) {
            cols[i][j].classList.remove('over');
            if (linearColumns[k].uuid === json.uuid) {
                e.target.innerHTML = json.body;
                e.target.style.opacity = '1';
            }
            k++;
        }
    }
    updateFileStorage(json);
    // var json = JSON.parse(localStorage.getItem('fileStorage' + ownControllerUUID.uuid));
}

function addEventListeners() {
    console.log(cols);

    var i, j;
    for (i = 0; i < cols.length; i++) {
        for (j = 0; j < cols[i].length; j++) {
            cols[i][j].addEventListener('dragstart', handleDragStart, false);
            cols[i][j].addEventListener('dragenter', handleDragEnter, false);
            cols[i][j].addEventListener('dragover', handleDragOver, false);
            cols[i][j].addEventListener('dragleave', handleDragLeave, false);
            cols[i][j].addEventListener('drop', handleDrop, false);
            cols[i][j].addEventListener('dragend', handleDragEnd, false);
        }
    }
}

// Gets the original objects
function init() {
    addEventListeners();

    console.log(localStorage.length);
    // We put to everybody's sight our UUID
    var tmp = localStorage.getItem('uuidStorage');
    var uuidList = [];
    var empty = JSON.stringify({uuidList: []});

    console.log(tmp);

    // if empty, we populate
    if ((tmp === empty) || (tmp === null)) {
        uuidList.push(ownControllerUUID);
        uuidStorage = {uuidList: uuidList};
    } else { // if not, we complement
        uuidStorage = JSON.parse(tmp);
        otherControllerUUID = uuidStorage.uuidList[0].uuid;
        uuidStorage.uuidList.push(ownControllerUUID);
    }

    var string = JSON.stringify(uuidStorage);
    localStorage.setItem('uuidStorage', string);

    fileStorage = [];
    linearColumns = [];

    // populating fileStorage
    var i, j, k = 0;
    for (i = 0; i < cols.length; i++) {
        for (j = 0; j < cols[i].length; j++) {
            tmp = {uuid: getGuid(), body: cols[i][j].innerHTML};
            fileStorage.push(tmp);
            linearColumns.push({colNum: k, uuid:tmp.uuid});
            k++;
        }
    }
    // Storing fileStorage in the local storage
    localStorage.setItem('fileStorage' + ownControllerUUID.uuid, JSON.stringify(fileStorage));
    localStorage.setItem('linearColumns' + ownControllerUUID.uuid, JSON.stringify(linearColumns));

}

function clearAll() {
    // localStorage.setItem('uuidStorage', JSON.stringify({uuidList: []}));
    localStorage.clear();
}


function list() {
    var len = localStorage.length;
    if (len === 0) {
        console.log('The localStorage is empty!');
    } else {
        for (var i = 0; i < len; i++) {
            var key = localStorage.key(i);
            var value = localStorage[key];
            console.log(key + ' => ' + value);
        }
    }
}

/**
 * @return {JSON} the JSON object if found, null else
 */
function findObjectViaInnerHTML(innerHTML) {
    var i;
    for (i = 0; i < fileStorage.length; i++) {
        if (fileStorage[i].body.indexOf(innerHTML) !== -1) {
            return fileStorage[i];
        }
    }
    return null;
}

function store(id, jsonObject) {
    var value = JSON.stringify(jsonObject);
    localStorage.setItem(id, value);
}

function updateFileStorage(json) {
    fileStorage = JSON.parse(localStorage.getItem('fileStorage' + ownControllerUUID.uuid));

    // populating fileStorage
    var i;
    for (i = 0; i < cols.length; i++) {
        if (fileStorage[i].uuid === json.uuid) {
            fileStorage[i].body = json.body;
            break;
        }
    }

    // Storing fileStorage in the local storage
    localStorage.setItem('fileStorage' + ownControllerUUID.uuid, JSON.stringify(fileStorage));
}

function getGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getOwn(field) {
    return field + ownControllerUUID;
}

function nodeToString(node) {
    var tmpNode = document.createElement("div");
    tmpNode.appendChild(node.cloneNode(true));
    var str = tmpNode.innerHTML;
    tmpNode = node = null; // prevent memory leaks in IE
    return str;
}

//*/

