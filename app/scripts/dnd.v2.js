/**
 * Created by excilys on 01/06/16.
 */
/* From http://www.html5rocks.com/en/tutorials/dnd/basics/ */

// All the 'e.target' are normally interchangeable with 'this'.
'use strict';
//*
const CONST = {
    EXCHANGE_FILE: 'exchangeFile',
    STORAGE_FILE: 'storageFile',
    LINEAR_COLUMNS: 'linearColumns',
    UUID_STORAGE: 'uuidStorage'
};

// var dragSrcEl = null;
var ownControllerUUID = {uuid: getGuid()};
var otherControllerUUID = {uuid: null};
// var linearColumns;
// var exchangeFile = null;

// will be stored w/ a localStorage using ownControllerUUID as key
// var fileStorage = null;

// var uuidStorage = null;

// JSON Object used :
// ownControllerUUID
// objectToReplaceUUID
// objectUUID
// objectBody : TBD

var cols = [document.querySelectorAll('#columns1 .column')];//,
// document.querySelectorAll('#columns2 .column')];

// var cols = document.querySelectorAll('#columns1 .column');

/* ********************************** */
/* ****** Function declaration ****** */
/* ********************************** */

// Perso
// init();
// var init = init();
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
    console.log('**************************handleDragStart');
    var fileStorage = getJson(getOwn(CONST.STORAGE_FILE));
    if (fileStorage === null) {
        init();
    }
    // Target (this) element is the source node.
    e.target.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';

    var json = findObjectViaInnerHTML(e.target.innerHTML);
    console.log('object found:');
    console.log(json);
    setJsonAsText(CONST.EXCHANGE_FILE, json);
}

// dragenter is used to toggle the 'over' class instead of the dragover.
// If we were to use dragover, our CSS class would be toggled many times
// as the event dragover continued to fire on a column hover.
// Ultimately, that would cause the browser's renderer to do a large amount of unnecessary work.
// Keeping redraws to a minimum is always a good idea.
function handleDragEnter(e) {
    console.log('**************************handleDragEnter');
    // this / e.target is the current hover target.
    e.target.classList.add('over');
}

function handleDragOver(e) {
    console.log('**************************handleDragOver');
    if (e.preventDefault) {
        // Prevents the default behavior of a browser; for instance preventing link opening to allow the DnD.
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    return false; // Some browsers may not need this, but some do so we add it
}


function handleDragLeave(e) {
    console.log('**************************handleDragLeave');
    e.target.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) { // this/e.target is current target element.
    console.log('**************************handleDrop');
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // We get the object that's being dragged/dropped
    var source = getJson(CONST.EXCHANGE_FILE);
    console.log('source');
    console.log(source);

    if (source === null) {
        console.log('source is null!');
    }

    // Don't do anything if dropping the same column we're dragging.
    if (e.target.innerHTML !== source.body) {
        var target = findObjectViaInnerHTML(e.target.innerHTML);
        var colNumTarget = getColNumOfObject(target);
        //colNum du target actuel

        // We keep the target's body
        var tmp = target.body;
        // We swap
        e.target.innerHTML = source.body;
        target.body = source.body;

        // We set a new UUID
        target.uuid = getGuid();

        // We update the target
        updateFileStorageAndLinearColumns(colNumTarget, target);

        // We update the source
        source.body = tmp;
        console.log('new source');
        console.log(source);
        // We save the modifications
        setJsonAsText(CONST.EXCHANGE_FILE, source);
    }
    return false;
}

function handleDragEnd(e) { // this/e.target is the source node.
    console.log('**************************handleDragEnd');
    console.log('Wainting 1 second...');
    window.setTimeout(function() {
        console.log('Done.');
        // We retrieve the modified source element
        var json = getJson(CONST.EXCHANGE_FILE);
        console.log('json');
        console.log(json);

        // We get the objects column's number
        var colNum = getColNumOfObject(json);

        // Remplacer directement dans linearColumns
        for (var i = 0; i < cols.length; i++) {
            for (var j = 0; j < cols[i].length; j++) {
                if (i * j + j === colNum) {
                    cols[i][j].innerHTML = json.body;
                    cols[i][j].style.opacity = '1';
                }
            }
        }

        json.uuid = getGuid();
        console.log('new json');
        console.log(json);
        updateFileStorageAndLinearColumns(colNum, json);
        setJsonAsText('fileExchange', null);
    }, 1000);
}

function addEventListeners() {
    console.log('addEventListeners');
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
    console.log('init');
    addEventListeners();

    console.log(localStorage.length);
    // We put to everybody's sight our UUID
    var tmp = localStorage.getItem(CONST.UUID_STORAGE);
    var uuidList = [];
    var uuidStorage;
    // if empty, we populate
    if (tmp === null) {
        uuidList.push(ownControllerUUID);
        uuidStorage = {uuidList: uuidList};
    } else { // if not, we complement
        uuidStorage = JSON.parse(tmp);
        otherControllerUUID = uuidStorage.uuidList[0].uuid;
        uuidStorage.uuidList.push(ownControllerUUID);
    }

    var string = JSON.stringify(uuidStorage);
    localStorage.setItem(CONST.UUID_STORAGE, string);

    var fileStorage = [];
    var linearColumns = [];

    // populating fileStorage and linearColumns
    var i, j;
    for (i = 0; i < cols.length; i++) {
        for (j = 0; j < cols[i].length; j++) {
            tmp = {uuid: getGuid(), body: cols[i][j].innerHTML};
            fileStorage.push(tmp);
            var col = i * j + j;
            linearColumns.push({colNum: col, uuid: tmp.uuid});
        }
    }
    // Storing fileStorage in the local storage
    setJsonAsText(getOwn(CONST.STORAGE_FILE), fileStorage);
    setJsonAsText(getOwn(CONST.LINEAR_COLUMNS), linearColumns);

}

/**
 *
 * @param obj {JSON}
 * @return {number}
 */
function getColNumOfObject(json) {
    var linearColumns = getJson(getOwn(CONST.LINEAR_COLUMNS));
    for (var i = 0; i < linearColumns.length; i++) {
        if (linearColumns[i].uuid === json.uuid) {
            return i;
        }
    }
    return -1;
}

function updateFileStorageAndLinearColumns(colNum, objToUpdate) {
    // getting the files fomr the local storage
    var fileStorage = getJson(getOwn(CONST.STORAGE_FILE));
    var linearColumns = getJson(getOwn(CONST.LINEAR_COLUMNS));

    // updating...
    fileStorage[colNum] = objToUpdate;
    linearColumns[colNum] = objToUpdate;

    // Storing in the local storage
    setJsonAsText(getOwn(CONST.STORAGE_FILE), fileStorage);
    setJsonAsText(getOwn(CONST.LINEAR_COLUMNS), linearColumns);
}

function clearAll() {
    console.log('clearAll');
    // localStorage.setItem(UUID_STORAGE, JSON.stringify({uuidList: []}));
    localStorage.clear();
}


function list() {
    console.log('list');
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
    console.log('findObjectViaInnerHTML');
    console.log('innerHTML');
    console.log(innerHTML);
    console.log('against: ');
    var fileStorage = getJson(getOwn(CONST.STORAGE_FILE));
    var i;
    for (i = 0; i < fileStorage.length; i++) {
        console.log(fileStorage[i]);
        if (fileStorage[i].body.indexOf(innerHTML) !== -1) {
            return fileStorage[i];
        }
    }
    return null;
}

function store(id, jsonObject) {
    console.log('store');
    var value = JSON.stringify(jsonObject);
    localStorage.setItem(id, value);
}

function updateFileStorage(json) {
    console.log('updateFileStorage');
    var fileStorage = JSON.parse(localStorage.getItem(getOwn(CONST.STORAGE_FILE)));

    // populating fileStorage
    var i;
    for (i = 0; i < cols.length; i++) {
        if (fileStorage[i].uuid === json.uuid) {
            fileStorage[i].uuid = getGuid();
            fileStorage[i].body = json.body;
            break;
        }
    }

    // Storing fileStorage in the local storage
    setJsonAsText(getOwn(CONST.STORAGE_FILE), fileStorage);
}

function getGuid() {
    console.log('getGuid');
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getOwn(field) {
    console.log('getOwn');
    return field + ownControllerUUID.uuid;
}

function nodeToString(node) {
    console.log('nodeToString');
    var tmpNode = document.createElement("div");
    tmpNode.appendChild(node.cloneNode(true));
    var str = tmpNode.innerHTML;
    tmpNode = node = null; // prevent memory leaks in IE
    return str;
}

/**
 * @param item{string}
 * @return {JSON}
 */
function getJson(item) {
    var str = localStorage.getItem(item);
    return JSON.parse(str);
}

/**
 * @param item{string}
 * @param json{JSON}
 */
function setJsonAsText(item, json) {
    var str = JSON.stringify(json);
    localStorage.setItem(item, str);
}

//*/

