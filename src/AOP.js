function AOP(obj, method, CB, bindObj){
}

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

}