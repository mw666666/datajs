/**
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
