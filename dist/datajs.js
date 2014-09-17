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
};/**
 * 
 * @authors Qmw (qmw920@163.com)
 * @date    2014-06-08 17:11:40
 * @version 0.0.1
 */

function Emiter(){
	this._events = {};
}

Emiter.prototype = {
	constructor: Emiter,
	trigger: function(type, data, e){
		this._events = this._events || {};
		var CBs = this._events[type] = this._events[type] || [];
		for(var i=0,len=CBs.length;i<len;i++){
			CBs[i].call(this, data, e);
		}	
	},
	emit: function(){
		this._events = this._events || {};
		this.trigger.apply(this, arguments);
	},
	on: function(type, CB){
		this._events = this._events || {};
		var CBs = this._events[type] = this._events[type] || [];
		CBs.push(CB);		
	},
	off: function(type, CB){
		this._events = this._events || {};
		if(type && CB){
			var CBs = this._events[type] = this._events[type] || [];
			for (var i=0,len=CBs.length;i<len;i++) {
				if(CBs[i] === CB || CBs[i].CB === CB){
					CBs.splice(i, 1);
					return ;
				}
			}			
		}else if(type){
			this._events[type].length = 0;
		}else{
			this._events = {};
		}
	},
	once: function(type, CB){
		this._events = this._events || {};
		var that = this;
		function on(){
			that.off(type, CB);
			CB.apply(this, arguments);			
		}

		on.CB = CB;
		this.on(type, on);
	},
	one: function(){
		this._events = this._events || {};
		this.once.apply(this, arguments);
	},
	broadcast: function(){
		this._events = this._events || {};
		this.once.apply(this, arguments);
	},
	dispatch: function(){
		this._events = this._events || {};
		this.once.apply(this, arguments);
	}
}
;function AOP(obj, method, CB, bindObj){
}
var a = 113111111133;
var b = 113111111133;
var bc = 113111111133;
AOP.prototype = {
	constructor: AOP,
	after: function(obj, method, CB, bindObj){
		var _method = obj[method];
		obj[method] = function(){
			var returnData = _method.apply(bindObj || obj, arguments);
			CB.apply(obj, arguments);
			return returnData;
		}
		this.include(obj[method], _method);
	},
	before: function(obj, method, CB, bindObj){
		var _method = obj[method];
		obj[method] = function(){
			var returnData = CB.apply(obj, arguments);
			if(returnData === false){
				return ;
			}else if(Object.prototype.toString.call(returnData) === '[object Array]'){
				return _method.apply(bindObj || obj, returnData);
			}
			return _method.apply(bindObj || obj, arguments);
		}
		this.include(obj[method], _method);
	},
	afterThrow: function(obj, method, CB, bindObj){
		var _method = obj[method];
		obj[method] = function(){
			try{
				return _method.apply(bindObj || obj, arguments);
			}catch(e){
				var args = Array.prototype.slice.apply(arguments, 0);
				args.unshift(e);
				CB.apply(obj, args);
			}
		}
		this.include(obj[method], _method);
	},
	afterFinally: function(obj, method, CB, bindObj){
		var _method = obj[method];
		obj[method] = function(){
			try{
				return _method.apply(bindObj || obj, arguments);
			}catch(e){
				throw e;
			}finally{
				return CB.apply(obj, arguments);
			}
		}
		this.include(obj[method], _method);
	},
	around: function(obj, method, CB, bindObj){
		var _method = obj[method];
		obj[method] = function(){
			CB.apply(obj, arguments);
			var returnData = _method.apply(bindObj || obj, arguments);
			CB.apply(obj, arguments);
			return returnData;
		}
		this.include(obj[method], _method);
	},
	introduction: function(obj, method, CB, bindObj){
		var _method = obj[method];
		obj[method] = function(){
			CB.apply(obj, arguments);
			var returnData = _method.apply(bindObj || obj, arguments);
			return returnData;
		}
		this.include(obj[method], _method);
	},
	include: function(subObj, supperObj){
        for(var prop in supperObj){
            subObj[prop] = supperObj[prop];
        }
        return subObj;
    },	

};/**
 * 
 * @authors Qmw (qmw920@163.com)
 * @date    2014-06-08 17:11:40
 * @version 0.0.1
 */
function DataManager(){

}

DataManager.prototype = {
	constructor: DataManager,
	watchData: function(){

	},
	getWatchData: function(){

	},
	initData: function(){

	},
	getInitData: function(){

	},
	_loadViewModel: function(data, prop){
		var val = null;
		if(D.util.isPlainObject(data)){
			for(var p in data){
				val = data[p];
				if(D.util.isPlainObject(val) || D.util.isArray(val)){
					var newProp = typeof prop === 'undefined' ? p : prop + '.' + p;
					this._loadViewModel(val, newProp);
				}else{
					this.watchDataObj.watchData[p] = data[p];
				}
			}
		}else if(D.util.isArray(data)){
			if(!prop){
				console.error('请求为加载的数据指属性');
			}else{
				//这里需要重新加载repeat
				D.util.setObjectProp(this.watchDataObj.watchData, prop, data);
				// this.watchDataObj.watchData[prop] = data;
			}
		}		
	},
	loadData: function(data, prop){
		this._loadViewModel(data, prop);
	},
	reloadData: function(){

	},
	getData: function(){

	},
	getSelectedData: function(){

	},
	getRawData: function(){

	},
	addData: function(){

	},
	removeData: function(){

	},
	clearData: function(){

	},
	updateData: function(data, prop){
		var val = null;
		if(D.util.isPlainObject(data)){
			for(var p in data){
				val = data[p];
				if(D.util.isPlainObject(val) || D.util.isArray(val)){
					var newProp = typeof prop === 'undefined' ? p : prop + '.' + p;
					this.loadData(val, newProp);
				}else{
					this.watchDataObj.watchData[p] = data[p];
				}
			}
		}else if(D.util.isArray(data)){
			if(!prop){
				console.error('请求为加载的数据指属性');
			}else{
				//这里需要重新加载repeat
				D.util.setObjectProp(this.watchDataObj.watchData, prop, data);
				// this.watchDataObj.watchData[prop] = data;
			}
		}		
	},
	reqData: function(url, data, CB){
		if(arguments.length == 1){
			CB = function(){};
			data = {};
		}else if(arguments.length == 2 && typeof data === 'function'){
			CB = data;
			data = {};
		}
		CB = CB || function(){};
		$.get(url, data, function(data){
			CB(data);
		}, 'json');
	},
	toJS: function(){

	},
	toJSON: function(){

	},
	toString: function(){

	},
	//增删改查服务器数据方案1
	dataReq: function(){

	},
	addDataReq: function(url, data, CB){
		this.reqData(url, data, CB);
	},
	saveDataReq: function(url, data, CB){
		this.reqData(url, data, CB);
	},	
	getDataReq: function(url, data, CB){
		var that = this;
		if(arguments.length == 1){
			data = {};
		}else if(arguments.length == 2 && typeof data === 'function'){
			CB = data;
			data = {};
		}
		CB = CB || function(data){
			that.loadData(data);
		}
		this.reqData(url, data, CB);
	},
	updateDataReq: function(){
		
	},
	removeDataReq: function(){
		
	},
	//增删改查服务器数据方案2
	insert: function(){
		
	},
	update: function(){
		
	},
	delete: function(){
		
	},
	query: function(){

	},
};/**
 * 
 * @authors Qmw (qmw920@163.com)
 * @date    2014-06-08 17:11:40
 * @version 0.0.1
 */

;(function(){
	function D(data, container){
		var $Q = this;
		var initData = null;
		var methods = null;
		var cloneData = D.util.clone(data);
		if(!cloneData.initData){
			cloneData = {
				initData: cloneData
			}
		}
		
		initData = cloneData.initData;
		this.extend(cloneData);//继承方法，后期去除initData

		container = container || 'body';
		this.container = $(container);		
		this.initData = D.util.clone(initData);
		this.extra = {};

		if(cloneData.template){
			D.util.placeAt(this.container, cloneData.template, cloneData.pos);
		}
		
		// dataManager.
		//转化监听数据
		var watchDataObj = this.watchDataObj = new WatchData(this.initData);
		var bindObj = new Bind();
		watchData = watchDataObj.watchData;
		watchDataObj.d = this;

		//dom绑定监听数据
		var bindSyntaxArr = [];
		this.parseElement(this.container, bindSyntaxArr);
		this.bindData(bindSyntaxArr, bindObj, watchDataObj, this);
		// this.addData(data);
	}

	D.util = new Util();
	D.util.extend(D, Emiter);

	D.extend({
		parseElement: function(elem, bindSyntaxArr){
			bindSyntaxArr = bindSyntaxArr || [];

			var that = this;
			var $elem = $(elem) || this.container || $('body');
			var hasParse = $elem.data('hasParse');
			if(!hasParse){//如果已解析过不在解析
				var hasChildData = this.parseDataBind($elem.get(0), bindSyntaxArr);
				$elem.data('hasParse', true);
			}
			if(hasChildData){//如果有子Data不解析，目前repeat时说明有
				return ;
			}
			$elem.children().each(function(){
				that.parseElement(this, bindSyntaxArr);
			});
		},
		parseDataBind: function(elem, bindSyntaxArr){
 			bindSyntaxArr = bindSyntaxArr || [];
 			var that = this;
			var attrs = elem.attributes;
			var key = '';
			var prop = '';
			var bindSyntaxObj = {
				elem: elem,
				bindSyntax: []
			};
			var bindSyntax = bindSyntaxObj.bindSyntax;
			var hasChildData = false;

			for(var a in attrs){
				if(attrs[a].nodeName && attrs[a].nodeName.indexOf('d-') === 0){
					key = attrs[a].nodeName.replace('d-', '');
					val = attrs[a].nodeValue;
					if(hasChildData === false && key === 'repeat'){
						hasChildData = true;
					}
					if(key && val){
						val = that.parseExp(val);
						if(typeof val === 'string'){
							bindSyntax.push({key: key, val: $.trim(val)});
						}else{
							bindSyntax.push({key: key, val: val});
						}
						
					}
				}
			}
			if(bindSyntax.length > 0){
				bindSyntaxArr.push(bindSyntaxObj);
			}
			return hasChildData;
		},
		parseExp: function(expStr){
			var exp = {};
			var reg = /((\w):(\w),?)*/g;
			var matchs = [];
			var m = null;
			var reg = /([^,:]+):([\w\W]*?)(,|$)/g;
			while((m = reg.exec(expStr)) != null){
				// console.log(m);
				matchs.push({key: $.trim(m[1]), val: $.trim(m[2])});
			}
			return matchs.length && matchs || expStr;

		},
		bindData: function(bindSyntaxArr, bindObj, watchDataObj){
			if(bindSyntaxArr.length === 0) return ;
			var that = this;
			bindSyntaxArr.forEach(function(item){
				
				var elem = item.elem;

				item.bindSyntax.forEach(function(childItem){
					var key = childItem.key;
					var val = childItem.val;					
					if(bindObj[key]){
						if(typeof val === 'string'){
							bindObj[key](val, elem, watchDataObj, that);
						}else{
							var o = val;
							switch(key){
								case 'event':
								case 'on':
									o.forEach(function(item){
										bindObj[item.key](item.val, elem, watchDataObj, that);
									});
									break;
								case 'one':
									o.forEach(function(item){
										bindObj[item.key](item.val, elem, watchDataObj, that, true);
									});
									break;
								case 'css':
								case 'style':
										var style = {};
										val.forEach(function(item){
											style[item.key] = item.val;
										});
										bindObj['style'](style, elem, watchDataObj, that);
									break;
								case 'attr':
										var attr = {};
										val.forEach(function(item){
											attr[item.key] = item.val;
										});
										bindObj['attr'](attr, elem, watchDataObj, that);										
									break;
								case 'class':
										var clsNames = {};
										val.forEach(function(item){
											clsNames[item.key] = item.val;
										});										
										bindObj['class'](clsNames, elem, watchDataObj, that);	
									break;
								default:

									if(bindObj[key]){
										if(D.util.type(val) === 'array'){
											var o = {};
											val.forEach(function(item){
												o[item.key] = item.val;
											});
											val = o;
										}										
										bindObj[key](val, elem, watchDataObj, that);											
									}
									break;

							}
						}
					}	
				});

							
			});
		}
	});

	
	// D.util.extend(D, WatchData);
	// D.util.extend(D, Bind);
	// D.util.include(D.prototype, DataManager.prototype);
	D.extend(DataManager.prototype);
	D.extend({AOP: new AOP()});
	// D.util.extend(D, ExpParser);

	D.dataBind = function(data, container){
		return new D(data, container);
	}

	window.D = D;
})();
;/**
 * 
 * @authors Qmw (qmw920@163.com)
 * @date    2014-06-08 17:11:40
 * @version 0.0.1
 */
function WatchData(data, triggerFlag){
	var that = this;
	var willWatchData = D.util.clone(data);
	this.rawData = D.util.clone(data);
	this.watchData = null;
	this.$watch = {};

	this.addWatchData(willWatchData, this.rawData, triggerFlag);

	// this.rawData = data;
	this.watchData = willWatchData;
	this.watchData.$rawData = this.rawData;
	this.watchData.$data = this.watchData;
	this.watchData.$parent = this.watchData;
	this.watchData.$root = this.watchData;
	this.watchData.$index = 0;
	this.watchData.$elem = 0;
	this.watchData.__watch__ = true;
	// this.watchData._QType_ = 'true';

	return this;
}

D.util.extend(WatchData, Emiter);

WatchData.prototype.toString = function(){
	return JSON.stringify(this.watchData);
}

//triggerFlag 1读时触发，0或未定义写时触发， 2读写都触发
WatchData.prototype.watch = function(watchData, data, prop, triggerFlag){
	var that = this;
	return function(){
		if(arguments.length === 0){
			try{
				if(triggerFlag === 1){
					that.execWatchCB(watchData, prop);
				}				
			}catch(e){
				throw e;
			}finally{
				return data[prop];
			}
		}

		if(arguments.length === 1){
			data[prop] = arguments[0];

			if(data[prop] != arguments[0]){
				data[prop] = arguments[0];
			}

			that.execWatchCB(watchData, prop);
		}
	}
}

WatchData.prototype.addWatchData = function(willWatchData, rawData, triggerFlag){
	var that = this;
	var computed = null;
	var prop = '';
	for(prop in willWatchData){
		if(typeof willWatchData[prop] !== 'function' && prop !== 'computed' && prop.indexOf('$') === -1){
			this.defineProperty(willWatchData, prop, this.watch(willWatchData, rawData, prop, triggerFlag));
		}
	}

	willWatchData.computed && this.computedWatchData(willWatchData, rawData, triggerFlag);
}

WatchData.prototype.defineProperty = function(data, prop, watchFun){
	Object.defineProperty(data, prop, {
		get: watchFun,
		set: watchFun
	});		
}

WatchData.prototype.addComputedWatchData = function(watchDataObj, evalFun, CB){
	var watchData = watchDataObj.watchData;
	var rawData = watchDataObj.rawData;
	this.tmpWatchDataProps = this.findWatchDataProps(rawData, evalFun);
	CB();

	this.tmpWatchDataProps.forEach(function(item){
		watchDataObj.addWatchCB(watchData, null, item, function(){
			CB();
		});		
	});
}

WatchData.prototype.computedWatchData = function(willWatchData, rawData, triggerFlag){
	var that = this;
	var computed = null;
	var prop = '';	
	computed = willWatchData.computed;
	delete willWatchData.computed;
	delete rawData.computed;

	if(D.util.isPlainObject(computed)){
		for(prop in computed){
			var computedVal = computed[prop];
			var computedGet = computedVal;
			var computedSet = null;
			willWatchData[prop] = '';
			rawData[prop] = '';	
			if(!D.util.isFunction(computedVal)){
				computedGet = computedVal.get;
				computedSet = computedVal.set;
			}

			(function(prop, computedGet){
				var firstEval = true;
				that.addComputedWatchData(that, computedGet, function(){
					var val = computedGet.call(willWatchData);
					if(firstEval){
						firstEval = false;
						rawData[prop] = val;
					}
					
					willWatchData[prop] = val;				
				});				
			})(prop, computedGet);			
			
			this.defineProperty(willWatchData, prop, this.watch(willWatchData, rawData, prop, triggerFlag));			
			
			if(computedSet){
				(function(prop, computedSet){
					that.addWatchCB(willWatchData, null, prop, function(){
						computedSet.call(willWatchData, rawData[prop]);
					});
				})(prop, computedSet);							
			}
		}	
	}		
}

WatchData.prototype.findWatchDataProps = function(data, computedFun){
	var watchDataObjNew = new WatchData(data, 1);
	var watchData = watchDataObjNew.watchData;
	var tmp = {};
	var tmpWatchDataProp = [];
	for(var p in watchData){
		(function(p){
			tmp[p] = {
				prop: p,
				CB: function(){
					tmpWatchDataProp.push(p);
				}
			};
		})(p);
		
		watchDataObjNew.addWatchCB(watchData, null, p, tmp[p].CB);				
	}
	// var val = this.createFunction(prop, null, watchDataObjNew);
	var val = computedFun.call(watchData, watchData);
	for(var p in tmp){
		watchDataObjNew.removeWatchCB(p, tmp[p].CB);
	}
	watchDataObjNew = null;
	watchData = null;
	tmp = null;
	return tmpWatchDataProp;
}

WatchData.prototype.addOneWatchData = function(willWatchData, rawData, prop){
	// Object.defineProperty(willWatchData, prop, {
	// 	get: this.watch(willWatchData, rawData, prop),
	// 	set: this.watch(willWatchData, rawData, prop)
	// });							
}

WatchData.prototype.removeWatchData = function(willWatchData, rawData, prop){
	// Object.defineProperty(willWatchData, prop, {
	// 	get: this.watch(willWatchData, rawData, prop),
	// 	set: this.watch(willWatchData, rawData, prop)
	// });							
}

WatchData.prototype.removeOneWatchData = function(willWatchData, rawData, prop){
	// Object.defineProperty(willWatchData, prop, {
	// 	get: this.watch(willWatchData, rawData, prop),
	// 	set: this.watch(willWatchData, rawData, prop)
	// });							
}

WatchData.prototype.execWatchCB = function(watchData, prop, data, e) {
	this.trigger(prop, data, e);
	// watchData.$watchCB = watchData.$watchCB || {};
	// watchData.$watchCB[prop] = watchData.$watchCB[prop] || [];

	// var cbs = watchData.$watchCB[prop];
	// for (var i = 0; i < cbs.length; i++) {
	// 	cbs[i].call();
	// }
}

WatchData.prototype.addWatchCB = function(watchData, elem, prop, CB){
	this.on(prop, CB);
	// watchData.$watchCB = watchData.$watchCB || {};
	// watchData.$watchCB[prop] = watchData.$watchCB[prop] || [];

	// watchData.$watchCB[prop].push(CB);
	// watchData.$watchCB[prop].push(function(){
	// 	$(elem).val(watchData[prop]);
	// });
}

WatchData.prototype.addOneWatchCB = function(watchData, elem, prop, CB){
	this.once(prop, CB);
	// watchData.$watchCB = watchData.$watchCB || {};
	// watchData.$watchCB[prop] = watchData.$watchCB[prop] || [];

	// watchData.$watchCB[prop].push(CB);
	// watchData.$watchCB[prop].push(function(){
	// 	$(elem).val(watchData[prop]);
	// });
}

WatchData.prototype.removeWatchCB = function(prop, CB){
	this.off(prop, CB);
}

WatchData.prototype.clearWatchCB =  function(){
	this.off();
}
;/**
 * 
 * @authors Qmw (qmw920@163.com)
 * @date    2014-06-08 17:11:40
 * @version 0.0.1+6
 */

function Bind(){
	this.tmpWatchDataProps = [];
}

Bind.prototype = {
	constructor: Bind,
	visible: function(prop, elem, watchDataObj){
		this.update(watchDataObj, prop, function(flag){
			var val = flag ? 'block' : 'none';
			$(elem).css('display', val);			
		});		
	},
	show: function(prop, elem, watchDataObj){
		this.visible(prop, elem, watchDataObj);
	},
	text: function(prop, elem, watchDataObj){
		this.update(watchDataObj, prop, function(val){
			$(elem).text(val);
		});	
		
	},
	html: function(prop, elem, watchDataObj){
		this.update(watchDataObj, prop, function(val){
			$(elem).html(val);
		});
	},
	class: function(prop, elem, watchDataObj){
		var that = this;
		for(var p in prop){
			(function(p){
				that.update(watchDataObj, prop[p], function(val){
					// $(elem).attr(p, val);
					var $elem = $(elem);
					if(val === true){
						$elem.addClass(p);
					}else{
						$elem.removeClass(p);
					}
				});
			})(p);
		}			
	},
	sdemocode: function(prop, elem, watchDataObj, d){
		var that = this;
		var val = prop.value;
		var type = (prop.type || 'html').replace(/^(\"|\')|(\"|\')$/g, '');
		// console.log(prop)
		var opt = {
			theme: 'night',
			lineNumbers: true,
			matchBrackets: true,
			keyMap: 'sublime',
			dragDrop: true,
			// extraKeys: {"Enter": "newlineAndIndentContinueComment"},
			// readOnly: true`
			theme: 'eclipse',
			// value: val
		};

		switch(type){
			case 'html':
				opt.mode = "htmlmixed";
				opt.tabMode = "indent";
				break;
			case 'js':
				opt.mode = "javascript";
				break;
			case 'css':
				opt.mode = "css";
				break;
		}

		// $(elem).val(watchDataObj.watchData[val]);
		// $(elem).on('change', function(){
			// watchDataObj.watchData[val] = this.value;
		// });

		this.update(watchDataObj, val, function(codeData){
			$(elem).val(codeData);
			if(d && d.editor && d.editor[val]){
				d.editor[val].getDoc().setValue(codeData);
			}
		});

		setTimeout(function(){
			d.editor = d.editor || {};
			if('currPanel' in watchDataObj.rawData){//css html js第一次显示时创建cm
				that.update(watchDataObj, 'currPanel && isShowSdemoEditor', function(data){
					if(data === true && watchDataObj.rawData.currPanel === type && !d.editor[type]){
						editor = CodeMirror.fromTextArea(elem, $.extend({}, opt));
						d.editor[type] = editor;					
					}				
				});				
			}else{//importFile 创建cm
				editor = CodeMirror.fromTextArea(elem, $.extend({}, opt));
				d.editor[type] = editor;				
			}
			

			// var evalFun = that.createEvalFun('currPanel');
			// watchDataObj.addComputedWatchData(watchDataObj, evalFun, function(){
			// 	var val = evalFun(watchDataObj.watchData);
			// 	if(val === type && !d.editor){
			// 		editor = CodeMirror.fromTextArea(elem, $.extend({}, opt));
			// 		d.editor = d.editor || {};
			// 		d.editor[type] = editor;					
			// 	}
			// });	
		}, 100);
	},
	sdemooutput: function(prop, elem, watchDataObj){
	
		this.update(watchDataObj, prop, function(val){
			var $iframe = $('<iframe src="about:blank" frameborder="0" style="width:100%; height:300px;"></iframe>');
			$(elem).html('').append($iframe);
			if($iframe[0].contentWindow == null){
				$iframe.load(function(){
					var watchData = watchDataObj.watchData;
					val = '';
					val += watchData.$parent.importFile;
					val += watchData.html;
					val += '<style>'+ watchData.css +'</style>';
					val += '<script type="text/javascript">'+ watchData.js +'</script>';					
					
					this.contentWindow.document.write(val);
				});
			}else{
				$iframe[0].contentDocument.write(val);
			}			
		});
	},
	sdemolistoutput: function(prop, elem, watchDataObj){
	
		this.update(watchDataObj, prop, function(val){
			// var sdemoCode = watchData.sdemoCodeList[0];
			var $iframe = $('<iframe src="about:blank" frameborder="0" style="width:100%; height:300px;"></iframe>');
			$(elem).html('').append($iframe);
			if($iframe[0].contentWindow == null){
				$iframe.load(function(){
					var watchData = watchDataObj.watchData;
					val = '';
					val += watchData.importFile;
					val += watchData.html;
					val += '<style>'+ watchData.css +'</style>';
					val += '<script type="text/javascript">'+ watchData.js +'</script>';					
					
					this.contentWindow.document.write(val);
				});
			}else{
				$iframe[0].contentDocument.write(val);
			}			
		});
	},	
	copycode: function(prop, elem, watchDataObj, d){
		var map = {
			html: true,
			css: true,
			js: true
		};
		
		this.update(watchDataObj, 'isShowSdemoEditor', function(data){
			if(data === true){
				$(elem).zclip('remove');
				$(elem).zclip({
			        path:'js/lib/ZeroClipboard.swf', //记得把ZeroClipboard.swf引入到项目中 
			        copy:function(){
						var copyVal = '';
						var watchData = watchDataObj.watchData;				
						if(map[watchData.currPanel]){
							copyVal = watchData[watchData.currPanel];
						}				        	
			            return copyVal;
			        },
			        afterCopy: function(copyVal){
			        	d.updateData({isCopied: true});
			        	setTimeout(function(){
							d.updateData({isCopied: false});
			        	}, 1000);
			        }
			    });				
			}
		});			


			
	},
	css: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		
	},
	style: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		$(elem).css(prop);
		
	},
	attr: function(prop, elem, watchDataObj){
		var that = this;
		for(var p in prop){
			(function(p){
				that.update(watchDataObj, prop[p], function(val){
					$(elem).attr(p, val);
				});
			})(p);
		}
	},

	value: function(prop, elem, watchDataObj){
		// var watchData = watchDataObj.watchData;
		// var $elem = $(elem);
		// $elem.val(watchData[prop]);
		// $elem.on('change', function(){
		// 	watchData[prop] = this.value;
		// });
		// watchDataObj.addWatchCB(watchData, $elem, prop, function(){
		// 	$elem.val(watchData[prop]);
		// });

		$(elem).on('change', function(){
			watchDataObj.watchData[prop] = this.value;
		});		

		this.update(watchDataObj, prop, function(val){
			$(elem).val(val);
		});			
	},
	checked: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		var val = watchData[prop];
		var $elem = $(elem);
		$elem.prop('checked', val);
		watchDataObj.addWatchCB(watchData, $elem, prop, function(){
			var val = watchData[prop];
			$elem.prop('checked', val);
		});
	},	
	disable: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		var val = watchData[prop];
		var $elem = $(elem);
		$elem.prop('disabled', val);
		watchDataObj.addWatchCB(watchData, $elem, prop, function(){
			var val = watchData[prop];
			$elem.prop('disabled', val);
		});
	},
	enable: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		var val = watchData[prop];
		var $elem = $(elem);
		$elem.prop('disabled', !val);
		watchDataObj.addWatchCB(watchData, $elem, prop, function(){
			var val = watchData[prop];
			$elem.prop('disabled', !val);
		});

	},
	hasFocus: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		var val = watchData[prop];
		var $elem = $(elem);
		var elem = $elem.get(0);
		if(val === true){
			elem.focus();
		}else{
			elem.blur();
		}
		watchDataObj.addWatchCB(watchData, $elem, prop, function(){
			var val = watchData[prop];
			var elem = $elem.get(0);
			if(val === true){
				elem.blur();
			}else{
				elem.focus();
			}
		});	
	},
	options: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		var val = watchData[prop];
		var $elem = $(elem);
		var textProp = watchData['optionsText'] || 'text';
		var str = '';
		val.forEach(function(item){
			str += '<option value="'+ item.value +'">'+ item.text +'</option>';
		});
		$elem.append(str);

		watchDataObj.addWatchCB(watchData, $elem, prop, function(){
			var val = watchData[prop];
			var elem = $elem.get(0);
			var textProp = watchData['optionsText'] || 'text';
			var str = '';
			val.forEach(function(item){
				str += '<option value="'+ item.value +'">'+ item.text +'</option>';
			});
			$elem.append(str);
		});			

	},
	optionsText: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;

	},
	optionsCaption: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;

	},
	selectedOptions: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;

	},
	uniqueName: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;

	},
	submit: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;

	},
	on: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
	},
	one: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
	},
	click: function(prop, elem, watchDataObj, runOne){
		var watchData = watchDataObj.watchData;
		var val = watchData[prop];
		var $elem = $(elem);
		var watchFunCB = runOne ? 'addOneWatchCB' : 'addWatchCB';
		$(elem).off(eventName);
		$(elem).on('click', function(e){
			watchDataObj.execWatchCB(watchData, prop, null, e);
		});

		watchDataObj[watchFunCB](watchData, $elem, prop, function(e){
			watchData[prop].call(watchDataObj.d, watchData, e);
		});		
	},
	event: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		
	},

	foreach: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		
	},
	repeat: function(prop, elem, watchDataObj, d){
		var $elem = $(elem);
		var $parent = $elem.parent();
		this.update(watchDataObj, prop, function(val){
			$parent.find('>[d-repeat='+ prop +']').remove();
			val.forEach(function(item, index){
				if(!item.__watch__){//如果已监听过数据，只更新
					var $newElem = $elem.clone();
					$newElem.data('hasParse', true);
					var t = D.dataBind(item, $newElem);
					var $elem2 = t.container;
					t.watchDataObj.watchData.$index = index;
					t.watchDataObj.watchData.$parent = watchDataObj.watchData;
					t.watchDataObj.watchData.$root = watchDataObj.$root;
					t.$parentD = d;
					val[index] = t.watchDataObj.watchData;
					//处理newElem后追加
					$parent.append($elem2);					
				}else{
					//更新itemData
				}
				
			});
			$elem.remove();
		});		

	},
	repeat_bak: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		var val = watchData[prop];
		var $elem = $(elem);
		var $parent = $elem.parent();
		val.forEach(function(item){
			var newElem = $elem.clone();
			//处理newElem后追加
			$parent.append(newElem);
		});
		
		watchDataObj.addWatchCB(watchData, $elem, prop, function(){
			var val = watchData[prop];
			val.forEach(function(item){
				var newElem = $elem.clone();
				//处理newElem后追加
				$parent.append(newElem);
			});
		});

	},
	if: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		var $elem = $(elem);
		var val = watchData[prop];
		var bak = $elem.html();
		if(val === true){
			$elem.html(bak);
		}else{
			$elem.html('');
		}
		watchDataObj.addWatchCB(watchData, $elem, prop, function(){
			var val = watchData[prop];
			if(val){
				$elem.html(bak);
			}else{
				$elem.html('');
			}
		});			
	},
	ifnot: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		var $elem = $(elem);
		var val = watchData[prop];
		var bak = $elem.html();
		if(val === false){
			$elem.html(bak);
		}else{
			$elem.html('');
		}
		watchDataObj.addWatchCB(watchData, $elem, prop, function(){
			var val = watchData[prop];
			if(!val){
				$elem.html(bak);
			}else{
				$elem.html('');
			}
		});		
		
	},
	with: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		
	},

	template: function(prop, elem, watchDataObj){
		var watchData = watchDataObj.watchData;
		
	},
	createEvalFun: function(prop){
		if(typeof prop === 'object'){
			prop = JSON.stringify(prop);
		}
		var funBody = '"user strict;"\n';
		funBody += 'var ____tmp____ = "";\n';
		// funBody += 'console.log(watchData)\n';
		funBody += 'with(watchData){\n';
		funBody += 		'try{\n';
		funBody += 			'____tmp____ = '+ prop +';\n';
		funBody += 		'}catch(e){\n';
		funBody += 			'console.error(e);\n';
		funBody += 			'debugger;\n';
		funBody += 		'}\n';
		funBody += '}\n';
		funBody += 'return ____tmp____;';
		
		var evalFun = new Function('watchData', funBody);
		return evalFun;
	},
	//多次使用with效率比较低，还容易造成内在泄漏，这里先用with发现用到的属性，然后再重新createEvalFun
	createEvalFun2: function(prop, watchDataObj){
		var funBody = '"user strict;"\n';
		funBody += 'var ____tmp____ = "";\n';

		funBody += 'with(watchData){____tmp____ = '+ prop +';}\n';
		funBody += 'return ____tmp____;\n';
		
		var evalFun = new Function('watchData', funBody);
		var watchDataProps = watchDataObj.findWatchDataProps(watchDataObj.rawData, evalFun);

		var funBody = '"user strict;"\n';

		watchDataProps && watchDataProps.forEach(function(item){
			funBody += 'var ' + item + '= watchData["'+ item +'"];\n';
		});
		
		funBody += 'return ' + prop + ';\n';		
		evalFun = new Function('watchData', funBody);

		return evalFun;
	},
	update: function(watchDataObj, prop, CB){
		var evalFun = this.createEvalFun(prop);
		watchDataObj.addComputedWatchData(watchDataObj, evalFun, function(){
			var val = evalFun(watchDataObj.watchData);
			CB(val);
		});		
	}
}

var bindProto = Bind.prototype;

// bindProto['text'] = {
// 	update: function(elem, watchDataObj, prop){
		
// 		this.update(watchDataObj, prop, function(val){
// 			$(elem).text(val);
// 		});
// 	}
// }


var allEvents = ['keyup', 'keydown', 'keypress', 'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];

allEvents.forEach(function(eventName){
	bindProto[eventName] = (function(eventName){
		return function(prop, elem, watchDataObj, d, runOne){
			// var watchData = watchDataObj.watchData;
			// $(elem).on(eventName, function(e){
			// 	watchData[prop].call(this, watchData, e);
			// });
			var watchData = watchDataObj.watchData;
			var val = watchData[prop];
			var $elem = $(elem);
			var watchFunCB = runOne ? 'addOneWatchCB' : 'addWatchCB';
			if(runOne){
				watchFunCB = 'addOneWatchCB';
				$(elem).off(eventName);
				$(elem).one(eventName, function(e){
					watchDataObj.execWatchCB(watchData, prop, null, e);
				});				
			}else{
				watchFunCB = 'addWatchCB';
				$(elem).off(eventName);
				$(elem).on(eventName, function(e){
					watchDataObj.execWatchCB(watchData, prop, null, e);
					e.preventDefault();
					e.stopPropagation();
					return false;
				});				
			}

			watchDataObj[watchFunCB](watchData, $elem, prop, function(data, e){
				var CB = D.util.getObjectProp(watchData, prop);
				if(typeof CB !== 'function'){
					console.error('此对象没有' + prop + '方法');
					throw '此对象没有' + prop + '方法';
				}

				CB.call(d.$parentD || d, watchData, e, d);
			});						
			// this.update(watchDataObj, prop, function(val){
			// 	$(elem).text(val);
			// });
		}

	})(eventName);
});;/**
 * 
 * @authors Qmw (qmw920@163.com)
 * @date    2014-06-08 17:11:40
 * @version 0.0.1
 */

function ExpParse(){

}

ExpParse.prototype = {
	constructor: ExpParse,
	parseExp: function(elem){
		var exp = {};
	}
}