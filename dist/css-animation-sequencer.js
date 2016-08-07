(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CSSAnimationSequencer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* Run Animation Sequence on Object
* @param sequence - array of objects, each representing a step in the animation
* 	key: Class name to be added or removed. (Can be more than one)
*		Required
*	method: "add" or "remove" the key.  
*		Default: "add"
*	node: identifer for any child nodes that are animating.  Used to prevent bubbling.  If "suppress" option
*		is not used, then this will fire one callback for all child animations.
*		Optional
*	suppress: prevents all child animations from firing callbacks
*		Optional. Currently any value will suppress, but this may be extended
*	callback: function called after transition end for the current step.
*		Optional
*/

/**
 * var sequencer = new Sequencer();
 * sequencer.run(document.getElementById('cube'), [{}]);
 * 
 */

var utils = require('./lib/utils.js');
var registry = require('./lib/registry.js');

function Sequencer(){
	utils.transitionSupport();
};

Sequencer.prototype.run = function(element, sequence){
	var length = sequence.length - 1;
	var i = 0;

	(function iterate(){

		var seq = sequence[i],

			method = seq.method || 'add',

			step = function(e){

				console.log(e.target)
				
				if ( i < length) {
					i++;	
					iterate();
				} else { 
					registry.remove(element);
				}

				seq.callback && seq.callback.apply(null, []);

			};


		//If the animation is performed on the element's children and not the element,
		//this will stop propagation and execute the callback only once.
		if (seq.node){

			var nodes = utils.selectAll(seq.node, element);

			for (var j = nodes.length - 1; j >= 0; j--) {
				
				(function(j){

					nodes[j].addEventListener('transitionend', function(e){
						
						e.stopPropagation();

						e.target.removeEventListener('transitionend', arguments.callee);
						
						if (!seq.suppress){
							(j === 0) && step(e);	
						}
						

					});

				})(j);

			};

		}

		registry.add(element, step);

		method === 'add' ? utils.addClass(element, seq.key) : utils.removeClass(element, seq.key);
		
	})();

};

module.exports = Sequencer;

/*
eliminate gulp.  use npm to build, like this:
https://github.com/sachinchoolur/lightgallery.js/blob/master/package.json
 */

/*	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}*/
//console.log(module);
//todo: export this so it works as a standalone script or an npm module
// I think I have to remove browserify for this to work as a plain browser script.  maybe require js instead? or just one file.
// if (typeof exports !== 'undefined') {
// 	module.exports = Sequencer
// } else {
//     window.Sequencer = Sequencer;
// }

},{"./lib/registry.js":2,"./lib/utils.js":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var doc = document;

function Utils(){};

Utils.prototype.select = function(query, context, index) {
    if (typeof context !== 'object') {
        context = context ? doc.querySelectorAll(context)[0] : doc;   
    }
    index = index || 0;
    return context.querySelectorAll(query)[index];
};

Utils.prototype.selectAll = function(query, context){
    if (typeof context !== 'object') {
        context = context ? doc.querySelectorAll(context)[0] : doc;   
    }
    return context.querySelectorAll(query);
};

Utils.prototype.transitionSupport = function() {
    var el = document.createElement('css-animation-sequencer');
    var transEndEventNames = {
        WebkitTransition : 'webkitTransitionEnd',
        MozTransition    : 'transitionend',
        OTransition      : 'oTransitionEnd otransitionend',
        transition       : 'transitionend'
    };
    for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
            return { end: transEndEventNames[name] }
        }
    }
    return false;
};

Utils.prototype.addClass = function(elem, list){
    var i;
    list = list.split(' ');
    i = list.length;
    while (i) {
        i -= 1;
        elem.classList.add(list[i]);    
    }   
};

Utils.prototype.removeClass = function(elem, list){
    var i;
    list = list.split(' ');
    i = list.length;
    while (i) {
        i -= 1;
        elem.classList.remove(list[i]);    
    }   
};

module.exports = new Utils();

},{}]},{},[1])(1)
});