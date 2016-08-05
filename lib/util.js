/**/
function select(query, context, index){

	if (typeof context !== 'object') {

		context = context ? document.querySelectorAll(context)[0] : document;	

	}

	index = index || 0;

	return context.querySelectorAll(query)[index];

};

module.exports.select = select;


function selectAll(query, context){

	if (typeof context !== 'object') {

		context = context ? document.querySelectorAll(context)[0] : document;	

	}

	return context.querySelectorAll(query);

};

module.exports.selectAll = selectAll;



/**/
module.exports.transitionSupport = function() {
    var el = document.createElement('css-animation-sequencer'),

        transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        }

    for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
            return { end: transEndEventNames[name] }
        }
    }

    return false;
};



/*
Register CSS Transitions.
Keep track of anonymous callbacks and have the option to remove them on the fly.
*/
var cssTransition = (function() {

	var transitions = {};

		uniqueId = function(name){

			var id = name + Math.floor(Math.random()*100000); 

			if (!transitions[id]) {

				return id;

			} else {

				uniqueId();

			}

		},

		remove = function(element){

			element.removeEventListener("transitionend", transitions[element.dataset.id]);

			delete transitions[element.dataset.id];

			delete element.dataset.id;

		};

	return {

		add: function(element, listener){

			var id = uniqueId(element.tagName);
		
			transitions[id] = listener;

			//If element is already bound, remove listener.
			element.dataset.id && remove(element);

			element.dataset.id = id;

			element.addEventListener("transitionend", listener);

		},

		remove: remove

	}

})();

module.exports.cssTransition = cssTransition;



/**/
function isArray(obj) {
	return obj && obj instanceof Array;
};

module.exports.isArray = isArray;


/**/
Object.prototype.addClass = function(list){
	list = list.split(' ');
	var i = list.length;
    while (i) {
        i -= 1;
    	this.classList.add(list[i]);    
    }	
};

/**/
Object.prototype.removeClass = function(list){
	list = list.split(' ');
	var i = list.length;
    while (i) {
        i -= 1;
    	this.classList.remove(list[i]);    
    }	
};



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

Object.prototype.transitionSequence = function(sequence){

	var element = this,

		length = sequence.length - 1,

		i = 0;

	(function run(){

		var seq = sequence[i],

			method = seq.method || 'add',

			step = function(e){

				console.log(e.target)
				
				if ( i < length) {
					i++;	
					run();
				} else { 
					cssTransition.remove(element);
				}

				seq.callback && seq.callback.apply(null, []);

			};


		//If the animation is performed on the element's children and not the element,
		//this will stop propagation and execute the callback only once.
		if (seq.node){

			var nodes = selectAll(seq.node, element);

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

		cssTransition.add(element, step);

		method === 'add' ? element.addClass(seq.key) : element.removeClass(seq.key);
		
	})();

	

};















