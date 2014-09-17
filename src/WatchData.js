/**
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
