/**
 * Created by excilys on 01/06/16.
 */
/* From http://www.html5rocks.com/en/tutorials/dnd/basics/ */

// All the 'e.target' are normally interchangeable with 'this'.
'use strict';
//*
var dragSrcEl = null;

var cols = [document.querySelectorAll('#columns1 .column'),
    document.querySelectorAll('#columns1 .empty-column'),
    document.querySelectorAll('#columns2 .column'),
    document.querySelectorAll('#columns2 .empty-column')];

function handleDragStart(e) {
    // Target (this) element is the source node.
    e.target.style.opacity = '0.4';

    dragSrcEl = e.target;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    // console.log(e.target);
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

function handleDrop(e) {
    // this/e.target is current target element.

    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != e.target) {
        dragSrcEl.style.opacity = '1';
        e.target.style.opacity = '1';
        // Set the source column's HTML to the HTML of the column we dropped on.
        dragSrcEl.innerHTML = e.target.innerHTML;
        e.target.innerHTML = e.dataTransfer.getData('text/html');
    }


    return false;
}

function handleDragEnd(e) {
    // this/e.target is the source node.

    [].forEach.call(cols, function (c) {
        c.forEach.call(c, function (col) {
            col.classList.remove('over');
        });
    });
}


[].forEach.call(cols, function (c) {
    c.forEach.call(c, function (col) {
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragenter', handleDragEnter, false);
        col.addEventListener('dragover', handleDragOver, false);
        col.addEventListener('dragleave', handleDragLeave, false);
        col.addEventListener('drop', handleDrop, false);
        col.addEventListener('dragend', handleDragEnd, false);
    });
});
//*/