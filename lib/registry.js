/*
 * Register CSS Transitions.
 * Keep track of anonymous callbacks and have the option to remove them on the fly.
 *
 * notes:
 * Does the uniqueId generator need to be improved?  maybe use a date string instead.
 */

var transitions = {};

function uniqueId(name) {
    var id = name + Math.floor(Math.random() * 100000);
    if (!transitions[id]) {
        return id;
    }
    return uniqueId();
}

function remove(element) {
    var el = element;
    el.removeEventListener('transitionend', transitions[el.dataset.id]);
    delete transitions[el.dataset.id];
    delete el.dataset.id;
}

module.exports.remove = remove;

function add(element, listener) {
    var el = element;
    var id = uniqueId(el.tagName);
    var callback = listener;
    transitions[id] = callback;
    if (el.dataset.id) {
        remove(el); // If element is already bound, remove callback
    }
    el.dataset.id = id;
    el.addEventListener('transitionend', callback);
}

module.exports.add = add;
