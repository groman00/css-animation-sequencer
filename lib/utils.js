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
