/**
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
}