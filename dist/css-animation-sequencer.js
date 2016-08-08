(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CSSAnimationSequencer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* Run Animation Sequence on Object
* @param sequence - array of objects, each representing a step in the animation
*   key: Class name to be added or removed. (Can be more than one)
*       Required
*   method: "add" or "remove" the key.
*       Default: "add"
*   node: identifer for any child nodes that are animating.  Used to prevent bubbling.  If "suppress" option
*       is not used, then this will fire one callback for all child animations.
*       Optional
*   suppress: prevents all child animations from firing callbacks
*       Optional. Currently any value will suppress, but this may be extended
*   callback: function called after transition end for the current step.
*       Optional
*/

var utils = require('./lib/utils.js');
var registry = require('./lib/registry.js');

function Sequencer() {
    utils.transitionSupport();
}

Sequencer.prototype.run = function (element, sequence) {
    var length = sequence.length - 1;
    var i = 0;

    (function iterate() {
        var nodes;
        var j;
        var seq = sequence[i];
        var method = seq.method || 'add';

        function step(e) {
            // console.log(e.target)
            if (i < length) {
                i++;
                iterate();
            } else {
                registry.remove(element);
            }
            if (seq.callback) {
                seq.callback.apply(null, []);
            }
        }

        // If the animation is performed on the element's children and not the element,
        // this will stop propagation and execute the callback only once.
        if (seq.node) {
            nodes = utils.selectAll(seq.node, element);
            for (j = nodes.length - 1; j >= 0; j--) {
                (function (x) {
                    nodes[x].addEventListener('transitionend', function endCallback(e) {
                        e.stopPropagation();
                        e.target.removeEventListener('transitionend', endCallback);
                        if (!seq.suppress && x === 0) {
                            step(e);
                        }
                    });
                }(j));
            }
        }
        registry.add(element, step);
        if (method === 'add') {
            utils.addClass(element, seq.key);
        } else {
            utils.removeClass(element, seq.key);
        }
    }());
};

module.exports = Sequencer;

},{"./lib/registry.js":2,"./lib/utils.js":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var doc = document;

function Utils() {}

Utils.prototype.select = function (query, context, index) {
    var ctx = context;
    if (typeof context !== 'object') {
        ctx = context ? doc.querySelectorAll(context)[0] : doc;
    }
    return ctx.querySelectorAll(query)[index || 0];
};

Utils.prototype.selectAll = function (query, context) {
    var ctx = context;
    if (typeof context !== 'object') {
        ctx = context ? doc.querySelectorAll(context)[0] : doc;
    }
    return ctx.querySelectorAll(query);
};

Utils.prototype.transitionSupport = function () {
    var name;
    var el = document.createElement('css-animation-sequencer');
    var transEndEventNames = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'oTransitionEnd otransitionend',
        transition: 'transitionend',
    };
    for (name in transEndEventNames) {
        if (el.style[name] !== undefined) {
            return { end: transEndEventNames[name] };
        }
    }
    return false;
};

Utils.prototype.addClass = function (elem, classNames) {
    var list = classNames.split(' ');
    var i = list.length;
    while (i) {
        i -= 1;
        elem.classList.add(list[i]);
    }
};

Utils.prototype.removeClass = function (elem, classNames) {
    var list = classNames.split(' ');
    var i = list.length;
    while (i) {
        i -= 1;
        elem.classList.remove(list[i]);
    }
};

module.exports = new Utils();

},{}]},{},[1])(1)
});