function Promise(){
	this.context = null;
	this.queues = [];
	this.doneQueue = [];
	this.failQueue = [];
	this.finallyQueue = [];
	this.allQueue = [];
	this.someQueue = [];
	this.anyQueue = [];
	this.args = [];
	this.argsCBPool = [];
	this.statusMap = {
		0: 'unfulfilled',
		1: 'resolved',
		2: 'rejected'
	};
	this.statusMapInversion = {
		unfulfilled: 0,
		resolved: 1,
		rejected: 2
	};
	this.status = this.statusMap.unfulfilled;
}

Promise.prototype = {
	constructor: Promise,
	isPromise: function(){
		return true;
	},
	when: function(){
		var that = this;
		if(arguments.length){
			var queues = Array.prototype.slice.call(arguments, 0);
			Array.prototype.push.apply(this.queues, queues);
			console.log('有队列queue');
			console.log(this);
			for(var i=0,len=queues.length;i<len;i++){
				var queue = queues[i];
				var promise = queue();
				if(promise && !promise.isPromise()){
					promise = promise.promise;
				}

				if(promise.isPromise()){
					(function(i){
						promise.addArgsCB(function(args){
							that.args[i] = args;
							return that;
						});						
					})(i);
					
				}				
			}
		}
	},
	then: function(done, fail){
		this.done(done);
		this.fail(done);	
	},
	resolve: function(){
		this.setStatus(this.statusMapInversion.rejected);
		this.currDoneCBArgs = Array.prototype.slice.call(arguments, 0);
		this.execArgsCB(this.currDoneCBArgs);
		// this.execQueue('done', this.args);
	},
	reject: function(){
		this.setStatus(this.statusMapInversion.rejected);
		this.execQueue('fail', arguments);
	},
	setStatus: function(status){
		this.status = status;
	},
	done: function(done){
		this.addQueue('done', done);	
	},
	fail: function(fail){
		this.addQueue('fail', fail);		
	},
	finally: function(finallyCB){
		this.addQueue('finally', finallyCB);		
	},	
	all: function(all){
		this.addQueue('all', all);		
	},
	some: function(some){
		this.addQueue('some', some);		
	},
	any: function(any){
		this.addQueue('any', any);
	},
	addQueue: function(queueName, CB){
		CB && this[queueName + 'Queue'].push(CB);
	},
	removeQueue: function(queueName, CB){
		CB && this[queueName + 'Queue'].push(CB);
	},
	execQueue: function(queueName, data){
		var queues = this[queueName + 'Queue'];
		var CB = null;
		while(CB = queues.shift()){
			CB.apply(this.context, data || []);
		}
	},
	handleQueue: function(){

	},
	addArgsCB: function(CB){
		this.argsCBPool = [CB];
	},
	execArgsCB: function(args){
		var promise = null;
		if(this.argsCBPool.length > 0){
			var argsCB = this.argsCBPool.pop();
			promise = argsCB(args);			
		}

		console.log(this === promise);

		promise.isAll = true;
		promise.isSome = false;
		promise.isAny = false;

		for(var i=0,len=promise.queues.length;i<len;i++){
			if(typeof promise.args[i] === 'undefined'){
				promise.isAll = false;
			}else{
				promise.isSome = true;
				promise.isAny = true;				
			}
		}

		if(promise.isAll){
			promise.execQueue('done', promise.args);
		}

		if(promise.isAny){
			promise.execQueue('any', promise.args);
		}
	}

};
