/*
 * Register CSS Transitions.
 * Keep track of anonymous callbacks and have the option to remove them on the fly.
 *
 * notes:
 *
 * Does the uniqueId generator need to be improved?  maybe use a date string instead.
 */

var transitions = {};

function uniqueId(name){
    var id = name + Math.floor(Math.random()*100000);
    if (!transitions[id]) {
        return id;
    } else {
        uniqueId();
    }
};

function add(element, listener){
    var id = uniqueId(element.tagName);
    transitions[id] = listener;
    element.dataset.id && remove(element); //If element is already bound, remove listener
    element.dataset.id = id;
    element.addEventListener("transitionend", listener);
};

function remove(element){
    element.removeEventListener("transitionend", transitions[element.dataset.id]);
    delete transitions[element.dataset.id];
    delete element.dataset.id;
};


module.exports.add = add;
module.exports.remove = remove;
