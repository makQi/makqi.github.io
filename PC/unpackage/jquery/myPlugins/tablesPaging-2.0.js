
/**
 * tabCustomData: 自定义数据传入，向模板引擎传入数据
 * minWidth: 输入页码input初使宽度，是一个数字所占的宽度	默认值:11.38
 * pagingBtnBottom: 翻页是否始终在底部	默认值:true 
 * lineNum: 行数	默认值:8行
 * listNum: 列数	默认值:1列
 * autoHeight: 自动高度   默认值:false,  设置为：true时，lineNum属性不起做用
 * sort: false 	默认值:false
 * trHeight: tr标签高度	默认值:32
 * data: 数据
 * templateThead: 模版或字符串
 * templateTbody: 模版
 * titleName: [{name:表头th名称,datakey:对应数据key}]  template启用时titleName属性不起作用
 */

;(function($){
	$.fn.extend({
		'tablesPaging':function(options){
			var defaluts = {
				tabCustomData:null,
				minWidth:11.38,
				pagingBtnBottom:true,
				autoHeight:false,
				sort:false,
				listNum:1,
				lineNum:8,
				trHeight:32
			};
			var opts = $.extend({}, defaluts, options);
			return this.each(function(){
				var $this = $(this);
				var lineNum = opts.lineNum;
				var listNum = Math.abs(opts.listNum);

				var _html = '<div class="tables">'+
								'<ul class="clearfix"></ul>'+
								'<div style="width:100%;position:absolute;">'+
									'<div class="paging_box">'+
										'<div class="paging">'+
											'<button class="previous_page">上一页</button>'+
											'<span class="page_number">'+
												'<input class="min" type="number" title="点击可输入页码，然后请按Enter回车" value="1"></input>'+
												'/'+
												'<span class="max">1</span>'+
											'</span>'+
											'<button class="next_page">下一页</button>'+
										'</div>'+
										'<div class="record">共<span class="record_num">0</span>条记录</div>'+
									'</div>'+
								'</div>'+
							'</div>';
				var ulHtml = '';
				for(var i=0; i<listNum; i++){
					ulHtml+='<li><table><thead></thead><tbody></tbody></table></li>';
				}	
				$this.html(_html);
				$this.find('ul').html(ulHtml);
				if(listNum!=1){
					$this.find('li').css({
						'float':'left',
						'width':100/listNum-1+'%',
						'margin-left':listNum/(listNum-1)+'%',
						'box-sizing':'border-box'
					});
					$this.find('li:first-child').css('margin-left', 0);
				}
				if(opts.pagingBtnBottom){$this.find('.tables>div').css('bottom', 0);}

				var bodyH = $('body').height();
				var topH = $this.find('.tables').offset().top;
				var pagingBoxH = $this.find('.paging_box').outerHeight();
				var $li = $this.find('li');
				if(opts.autoHeight){lineNum = Math.floor((bodyH-pagingBoxH-topH)/opts.trHeight-1);}

				$this.find('.tables').height((lineNum+1)*opts.trHeight+pagingBoxH);
				$this.find('.min').width(opts.minWidth);
				$this.find('.max').text(Math.ceil(opts.data.length/(lineNum*listNum)));
				$this.find('.record_num').text(opts.data.length);
				$li.each(function(index, el) {	// 表头标题
					$(this).find('thead').html(baidu.template(opts.templateThead, {
						tabCustomData:opts.tabCustomData
					}));				
				});
				dataTreating(1);	// 初始化表格数据

				$this.find('.previous_page').click(function(){	// 上一页
					var $box = $(this).parents('.tables').parent();
					var pageNum = Number($box.find('.min').val());
					if(pageNum <= 1) {return;}
					$box.find('.min').val(--pageNum).width(opts.minWidth*pageNum.toString().length);
					dataTreating(pageNum);
				});
				$this.find('.next_page').click(function(){	// 下一页
					var $box = $(this).parents('.tables').parent();
					var pageNum = Number($box.find('.min').val());
					if(pageNum >= Number($box.find('.max').text())) {return;}
					$box.find('.min').val(++pageNum).width(opts.minWidth*pageNum.toString().length);
					dataTreating(pageNum);
				});
				$this.find('.min').on('input', function(){	// 输入页码翻页
					var $this = $(this);
					var max = Number($this.parent().children('.max').text());
					var val = Number($this.val());
					if(val<1){
						$this.val('');
						return;
					}else if(val>max){
						$this.val(max);
					}
					$this.width(opts.minWidth*$this.val().length);
				}).on('keydown', function(e){
					var $this = $(this);
					var page = $this.val();
					if(e.keyCode==13){
						if(page==''){
							$(this).val(1);
							dataTreating(1);
						}else{
							dataTreating(page);
						}
					}
				}).on('click', function(){
					$(this).val('').width(opts.minWidth);
				});

				if(opts.sort){	// 排序功能
					$li.find('th').click(function(){
						var $th_this = $(this);
						var key = $th_this.attr('data-sortkey');
						if(key==undefined||key==''){return;}
						if($th_this.hasClass('litre')){
							$th_this.addClass('drop').removeClass('litre');
							opts.data.reverse();
						}else if($th_this.hasClass('drop')){
							$th_this.addClass('litre').removeClass('drop');
							opts.data.reverse();
						}else {
							$th_this.addClass('litre').removeClass('drop');
							opts.data.sort(function(a, b){
								if(a[key]>b[key]){
									return 1;
								}else if(a[key]<b[key]){
									return -1;
								}else{
									return 0;
								}
							});
						}
						$th_this.siblings().removeClass('litre drop');
						$th_this.parents('li').siblings('li').find('th').removeClass('litre drop');
						if($th_this.hasClass('litre')){
							$th_this.parents('li').siblings('li').find('th[data-sortkey='+key+']').addClass('litre').removeClass('drop');
						}else{
							$th_this.parents('li').siblings('li').find('th[data-sortkey='+key+']').addClass('drop').removeClass('litre');
						}
						$this.find('.min').val(1);
						dataTreating(1);
					});
				}

				function dataTreating(pageNum){	// 数据处理
					var data = opts.data.slice((pageNum-1)*lineNum*listNum, (pageNum-1)*lineNum*listNum+lineNum*listNum);
					$li.each(function(index, el) {
						$(this).find('tbody').html(baidu.template(opts.templateTbody, {
							data:data.slice(index*lineNum, (index+1)*lineNum),
							tabCustomData:opts.tabCustomData
						}));
					});
				}

			});
		}
	});
})(jQuery);



/**
 * baiduTemplate简单好用的Javascript模板引擎 1.0.6 版本
 * http://baidufe.github.com/BaiduTemplate
 * 开源协议：BSD License
 * 浏览器环境占用命名空间 baidu.template ，nodejs环境直接安装 npm install baidutemplate
 * @param str{String} dom结点ID，或者模板string
 * @param data{Object} 需要渲染的json对象，可以为空。当data为{}时，仍然返回html。
 * @return 如果无data，直接返回编译后的函数；如果有data，返回html。
 * @author wangxiao 
 * @email 1988wangxiao@gmail.com
 */

 ;(function(window){
    var baidu = typeof module === 'undefined' ? (window.baidu = window.baidu || {}) : module.exports;
    baidu.template = function(str, data){
        var fn = (function(){
            if(!window.document){
                return bt._compile(str);
            };
            var element = document.getElementById(str);
            if (element) {                
                if (bt.cache[str]) {
                    return bt.cache[str];
                };
                var html = /^(textarea|input)$/i.test(element.nodeName) ? element.value : element.innerHTML;
                return bt._compile(html);
            }else{
                return bt._compile(str);
            };
        })();
        var result = bt._isObject(data) ? fn( data ) : fn;
        fn = null;
        return result;
    };
    var bt = baidu.template;
    bt.versions = bt.versions || [];
    bt.versions.push('1.0.6');
    bt.cache = {};  
    bt.LEFT_DELIMITER = bt.LEFT_DELIMITER||'<%';
    bt.RIGHT_DELIMITER = bt.RIGHT_DELIMITER||'%>';
    bt.ESCAPE = true;
    bt._encodeHTML = function (source) {
        return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/\\/g,'&#92;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
    };
    bt._encodeReg = function (source) {
        return String(source).replace(/([.*+?^=!:${}()|[\]/\\])/g,'\\$1');
    };
    bt._encodeEventHTML = function (source) {
        return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;')
        .replace(/\\\\/g,'\\')
        .replace(/\\\//g,'\/')
        .replace(/\\n/g,'\n')
        .replace(/\\r/g,'\r');
    };
    bt._compile = function(str){
        var funBody = "var _template_fun_array=[];\nvar fn=(function(__data__){\nvar _template_varName='';\nfor(name in __data__){\n_template_varName+=('var '+name+'=__data__[\"'+name+'\"];');\n};\neval(_template_varName);\n_template_fun_array.push('"+bt._analysisStr(str)+"');\n_template_varName=null;\n})(_template_object);\nfn = null;\nreturn _template_fun_array.join('');\n";
        return new Function("_template_object",funBody);
    };
    bt._isObject = function (source) {
        return 'function' === typeof source || !!(source && 'object' === typeof source);
    };
    bt._analysisStr = function(str){
        var _left_ = bt.LEFT_DELIMITER;
        var _right_ = bt.RIGHT_DELIMITER;
        var _left = bt._encodeReg(_left_);
        var _right = bt._encodeReg(_right_);
        str = String(str)          
        .replace(new RegExp("("+_left+"[^"+_right+"]*)//.*\n","g"), "$1")
        .replace(new RegExp("<!--.*?-->", "g"),"")
        .replace(new RegExp(_left+"\\*.*?\\*"+_right, "g"),"")
        .replace(new RegExp("[\\r\\t\\n]","g"), "")
        .replace(new RegExp(_left+"(?:(?!"+_right+")[\\s\\S])*"+_right+"|((?:(?!"+_left+")[\\s\\S])+)","g"),function (item, $1) {
            var str = '';
            if($1){
                str = $1.replace(/\\/g,"&#92;").replace(/'/g,'&#39;');
                while(/<[^<]*?&#39;[^<]*?>/g.test(str)){
                    str = str.replace(/(<[^<]*?)&#39;([^<]*?>)/g,'$1\r$2')
                };
            }else{
                str = item;
            }
            return str ;
        });
        str = str 
        .replace(new RegExp("("+_left+"[\\s]*?var[\\s]*?.*?[\\s]*?[^;])[\\s]*?"+_right,"g"),"$1;"+_right_)
        .replace(new RegExp("("+_left+":?[hvu]?[\\s]*?=[\\s]*?[^;|"+_right+"]*?);[\\s]*?"+_right,"g"),"$1"+_right_)
        .split(_left_).join("\t");
        if(bt.ESCAPE){
            str = str.replace(new RegExp("\\t=(.*?)"+_right,"g"),"',typeof($1) === 'undefined'?'':baidu.template._encodeHTML($1),'");
        }else{
            str = str.replace(new RegExp("\\t=(.*?)"+_right,"g"),"',typeof($1) === 'undefined'?'':$1,'");
        };
        str = str
        .replace(new RegExp("\\t:h=(.*?)"+_right,"g"),"',typeof($1) === 'undefined'?'':baidu.template._encodeHTML($1),'")
        .replace(new RegExp("\\t(?::=|-)(.*?)"+_right,"g"),"',typeof($1)==='undefined'?'':$1,'")
        .replace(new RegExp("\\t:u=(.*?)"+_right,"g"),"',typeof($1)==='undefined'?'':encodeURIComponent($1),'")
        .replace(new RegExp("\\t:v=(.*?)"+_right,"g"),"',typeof($1)==='undefined'?'':baidu.template._encodeEventHTML($1),'")
        .split("\t").join("');")
        .split(_right_).join("_template_fun_array.push('")
        .split("\r").join("\\'");
        return str;
    };
})(window);

