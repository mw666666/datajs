/**
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
});