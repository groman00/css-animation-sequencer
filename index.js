var util = require('./lib/util.js');

util.transitionSupport();

var cube = util.select('#cube');

window.setTimeout(function(){

	cube.transitionSequence([
		{
			key: 'rotate'
		},
		{
			key: 'preExplode',
		},
		{
			key: 'explode',
			node: 'figure',
			callback: function(){
				console.log('exploding');
			}
		},
		{
			key: 'rotate preExplode',
			method: 'remove'
		},
		{
			key: 'explode',
			method: 'remove',
			node: 'figure',
			callback: function(){
				
				console.log('imploding');

				util.select('.viewport').transitionSequence([
					{
						key: 'trippy'		
					},
					{
						key: 'trippy',
						method: 'remove',
						callback: showFaces
					}
				]);
				
			}
		}				
	]);

}, 0);






/*

var faces = [
	'bottom',
	'back',
	'top',
	'left',
	'right',
	'front'
];




function showFaces(){

	console.log('faces');

	function show(f){
		util.select('.' + f, cube).addClass('in');
	}


	var sequence = [];

	for(var i = 0, max = faces.length;i < max;i++){

		(function(i){

			sequence.push(
				{
					key: faces[i],
					node:'img',
					suppress: 'node',
					callback: function(){
						show(faces[i]);
					}
				}
			);

		})(i);
	
	};

	sequence.push(
		{
			key: 'front bottom back top left right',
			method: 'remove',
			node:'img',
			suppress: 'node'

		},
		{
			key: 'rotate'
		},
		{
			key: 'flipIn',
			callback:function(){
				cube.removeClass('rotate');
			}
		},
		{
			key: 'scale',
			callback:function(){
				cube.removeClass('flipIn');
			}
		}
	);

	cube.transitionSequence(sequence);

};











(function(){

	var figures = util.selectAll('figure', cube);

	for (var i = 0, max = figures.length; i < max; i++) {
		
		figures[i].onclick = function(){

			console.log(this);
			
			var className = this.className.split(' ')[0];
			
			cube.className = (cube.className !== className) ? (cube.className = className) : (cube.className = 'scale');

		}

	};

})();













(function(){

	window.onkeydown = function(e){

		var current = faces.indexOf(cube.className.split(' ')[0]),
			
			next = 0;		

		switch (e.keyCode){

			//left
			case 37:
				next--;
				break;
			
			//right
			case 39:
				next++;
				break;			
			
			default:
				next = false;
				break;

		};

		if (next){

			next = current + next;

			(next < 0) && (next = faces.length - 1);

			(next >= faces.length) && (next = 0);

			cube.className = faces[next];

		}

	};

})();


*/










