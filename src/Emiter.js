/**
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
