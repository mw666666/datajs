/**
 * 
 * @authors Qmw (qmw920@163.com)
 * @date    2014-06-08 17:11:40
 * @version 0.0.1
 */
function Util(){

}
var class2type = {},
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty;

// jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
// 	class2type[ "[object " + name + "]" ] = name.toLowerCase();
// });
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name){
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});
Util.prototype = {
	constructor: Util,
	extend : function(subClass, superClass){
	    var that = this;
	    var f = function(){};
	    if(subClass.superClass){
	    	subClass.extend(superClass.prototype);
	    	return ;
	    }
	    f.prototype = superClass.prototype;
	    subClass.prototype = new f();
	    subClass.constructor = subClass;
	    subClass.superClass = superClass;
	    // superClass.subClass = subClass;

	    subClass.extend = function(methods){
	        that.include(subClass.prototype, methods);
	    };
		subClass.prototype.extend = subClass.extend;	    
	    return subClass;
	},
	include : function(subObj, supperObj){
	    for(var prop in supperObj){
	        subObj[prop] = supperObj[prop];
	    }
	    return subObj;
	},
	clone: function(obj){
		if(this.type(obj) === 'object' && obj.__watch__){
			obj = obj.$rawData;
			// debugger;
		}
		if(this.type(obj) === 'object'){
			var o = {};
			for(var p in obj){
				o[p] = this.clone(obj[p]);
			}
			return o;
		}else if(this.type(obj) === 'array'){
			var arr = [];
			for(var i=0,len=obj.length;i<len;i++){
				arr[i] = this.clone(obj[i]);
			}
			return arr;
		}else{
			return obj;
		}
	},
	array: {

	},
	isFunction: function( obj ) {
		return this.type(obj) === "function";
	},
	isArray: Array.isArray,
	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},
	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},
	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},
	isPlainObject: function( obj ) {
		if ( this.type( obj ) !== "object" || obj.nodeType || this.isWindow( obj ) ) {
			return false;
		}
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}
		return true;
	},
	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},
	getCssPrefix: function(){
		var body = document.body || document.documentElement;
		var style = body.style;
		var cssPrefix = ['webkit', 'moz', 'ms', 'o'];
		var i = 0;
		while(i < cssPrefix.length){
			if(typeof style[cssPrefix[i] + 'Transition'] !== 'undefined'){
				return cssPrefix[i];
			}

			i++;
		}
	},
	getObjectProp: function(obj, prop){
		var keys = prop.split('.');
		var val = null;
		var o = obj;
		var flag = true;
		keys.forEach(function(key){
			try{
				val = o[key];
				o = val;					
			}catch(e){
				console.error('对象属性不存在');
				throw e;
			}
			
		});
		return val;
	},
	//var aa = {a:{b:2}}   'a.b'
	setObjectProp: function(obj, prop, data){
		// if(prop.indexOf('.') >= 0){}
		var keys = prop.split('.');
		var val = null;
		var o = obj;
		var flag = true;
		for(var i=0,len=keys.length;i<len;i++){
			try{
				if(i != (len - 1)){
					o = o[keys[i]];	
				}else{
					o[keys[i]] = data;
					if(D.util.type(o[keys[i]]) === 'array'){
						// o.push();
					}
				}
			}catch(e){
				console.error('对象属性不存在');
				throw e;
			}			
		}
		// return obj;
	},
	placeAt: function(elem, template, pos, CB){
        var $elem = $(elem);
        var $container = template;
        pos = pos || 'replaceInner';

        pos = pos.toLocaleLowerCase();

        var posMap = {
            before: 'before',
            beforebegin: 'before',
            after: 'after',
            afterend: 'after',
            append: 'append',
            afterbegin: 'prepend',
            prepend: 'prepend',
            beforeend: 'append',
            replaceinner: 'replaceInner',
            replace: 'replace',
        };

        if(pos === 'replace'){
            $elem.replaceWith($container);
        }else if(posMap[pos] === 'before'){
            $elem.before($container);
        }else if(posMap[pos] === 'after'){
            $elem.after($container);
        }else if(posMap[pos] === 'append'){
            $elem.append($container);
        }else if(posMap[pos] === 'prepend'){
            $elem.prepend($container);
        }else if(posMap[pos] === 'replaceInner'){
            $elem.html('');
            $elem.append($container);
        }else if(posMap[pos] === 'replace'){
            $elem.replaceWith($container);
        }
    },	
}