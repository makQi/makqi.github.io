﻿var mak = {};

// 中文字符转unicode码
mak.toUnicode = function(str){
	if(str == ''){return '请输入汉字';}
	var str =''; 
	for(var i=0;i<str.length;i++){
		str+="\\u"+parseInt(str[i].charCodeAt(0),10).toString(16);
	}
	return str.replace('/', '\\');
}
// 数组对象降序方法
mak.dropCompare = function(key){
	return function (a, b) {		// arr.sort(mak.dropCompare('key')) 排序
		a = a[key]!='undefined'?a[key]:a;		// arr.reverse() 反转数组
		b = b[key]!='undefined'?b[key]:b;
		if(a > b){
			return -1;
		}else if(a < b) {
			return 1;
		}else{
			return 0;
		}            
	} 
};
// 获取字符串的字节长度
mak.charsLen = function(str){
	var realLength = 0, len = str.length, charCode = -1;
	for (var i = 0; i < len; i++) {
		charCode = str.charCodeAt(i);
		if (charCode >= 0 && charCode <= 128) {
			realLength += 1;
		}else{
			realLength += 2;
		}
	}
	return realLength;
};
// 获取当前时间		参数时间链接符
mak.getCurrentTime = function(linkSymbol){
	var time = new Date();
	var timeObj = {
		'year':time.getFullYear().toString(),	// 年
		'month':time.getMonth()+1<10?'0'+(time.getMonth()+1):(time.getMonth()+1).toString(),	// 月
		'date':time.getDate()<10?'0'+time.getDate():time.getDate().toString(),	// 日
		'day':time.getDay().toString(),	// 星期中的第几天
		'hours':time.getHours().toString(),	// 小时
		'minutes':time.getMinutes().toString(),	// 分钟
		'seconds':time.getSeconds().toString(),	// 秒
		'millisecond':time.getMilliseconds().toString()	// 微秒
	}
	if(linkSymbol||linkSymbol==''){
		return timeObj.year+linkSymbol+timeObj.month+linkSymbol+timeObj.date;
	}else{
		return timeObj;
	}
};
// 获取相对路径返程方法
mak.getLinkPath = function(str){
	var url = document.location.toString();
	var arrUrl = url.split(str);
	var start = arrUrl[1].indexOf("/");
	var relUrl = arrUrl[1].substring(start);
	if(relUrl.indexOf("?") != -1){
		relUrl = relUrl.split("?")[0];
	}
	var l = relUrl.match(/\//g).length-1;
	var s="";
	var i=0;
	while(i<l){
		s+="../";
		i++;
	}
	return s;
};
// 时间差方法
mak.getDateDiff = function(endTime){
	if(typeof(endTime)=='string'&&endTime.indexOf('-')>-1){	// IE兼容处理
		endTime=endTime.replace(/-/g,'/');
	}
	var result;
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = now - new Date(endTime).getTime();
	if(diffValue < 0){return '本机时间有误';}
	var monthC = diffValue/month;
	var weekC = diffValue/(7*day);
	var dayC = diffValue/day;
	var hourC = diffValue/hour;
	var minC = diffValue/minute;
	if(monthC>=1){
		result="" + parseInt(monthC) + "月前";
	}else if(weekC>=1){
		result="" + parseInt(weekC) + "周前";
	}else if(dayC>=1){
		result=""+ parseInt(dayC) +"天前";
	}else if(hourC>=1){
		result=""+ parseInt(hourC) +"小时前";
	}else if(minC>=1){
		result=""+ parseInt(minC) +"分钟前";
	}else{
		result="刚刚";
	}
	return result;
};

// http://gosspublic.alicdn.com/aliyun-oss-sdk-4.4.4.min.js 引包
/*var client = new OSS.Wrapper({	// 上传图片方法
	region: 'oss-cn-beijing',
	accessKeyId: 'LTAI5UVyE7lQndTX',
	accessKeySecret: 'R3FZMMrxfJbmE0IO87pc8cpc7aU4gO',
	bucket: 'thfundfile'
});*/
// 判断上传文件格式
mak.checkFileExt = function(filename, e){	// 参数1：input.value,	event事件对像
	var flag = false; //状态
	var arr = ["ppt","docx","doc","xlsx","xls"];
	var index = filename.lastIndexOf(".");	//取出上传文件的扩展名
	var ext = filename.substr(index+1);
	for(var i=0;i<arr.length;i++){	//循环比较
	 	if(ext == arr[i]){	//一旦找到合适的，立即退出循环
		   flag = true; 
		   break;
		}
	}
	if(flag){	//条件判断
	 	console.log("文件名合法");
	 	var fileName = Date.now();
		var file = e.target.files[0];
		var storeAs = ''+fileName;
		client.multipartUpload(storeAs, file).then(function (result) {
			// console.log(result);
			console.log('http://thfundfile.oss-cn-beijing.aliyuncs.com/'+fileName);
		}).catch(function (err) {
			console.log(err);
		});
	}else{
	 	console.log("文件名不合法");
	}
}
// cookie过期时间，参数以天为单位 , 不传参数默认为7天
mak.cookieExpires = function(daysNum){
	if (!Date.now) {	// 兼容不支持该方法的引擎, 时间戳毫秒值
		Date.now = function now() {
			return new Date().getTime();
		};
	}
	var sExpires;
	daysNum = (daysNum!=undefined&&daysNum!=null&&daysNum!='')?daysNum:7;
	sExpires = daysNum*24*60*60*1000+Date.now();
	return new Date(sExpires);
}

var Http = {
	getUrlSearch: function(){	// 获取URL地址数据
		var arr = decodeURI(location.search).slice(1).split("&");
		var obj = {};
		for(var i=0;i<arr.length;i++){
			var a=arr[i].split("=");
			obj[a[0]]=a[1];
		}
		return obj;
	},
	getUrlParam: function(name) {	// 获取url的参数数据	 name:参数名称
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg);
		if (r != null){return unescape(r[2]);}
		return null;
	},
	rootPath: function() {			// 自动获取当前服务器IP,端口,主目录入口
		var pathName = window.location.pathname.substring(1);
		var webName = pathName == '' ? '' : pathName.substring(0, pathName
			.indexOf('/'));
		return window.location.protocol + '//' + window.location.host + '/'
		+ webName;
	}
};

var docCookies = {	// Document.cookie 读,写,删除工具方法
	getItem: function (sKey) {
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	},
	setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
		var sExpires = "";
		if (vEnd) {
			switch (vEnd.constructor) {
				case Number:
				sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
				break;
				case String:
				sExpires = "; expires=" + vEnd;
				break;
				case Date:
				sExpires = "; expires=" + vEnd.toUTCString();
				break;
			}
		}
		document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
		return true;
	},
	removeItem: function (sKey, sPath, sDomain) {
		if (!sKey || !this.hasItem(sKey)) { return false; }
		document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
		return true;
	},
	hasItem: function (sKey) {
		return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	},
	keys: function () {
		var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
			return aKeys;
	},
	expiresItem: function (sKey, daysNum) {		// cookie过期时间，参数以天为单位 , 不传参数默认为7天
		var sExpires;
		if (!Date.now) {	// 兼容不支持该方法的引擎, 时间戳毫秒值
			Date.now = function now() {
				return new Date().getTime();
			};
		}
		daysNum = (daysNum!=undefined&&daysNum!=null&&daysNum!='')?daysNum:7;
		sExpires = daysNum*24*60*60*1000+Date.now();
		this.setItem(sKey, this.getItem(sKey), new Date(sExpires));
	}
};
docCookies.setItem('github_user', 'makqi.github.io');
docCookies.expiresItem('github_user', 7);

// 数值转化成为货币格式
// 参数：保留小数位数，货币符号，整数部分千位分隔符，小数分隔符
// Number(123456.25687).formatMoney(3, '￥');
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var number = this,
	negative = number < 0 ? "-" : "",
	i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};
// 货币单位转换  num保留小数多少位，不输入默认保留2位。
Number.prototype.monetaryUnit = function(num){
	var res;
	var s = this.toString().split(".")[0].length;
	var unit = s>8?"亿元":s>4?"万元":"元";
	var num = num==undefined?2:num;
	switch (unit) {
		case "亿元":
			res = this/100000000;
			break;
		case "万元":
			res = this/10000;
			break;
		case "元":
			res = this/1
			break;
		default:
			break;
	}
	return res.toFixed(num)+unit;
}
// 数组去重
Array.prototype.removeWeight = function(key){
	var newArr = [];
	if(key){
		var json={};
		for(var i=0; i<this.length; i++){
			var k=this[i][key];
			if(!json[k]){
				newArr.push(this[i]);
				json[k] = 1;
			}
		}
		return newArr;
	}else{
		for(var i=0; i<this.length; i++){
			if(newArr.indexOf(this[i])==-1){
				newArr.push(this[i]);
			}
		}
		return newArr;
	}
}



// 加密与解密
function Base64() {
 
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
	// 加密
	this.encode = function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}
 
	// 解密
	this.decode = function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}
 
	// utf - 8编码的方法
	_utf8_encode = function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
		return utftext;
	}
 
	// utf - 8编码解码方法
	_utf8_decode = function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}
