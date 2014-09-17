/**
 * 
 * @authors Qmw (qmw920@163.com)
 * @date    2014-06-08 17:11:40
 * @version 0.0.1
 */

(function(){
	function D(data, container){
		var $Q = this;
		container = container || 'body';
		this.initData = data;
		// dataManager.
		var watchData = this.watchData(this.initData);
		this.container = $(container);

		this.container.children().each(function(){
			var $this = $(this);
			var expStr = $(this).attr('data-bind');
			if(expStr){
				expStr.replace(/(\w+): (\w+)/, function(m, key, prop){
					if($Q[key]){
						$Q[key](prop, $this, watchData);
					}
					// switch(key){
					// 	case 'value':
					// 		// $this.val(watchData[prop]);
					// 		// $this.on('change', function(){
					// 		// 	watchData[prop] = this.value;
					// 		// });
					// 		// $Q.addWatch(watchData, $this, prop);
					// 		$Q.value(prop, $this, watchData);
							
					// 		break;
					// 	case 'click':
					// 		$this.on('click', function(){
					// 			watchData[prop].call(this, watchData);
					// 		});
					// 		break;
					// }
				});
			}
		});

		this.parseElement(this.container);
		// this.addData(data);
	}

	var dataBind = {
		value: function(prop, elem, watchData){
			var $Q = this;
			var $elem = $(elem);
			$elem.val(watchData[prop]);
			$elem.on('change', function(){
				watchData[prop] = this.value;
			});
			$Q.addWatch(watchData, $elem, prop, function(){
				$elem.val(watchData[prop]);
			});
		},
		click: function(prop, elem, watchData){
			$(elem).on('click', function(){
				watchData[prop].call(this, watchData);
			});
		},
		visible: function(prop, elem, watchData){
			var $Q = this;
			var val = watchData[prop] ? '' : 'none';
			var $elem = $(elem);
			$elem.css('display', val);
			$Q.addWatch(watchData, $elem, prop, function(){
				var val = watchData[prop] ? '' : 'none';
				$elem.css('display', val);
			});
		},
		enable: function(prop, elem, watchData){
			var $Q = this;
			var val = watchData[prop];
			var $elem = $(elem);
			$elem.prop('disabled', val);
			$Q.addWatch(watchData, $elem, prop, function(){
				var val = watchData[prop];
				$elem.prop('disabled', val);
			});
		},
		checked: function(prop, elem, watchData){
			var $Q = this;
			var val = watchData[prop];
			var $elem = $(elem);
			$elem.prop('checked', val);
			$Q.addWatch(watchData, $elem, prop, function(){
				var val = watchData[prop];
				$elem.prop('checked', val);
			});
		}
	}

	function Emiter(){
		this.events = [];
	}


	Emiter.prototype = {
		trigger: function(){

		},
		emit: function(){

		},
		on: function(){

		},
		off: function(){

		},
		once: function(){

		},
	}

	D.utils = (function(){

		return {
			array: {

			},
			type: {

			},
			isXXX: {

			},
			extend: function(subObj, superObj){
				for(var prop in superObj){
					if(!subObj.hasOwnProperty(prop)){
						subObj[prop] = superObj[prop];
					}
				}
			},

		}
	})();

	function watchFun(watchData, data, prop){

		return function(){
			if(arguments.length === 0){
				return data[prop];
			}

			if(arguments.length === 1){
				data[prop] = arguments[0];

				if(data[prop] != arguments[0]){
					data[prop] = arguments[0];
				}

				watchData.$watchCB = watchData.$watchCB || {};
				watchData.$watchCB[prop] = watchData.$watchCB[prop] || [];

				var cbs = watchData.$watchCB[prop];
				for(var i=0;i<cbs.length;i++){
					cbs[i].call();
				}
				
			}
		}
	}

	var watchManager = {
		watch: function(watchData, data, prop){
			var that = this;
			return function(){
				if(arguments.length === 0){
					return data[prop];
				}

				if(arguments.length === 1){
					data[prop] = arguments[0];

					if(data[prop] != arguments[0]){
						data[prop] = arguments[0];
					}

					that.execWatch(watchData, prop);

					// watchData.$watchCB = watchData.$watchCB || {};
					// watchData.$watchCB[prop] = watchData.$watchCB[prop] || [];

					// var cbs = watchData.$watchCB[prop];
					// for(var i=0;i<cbs.length;i++){
					// 	cbs[i].call();
					// }

					
				}
			}
		},
		execWatch: function(watchData, prop) {
			watchData.$watchCB = watchData.$watchCB || {};
			watchData.$watchCB[prop] = watchData.$watchCB[prop] || [];

			var cbs = watchData.$watchCB[prop];
			for (var i = 0; i < cbs.length; i++) {
				cbs[i].call();
			}
		},
		addWatch: function(watchData, elem, prop, CB){
			watchData.$watchCB = watchData.$watchCB || {};
			watchData.$watchCB[prop] = watchData.$watchCB[prop] || [];

			watchData.$watchCB[prop].push(CB);
			// watchData.$watchCB[prop].push(function(){
			// 	$(elem).val(watchData[prop]);
			// });
		},
		removeWatch: function(){

		},
		clearWatch: function(){
			
		}
	}

	var dataManager = {
		watchData: function(data){
			var that = this;
			var watchData = Object.create(data);
			this.$watch = {};
			for(var prop in watchData){
				(function(prop){
					that.$watch[prop] = function(){
						return that.watch.apply(that, arguments);
					};
					Object.defineProperty(watchData, prop, {
						get: that.$watch[prop](watchData, data, prop),
						set: that.$watch[prop](watchData, data, prop)
					});
				})(prop);
				
			}
			this.rawData = data;
			this.watchData = watchData;
			this.watchData._QType_ = 'true';

			watchData.toString = function(){
				return JSON.stringify(data);
			}
			return watchData;
		},
		getWatchData: function(){

		},
		initData: function(){

		},
		getInitData: function(){

		},
		loadData: function(){

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
		updateData: function(){

		},
		saveData: function(){

		},
		reqData: function(){

		},
		toJS: function(){

		},
		toJSON: function(){

		}
	}

	D.prototype = {
		constructor: D,
		parseElement: function(elem){
			var that = this;
			var $container = $(elem);
			$container.each(function(elem){
				if($(this).attr('data-bind')){
					that.parseExp($(this).attr('data-bind'));
				}
			});
		},
		parseExp: function(expStr){
			var exp = {};

		},

	}

	D.utils.extend(D.prototype, dataManager);
	D.utils.extend(D.prototype, watchManager);
	D.utils.extend(D.prototype, dataBind);

	D.dataBind = function(data, container){
		return new D(data, container);
	}

	window.D = D;
})();
