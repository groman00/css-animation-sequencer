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
