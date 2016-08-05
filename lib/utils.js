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
