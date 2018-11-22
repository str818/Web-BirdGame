/**
 * 日历类
 * @version 9
 * @datetime 2016-02-16 17:47
 * @author skey_chen
 * @copyright 2011-2016 &copy; skey_chen@163.com
 * @license LGPL
 */
var $jskey = $jskey || {};


;!function(){"use strict";



//内部自定义参数
//根据id获得元素
$jskey.$ = function(id){
	return document.getElementById(id);
};
//判断是否dom
$jskey.$isDOM = (typeof HTMLElement === 'object')?function(o){return o instanceof HTMLElement;}:function(o){return o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string';};
//根据tagName获得元素数组
$jskey.$byTagName = function(name){
	return document.getElementsByTagName(name);
};
$jskey.$replace = function(str, t, u){
	str = str + "";
	var i = str.indexOf(t);
	var r = "";
	while(i != -1){
		r += str.substring(0, i) + u;//已经匹配完的部分+替换后的字符串
		str = str.substring(i + t.length, str.length);//未匹配的字符串内容
		i = str.indexOf(t);//其余部分是否还包含原来的str
	}
	r = r + str;//累加上剩下的字符串
	return r;
};

$jskey.$link = function(path){
    var k = document.createElement("link");
    k.rel = "stylesheet";
    k.type = "text/css";
    k.href = path;
    document.getElementsByTagName("head")[0].appendChild(k);
    k = null;
};



$jskey.$src = $jskey.$replace($jskey.$byTagName("script")[$jskey.$byTagName("script").length - 1].src + "", "\\", "/");
//当前此js文件的目录路径
$jskey.$path = $jskey.$src.substring(0, $jskey.$src.lastIndexOf("/") + 1);
try{if($jskey.$path.length>7 && $jskey.$path.substring($jskey.$path.length-7)!="/jskey/"){$jskey.$path="/web/js/jskey/";}}catch(e){}




$jskey.$CalendarLang = {};


$jskey.Calendar = function(){
	this.d = new Date();// 临时变量
	this.$p = {
		"min":"0100-01-01 00:00:00",// 默认的初始化年份个数
		"max":"9999-12-31 23:59:59",
		"cy":this.d.getFullYear(),//当前年
		"cM":this.d.getMonth(),//当前月
		"cd":this.d.getDate()//当前日
	};
	// 记录当前需要显示的月历，需要$reset初始化
	this.$s = {
		//"y":this.$p.begin,"M":1,"d":1,"H":1,"m":1,"s":1
	};
	this.v = "jskey_cal";
	this.$k = {
		"div"  :this.v + "_a",//Container最外围容器
		"panel":this.v + "_b",//容器
		"date" :this.v + "_c",//Table
		"show" :this.v + "_d",//弹出层
		"x"    :this.v + "_e",//弹出层关闭
		"title":this.v + "_f",//弹出层标题
		"data" :this.v + "_g",//弹出层数据
		
		"prevY":this.v + "_py",//PrevYear
		"nextY":this.v + "_ny",//NextYear
		"prevP":this.v + "_pp",//PrevPageYear
		"nextP":this.v + "_np",//NextPageYear
		"prevM":this.v + "_pm",//PrevMonth
		"nextM":this.v + "_nm",//NextMonth

		"y"    :this.v + "_y",//CurrYear
		"M"    :this.v + "_nn",//Iuput CurrMonth
		"H"    :this.v + "_H",//Hour
		"m"    :this.v + "_m",//Minute
		"s"    :this.v + "_s",//Second
		
		"clear":this.v + "_i",//Clear
		"ok"   :this.v + "_j",//OK
		"close":this.v + "_k" //Close
	};
	this.$c = {
		"format":"yyyy-MM-dd",//yyyy-MM-dd HH:mm:ss
		//"min":null,//等待初始化new Date( 100,  0,  1,  0,  0,  0),
		//"max":null,//等待初始化new Date(9999, 11, 31, 23, 59, 59),
		"lang":"zh-CN",
		"left":0,
		"top":0,
		"level":4//复位相对于show值为yyyy-MM-dd(yyyy6-MM5-dd4 HH3:mm2:ss1)
	};
	//public 初始化
	this.$focus = false;//是否为焦点
	this.$input = null;
	this.$div = null;//因为ie下需要增加iframe才能置顶，所以它放了日历容器和frame，顺便用于控制是否显示
	this.$panel = null;//div容器中实际的日历div
	this.$sel = null;// 当前被选中的td单元格
};



$jskey.Calendar.prototype = {
	// 与jskey有关的函数调用
	$:function(i){
		return $jskey.$(i);
	},
	$skin:function(n){
		$jskey.$link($jskey.$path + "themes/calendar/" + n + "/skin.css");
	},
	//绑定数据到月视图
	$bindData:function(){
		var E = this;
		var S = E.$s, I = E.$c.min, A = E.$c.max;
		E.$(E.$k.show).style.display = "none";
		E.$recovery();
		
		var dateArray = E.$getViewArray(E.$int(S.y), E.$int(S.M));
		var tds = E.$(E.$k.date).getElementsByTagName("td");// 去掉了th的标题头了
		for(var i = 0;i < tds.length;i++){
			var z = tds[i];
			z.onclick = z.onmouseover = z.onmouseout = function(){};//  还原
			z.setAttribute("otd", "");//  还原
			var v = dateArray[i];
			z.innerHTML = v;
			if(v < 0){
				z.className = "";
				z.innerHTML = -v;
				if(v < -20){// 肯定是上一月(-22 > v > -32)
					var y = S.y, M = S.M;
					M--;
					if(M == -1){
						y--;
						M = 11;
					}
					if(E.$checkDate(4, {y:y,M:M,d:-v})){
						z.setAttribute("otd", "x");
						z.className = z.getAttribute("tn") == "tdDay" ? "hday" : "hholiday";
						E.$onMouse(z);
						if(E.$c.level == 4){// 如果级别为日，点击直接返回
							z.onclick = function(){
								E.$s.d = this.innerHTML;// 设置为新的日
								E.goPrevMonth(E);
								E.$recovery();
								E.$(E.$k.ok).click();// 如果级别为日，点击直接返回
							};
						}
						else{
							z.onclick = function(){
								E.$s.d = this.innerHTML;// 设置为新的日
								E.goPrevMonth(E);
								E.$recovery();
								E.$bindData();// 如果级别不为日，点击刷新视图
							};
						}
					}
				}
				else{// 肯定是下一月(0 > v > -15)
					var y = S.y, M = S.M;
					M++;
					if(M > 11){
						y++;
						M = 0;
					}
					if(E.$checkDate(4, {y:y,M:M,d:-v})){
						z.setAttribute("otd", "x");
						z.className = z.getAttribute("tn") == "tdDay" ? "hday" : "hholiday";
						E.$onMouse(z);
						if(E.$c.level == 4){// 如果级别为日，点击直接返回
							z.onclick = function(){
								E.$s.d = this.innerHTML;// 设置为新的日
								E.goNextMonth(E);
								E.$recovery();
								E.$(E.$k.ok).click();// 如果级别为日，点击直接返回
							};
						}
						else{
							z.onclick = function(){
								E.$s.d = this.innerHTML;// 设置为新的日
								E.goNextMonth(E);
								E.$recovery();
								E.$bindData();// 如果级别不为日，点击刷新视图
							};
						}
					}
				}
			}
			else if(!(E.$checkDate(4, {y:S.y,M:S.M,d:v}))){
				z.className = "";
			}
			else{
				z.className = (z.getAttribute("tn") == "tdDay")?"day":"holiday";
				z.isToday = false;//初始化
				if(E.$p.cy == S.y && E.$p.cM == S.M && E.$p.cd == v){
					z.className = "today";
					z.isToday = true;//是今天的单元格
				}
				//是已被选中的单元格，只要天数对上了即可
				if(S.d == v){
					z.className = "sel";
					E.$sel = z;//记录已选中的日子
				}
				//显示级别为日时，当选择日期时，点击格子即返回值
				if(E.$c.level == 4){
					z.onclick = function(){
						E.$s.d = this.innerHTML;// 设置为新的日
						E.$recovery();
						E.$(E.$k.ok).click();
					};
				}
				else{
					z.onclick = function(){
						if(E.$sel != null){
							var t = "day";
							//清除已选中的背景色
							if(E.$sel.isToday){
								t = "today";
							}
							else{
								if(E.$sel.getAttribute("tn") != "tdDay"){
									t = "holiday";
								}
							}
							E.$sel.className = t;
						}
						this.className = "sel";
						E.$s.d = this.innerHTML;// 设置为新的日
						E.$recovery();
						E.$sel = this;//记录已选中的日子（如果recovery后，当前日变得不可选，是会有问题的，不过现在限制好，不会有这个问题）
					};
				}
				E.$onMouse(z);
			}
		}
	},
	//焦点转移时隐藏日历
	$blur:function(){
		if(!(this.$focus)){this.$hide();}
	},
	$checkDate:function(t, o){
//		//算法一，没对象开销，但代码量多了一点点
//		var I = this.$c.min, A = this.$c.max;
//		switch(t)
//		{
//			case 1:if((I.y == o.y && o.M == I.M && o.d == I.d && o.H == I.H && o.m == I.m && o.s < I.s) || (A.y == o.y && A.M == o.M && A.d == o.d && A.H == o.H && A.m == o.m && A.s < o.s)){return false;}
//			case 2:if((I.y == o.y && o.M == I.M && o.d == I.d && o.H == I.H && o.m < I.m) || (A.y == o.y && A.M == o.M && A.d == o.d && A.H == o.H && A.m < o.m)){return false;}
//			case 3:if((I.y == o.y && o.M == I.M && o.d == I.d && o.H < I.H) || (A.y == o.y && A.M == o.M && A.d == o.d && A.H < o.H)){return false;}
//			case 4:if((I.y == o.y && o.M == I.M && o.d < I.d) || (A.y == o.y && A.M == o.M && A.d < o.d)){return false;}
//			case 5:if((I.y == o.y && o.M < I.M) || (A.y == o.y && A.M < o.M)){return false;}
//		}
//		if(o.y < I.y || A.y < o.y){return false;}
//		return true;

//		//算法二
		var I = this.$c.min, A = this.$c.max, x = {M:0,d:1,H:0,m:0,s:0}, i = {M:0,d:1,H:0,m:0,s:0}, a = {M:0,d:1,H:0,m:0,s:0};
		switch(t){
			case 1:x.s = o.s; i.s = I.s, a.s = A.s;
			case 2:x.m = o.m; i.m = I.m, a.m = A.m;//分忽略以上
			case 3:x.H = o.H; i.H = I.H, a.H = A.H;//时忽略以上
			case 4:x.d = o.d; i.d = I.d, a.d = A.d;//日忽略以上
			case 5:x.M = o.M; i.M = I.M, a.M = A.M;//月忽略以上
		}
		var di=(new Date(I.y, i.M, i.d, i.H, i.m, i.s)).valueOf();
		var da=(new Date(A.y, a.M, a.d, a.H, a.m, a.s)).valueOf();
		var d =(new Date(o.y, x.M, x.d, x.H, x.m, x.s)).valueOf();
		return di <= d && d <= da;
	},
	$draw:function(){
		var E = this;
		var K = this.$k, L = $jskey.$CalendarLang[E.$c.lang], a = [];
		a.push('<div style="z-index:10000;">');
		//start
		//------------------------------放置年、月按钮------------------------------
		a.push('<div class="dymd div">');
		a.push('<div class="dy">');
		a.push('<div id="' + K.prevY + '" class="btn dp"><div class="jsarr"><div class="left"></div></div></div>');
		a.push('<div id="' + K.y + '" class="btn year"></div>');
		a.push('<div id="' + K.nextY + '" class="btn dn"><div class="jsarr"><div class="right"></div></div></div>');
		a.push('</div>');
		a.push('<div class="dm"' + (E.$c.level>5?' style="display:none;"':'') + '>');//精确到年时隐藏“月”
		a.push('<div id="' + K.prevM + '" class="btn dp"><div class="jsarr"><div class="left"></div></div></div>');
		a.push('<div id="' + K.M + '" class="btn month"></div>');
		a.push('<div id="' + K.nextM + '" class="btn dn"><div class="jsarr"><div class="right"></div></div></div>');
		a.push('</div>');
		a.push('</div>');
		//------------------------------放置日期------------------------------
		a.push('<div class="date div">');
		//精确到年、月时隐藏“天”
		a.push('<table id="' + K.date + '" style="display:' + (E.$c.level >= 5 ? 'none' : '') + ';">');
		a.push('<tr>');
		for( var i = 0;i < 7;i++){
			a.push('<th class="title">' + L.w[i] + '</th>');
		}
		a.push('</tr>');
		for( var i = 0;i < 6;i++){
			a.push('<tr>');
			for( var j = 0;j < 7;j++){
				if(j == 0 || j == 6){
					a.push('<td tn="tdHoliday"></td>');
				}
				else{
					a.push('<td tn="tdDay"></td>');
				}
			}
			a.push('</tr>');
		}
		a.push('</table>');
		
		//放置弹层------------------------------
		a.push('<div id="' + K.show + '" class="choose">');
		a.push('<div class="title"><div id="' + K.x + '" class="close" style="float:right;">×</div><div>&nbsp;<span id="' + K.title + '"></span>&nbsp;</div></div>');
		a.push('<div id="' + K.data + '"></div>');
		a.push('</div>');

		a.push('</div>');
		
		//------------------------------放置按钮------------------------------
		a.push('<div class="dhmsbtn div">');
		
		//放置时间------------------------------
		a.push('<div class="dhms">');
		a.push('<label' + (E.$c.level > 3 ? ' style="display:none;"' : '') + '>' + L.t[0] + '</label>');
		a.push('<label' + (E.$c.level > 3 ? ' style="display:none;"' : '') + '><div id="' + K.H + '" class="btn"></div>' + L.t[3] + '</label>');
		a.push('<label' + (E.$c.level > 2 ? ' style="display:none;"' : '') + '><div id="' + K.m + '" class="btn"></div>' + L.t[2] + '</label>');
		a.push('<label' + (E.$c.level > 1 ? ' style="display:none;"' : '') + '><div id="' + K.s + '" class="btn"></div>' + L.t[1] + '</label>');
		a.push('</div>');

		a.push('<div class="dbtn">');
		a.push('<div id="' + K.clear + '" class="btn">' + L.b[1] + '</div>');
		a.push('<div id="' + K.ok    + '" class="btn">' + L.b[0] + '</div>');
		a.push('<div id="' + K.close + '" class="btn">' + L.b[2] + '</div>');
		a.push('</div>');
		
		a.push('</div>');
		
		//end
		a.push('</div>');
		
		E.$panel.innerHTML = a.join("");
		//事件注册
		E.$(K.prevY).onclick = function(){E.goPrevYear(E);E.$bindData();};//上一年
		E.$(K.nextY).onclick = function(){E.goNextYear(E);E.$bindData();};//下一年
		E.$(K.prevM).onclick = function(){E.goPrevMonth(E);E.$bindData();};//上一月
		E.$(K.nextM).onclick = function(){E.goNextMonth(E);E.$bindData();};//下一月
		E.$(K.y).onclick = function(){E.$drawChoose(6, E.$s.y);};//年
		E.$(K.M).onclick = function(){E.$drawChoose(5);};//月
		E.$(K.H).onclick = function(){E.$drawChoose(3);};//时
		E.$(K.m).onclick = function(){E.$drawChoose(2);};//分
		E.$(K.s).onclick = function(){E.$drawChoose(1);};//秒
		E.$(K.x).onclick = function(){E.$(E.$k.show).style.display = "none";};//关闭X
		
		E.$(K.clear).onclick = function(){E.$return("");};//清空
		E.$(K.close).onclick = function(){E.$hide();};//关闭
		E.$(K.ok).onclick = function(){E.$return(E.$format(new Date(E.$s.y, E.$s.M, E.$s.d, E.$s.H, E.$s.m, E.$s.s), E.$c.format));};//确定
	},
	$drawChoose:function(t, year){
		var E = this;
		var S = E.$s, o = E.$(E.$k.data), L = $jskey.$CalendarLang[E.$c.lang], a = [];
		a.push('<table>');
		if(t < 4 && t > 0){
			var m = 10;//分钟2和秒钟1
			if(t == 3){m = 4}//时钟3
			for( var i = 0;i < 6;i++){
				a.push('<tr>');
				for( var j = 0;j < m;j++){
					a.push('<td cv="' + (i*m+j) + '">' + E.$fnNum(i*m+j) + '</td>');
				}
				a.push('</tr>');
			}
		}
		else if(t == 5){// 月5
			var m = 2;
			for( var i = 0;i < 6;i++){
				a.push('<tr>');
				for( var j = 0;j < m;j++){
					a.push('<td cv="' + (i*m+j) + '">' + L.M[(i*m+j)] + '</td>');//cv从0开始
				}
				a.push('</tr>');
			}
		}
		else{// 年6
			var m = 4, y = E.$int(E.$fnYear(year).substr(0, 3))*10;
			y = y%20 == 10 ? y-10 : y;
			for( var i = 0;i < 5;i++){
				a.push('<tr>');
				for( var j = 0;j < m;j++){
					a.push('<td cv="' + (y+i*m+j) + '">' + E.$fnYear(y+i*m+j) + '</td>');
				}
				a.push('</tr>');
			}
			a.push('<tr>');
			a.push('<td colspan="2" class="day" cv="' + (y-20)+ '" id="' + E.$k.prevP + '"><div class="jsarr"><div class="up"></div></div></td>');
			a.push('<td colspan="2" class="day" cv="' + (y+20) + '" id="' + E.$k.nextP + '"><div class="jsarr"><div class="down"></div></div></td>');
			a.push('<tr>');
		}
		a.push('</table>');
		E.$(E.$k.title).innerHTML = L.f[t];
		o.innerHTML = a.join("");
		var tds = E.$(E.$k.data).getElementsByTagName("td");
		for(var i = 0;i < tds.length;i++){
			var z = tds[i];
			var v = E.$int(z.getAttribute("cv")), q=-1;// vq用于处理选中格子
			if(t == 6){
				var _id = z.getAttribute("id") || "";
				if(_id == E.$k.prevP || _id == E.$k.nextP){
					var _j = E.$int(z.getAttribute("cv"));
					if((_id == E.$k.prevP && (_j >= E.$c.min.y || E.$c.min.y <= (_j + 19))) || (_id == E.$k.nextP && _j <= E.$c.max.y)){
						z.onclick = function(){
							E.$drawChoose(6, this.getAttribute("cv"));
						};
						E.$onMouse(z);
					}
				}
				else{
					q = E.$s.y;
					if(E.$checkDate(6, {y:v})){
						z.className = "day";
						z.onclick = function(){
							E.$s.y = this.getAttribute("cv");
							E.$bindData();
						};
						E.$onMouse(z);
					}
				}
			}
			else if(t == 5){
				q = E.$s.M;
				if(E.$checkDate(5, {y:S.y,M:v})){
					z.className = "day";
					z.onclick = function(){
						E.$s.M = this.getAttribute("cv");
						E.$bindData();
					};
					E.$onMouse(z);
				}
			}
			else if(t == 3){
				q = E.$s.H;
				if(E.$checkDate(3, {y:S.y,M:S.M,d:S.d,H:v})){
					z.className = "day";
					z.onclick = function(){
						E.$s.H = this.innerHTML;
						E.$bindData();
					};
					E.$onMouse(z);
				}
			}
			else if(t == 2){
				q = E.$s.m;
				if(E.$checkDate(2, {y:S.y,M:S.M,d:S.d,H:S.H,m:v})){
					z.className = "day";
					z.onclick = function(){
						E.$s.m = this.innerHTML;
						E.$bindData();
					};
					E.$onMouse(z);
				}
			}
			else if(t == 1){
				q = E.$s.s;
				if(E.$checkDate(1, {y:S.y,M:S.M,d:S.d,H:S.H,m:S.m,s:v})){
					z.className = "day";
					z.onclick = function(){
						E.$s.s = this.innerHTML;
						E.$bindData();
					};
					E.$onMouse(z);
				}
			}
			if(v == q){
				z.className = "sel";
				z.isMe = true;
			}
		}
		E.$(E.$k.show).style.display = "";
	},
	$fnNum:function(v){
	    return v < 10 ? '0' + (v|0) : v;
	},
	$fnYear:function(v){
		v = "000" + v;
	    return v.substring(v.length - 4, v.length);
	},
	/**
	 * 格式化日期@param d时间对象，f格式化样式
	 */
	$format:function(d, f){
		var t = {
			"y+" : d.getFullYear(),
			"M+" : d.getMonth()+1,
			"d+" : d.getDate(),
			"H+" : d.getHours(),
			"m+" : d.getMinutes(),
			"s+" : d.getSeconds(),
			"S+" : d.getMilliseconds(),
			"W+" : this.$getWeek(d),
			"w+" : $jskey.$CalendarLang[this.$c.lang].w[d.getDay()]
		};
		var _t;
		for(var k in t){
			while(new RegExp("(" + k + ")").test(f)){
				_t = (RegExp.$1.length == 1) ? t[k] : ("0000000000".substring(0, RegExp.$1.length) + t[k]).substr(("" + t[k]).length);
				f = f.replace(RegExp.$1, _t + "");
			}
		}
		return f;
	},
	//设置日历显示内容
	$getLevel:function(s){//args.show
		if(s.indexOf('ss')   > -1){return 1;}//秒
		if(s.indexOf('mm')   > -1){return 2;}//分
		if(s.indexOf('HH')   > -1){return 3;}//时
		if(s.indexOf('dd')   > -1){return 4;}//日
		if(s.indexOf('MM')   > -1){return 5;}//月
		if(s.indexOf('yyyy') > -1){return 6;}//年
		return 6;//复位
	},
	//取得HTML控件绝对位置
	$getPoint:function(e){
		var x = e.offsetLeft, y = e.offsetTop;
		while(e = e.offsetParent){// 递归加上父窗口的
			x += e.offsetLeft;
			y += e.offsetTop;
		}
		// sy距离当前视图上面的距离，即文档中的y-滚动的量
		var a = {"sx":x, "sy":y - document.documentElement.scrollTop, "x":x, "y":y, "w":this.$(this.$k.panel).offsetWidth, "h":this.$(this.$k.panel).offsetHeight};
		return a;
	},
	//根据年、月得到月视图数据(数组形式)
	$getViewArray:function(y, m){
		var a = [];
		var f = new Date(y, m, 1).getDay();// 从 Date 对象返回一周中的某一天 (0 ~ 6)。0周日,6是周六
		var L = new Date(y, m + 1, 0).getDate();// 从 Date对象返回当前是一个月中的第几天 (1~31)。第三个参数设置0即上个月最后一天
		//for(var i = 0;i < 42;i++){// 匹配生成的html格式数
		//	a[i] = "&nbsp;";
		//}
		// 补前面月份日期
		var afL = new Date(y, m, 0).getDate();// 上月最后一天
		for(var i = f;i > 0;i--){
			a[i-1] = f - i - afL;// 用负数标记
		}
		// 补后面月份日期
		for(var i = f+L, j = 1;i < 42;i++,j++){// 匹配生成的html格式数
			a[i] = -j;
		}
		
		for(var i = 0;i < L;i++){
			a[i + f] = i + 1;
		}
		// 顺便处理一下当前日
		if(this.$s.d > L){
			this.$s.d = L;
		}
		return a;
	},
	/**
	 * 取出指定日期是该年的第几周@param currDate当前时间对象
	 */
	$getWeek:function(d){
		var x = new Date(d.getFullYear(), 0, 1);//当前年1月1日
		var y = this.$int(Math.abs(d - x) / 86400000) + 1;//计算当前时间是今年第几天86400000 = 1000 * 60 * 60 * 24
		// 这里将不足七天的开头几天也作为第一周，而不是作为上年最后一周
		var w = (y + x.getDay()) / 7;//补上今年第一周不足七天的时间，求几周
		var i = this.$int(w);
		return((w > i) ? (i + 1) : i);//返回当前是今年第几周
	},
	//向前一年
	goPrevYear:function(E){
		if(E.$s.y <= E.$c.min.y){// 无法再向前了
			return;
		}
		E.$s.y--;
	},
	//向后一年
	goNextYear:function(E){
		if(E.$s.y >= E.$c.max.y){// 无法再向后了
			return;
		}
		E.$s.y++;
	},
	//向前一月
	goPrevMonth:function(E){
		var S = E.$s, I = E.$c.min;
		if(S.y <= I.y && S.M <= I.M){// 无法再向前了
			return;
		}
		S.M--;
		if(S.M == -1){
			S.y--;
			S.M = 11;
		}
	},
	//向后一月
	goNextMonth:function(E){
		var S = E.$s, A = E.$c.max;
		if(S.y >= A.y && S.M >= A.M){// 无法再向后了
			return;
		}
		S.M++;
		if(S.M == 12){
			S.y++;
			S.M = 0;
		}
	},
	//隐藏日历
	$hide:function(){
		this.$panel.style.display = "none";
		this.$div.style.display = "none";
		this.$focus = false;
	},
	//初始化容器
	$init:function(){
		var E = this;
		var v = E.$k.div;
		if(E.$(v) == null){
			var s = '<div id="' + E.$k.panel + '" style="position:absolute;display:none;z-index:9999;" class="jskey_cal"></div>';
			if(document.all){//ie中将层浮于顶层
				s += '<iframe style="position:absolute;z-index:8888;width:expression(this.previousSibling.offsetWidth);';
				s += 'height:expression(this.previousSibling.offsetHeight);';
				s += 'left:expression(this.previousSibling.offsetLeft);top:expression(this.previousSibling.offsetTop);';
				s += 'display:expression(this.previousSibling.style.display);" scrolling="no" frameborder="no"></iframe>';
			}
			var o = document.createElement("div");
			o.innerHTML = s;
			o.id = v;
			o.style.display = "none";
			document.body.appendChild(o);//确保日历容器节点在 body 最后，否则 FireFox 中不能出现在最上方

			E.$panel = E.$(E.$k.panel);
			E.$div = E.$(v);
		}
	},
	$int:function(v){
		return parseInt(v, 10);
	},
	/**
	 * 格式化日期
	 */
	$myDate:function(f){
		var E = this, y = 1, M = 0, d = 1, H = 0, m = 0, s = 0;
		switch(f.length){
			case 19:s = E.$int(f.substring(17, 19));
			case 16:m = E.$int(f.substring(14, 16));
			case 13:H = E.$int(f.substring(11, 13));
			case 10:d = E.$int(f.substring( 8, 10));
			case  7:M = E.$int(f.substring( 5,  7)) - 1;
			case  4:y = E.$int(f.substring( 0,  4));
		}
		var v = new Date(y, M, d, H, m, s);// 转化为日期，处理异常
		var o = {y:v.getFullYear(), M:v.getMonth(), d:v.getDate(), H:v.getHours(), m:v.getMinutes(), s:v.getSeconds()};
		//alert(o.y+"-"+o.M+"-"+o.d+" "+o.H+":"+o.m+":"+o.s);
		return o;
	},
	$onMouse:function(z){
		var E = this;
		z.onmouseover = function(){
			this.className = "over";
		};
		z.onmouseout = function(){
			var t = "day";
			if(E.$sel == this){
				t = "sel";
			}
			else{
				if(this.isToday){// 日期层
					t = "today";
				}
				else if(this.isMe){// 弹出层
					t = "sel";
				}
				else if(this.getAttribute("otd") == "x"){// 上或下一个月的日期
					t = this.getAttribute("tn") != "tdDay" ? "hholiday" : "hday";
				}
				else if(this.getAttribute("tn") == "tdHoliday"){
					t = "holiday";
				}
			}
			this.className = t;
		};
	},
	$recovery:function(){
		var E = this;
		var S = E.$s, K = E.$k, I = E.$c.min, A = E.$c.max;
		// 校正数据
		// 不够
		if(S.y == I.y && S.M <= I.M){
			S.M = I.M;
			if(S.d <= I.d){
				S.d = I.d;
				if(S.H <= I.H){
					S.H = I.H;
					if(S.m <= I.m){
						S.m = I.m;
						if(S.s <= I.s){
							S.s = I.s;
						}
					}
				}
			}
		}
		// 超出
		else if(S.y == A.y && S.M >= A.M){
			S.M = A.M;
			if(S.d >= A.d){
				S.d = A.d;
				if(S.H >= A.H){
					S.H = A.H;
					if(S.m >= A.m){
						S.m = A.m;
						if(S.s >= A.s){
							S.s = A.s;
						}
					}
				}
			}
		}
		E.$(K.y).innerHTML = E.$fnYear(S.y);
		if(E.$c.level >= 6){
			return;
		}
		E.$(K.M).innerHTML = $jskey.$CalendarLang[E.$c.lang].M[S.M];
		E.$(K.H).innerHTML = E.$fnNum(S.H);
		E.$(K.m).innerHTML = E.$fnNum(S.m);
		E.$(K.s).innerHTML = E.$fnNum(S.s);
	},
	// 按日期重置$s @param d Date类型
	$reset:function(d){
		var E = this;
		var S = E.$s;
		S.y = d.getFullYear();
		S.M = d.getMonth();
		S.d = d.getDate();
		S.H = E.$fnNum(d.getHours());
		S.m = E.$fnNum(d.getMinutes());
		S.s = E.$fnNum(d.getSeconds());
	},
	//返回所选日期
	$return:function(dt){
		var E = this;
		var o = E.$input;
		if(o != null){
			o.value = dt;
		}
		E.$hide();
		if(o.onchange == null){
			if(typeof(o.changeEvent) == 'function'){
				o.changeEvent();// 调用转化后的自定义函数
			}
			return;
		}
		//将onchange转成其它函数，以免触发验证事件ValidatorOnChange(DotNet提供的的校验控件)
		var ev = o.onchange.toString();//找出函数的字串
		ev = ev.substring(((ev.indexOf("ValidatorOnChange();") > 0) ? ev.indexOf("ValidatorOnChange();") + 20 : ev.indexOf("{") + 1), ev.lastIndexOf("}"));//去除验证函数 ValidatorOnChange();
		o.changeEvent = new Function(ev);//重新定义函数
		o.changeEvent();//触发自定义 changeEvent 函数
	},
	//更新值并判断是否需要初始化
	$isChange:function(p){
		var C = this.$c;// b为判断设置是否改变
		// 初始化$c
		C.left = p.left;
		C.top = p.top;
		C.min = this.$myDate(p.min);
		C.max = this.$myDate(p.max);
		//判断是否有值出现变动
		if(C.lang != p.lang || C.level != p.level || C.format != p.format){
			//更新值
			C.lang = p.lang;
			C.format = p.format;
			C.level = p.level;//设置日历显示内容
			return true;
		}
		return false;
	},
	//显示日历
	showCalendar:function(o, p){
		var E = this;
		var t;// 临时变量
		E.$init();//初始化布局div
		if(o == null){
			throw new Error("error");
		}
		//补充未定义的args
		if(p.min == null){p.min = E.$p.min;}
		if(p.max == null){p.max = E.$p.max;}
		if(p.lang == null){p.lang = "zh-CN";}
		if($jskey.$CalendarLang[p.lang] == null){
			p.lang = "zh-CN";
		}
		if(p.left == null){p.left = 0;}
		if(p.top == null){p.top = 0;}
		if(p.format == null){p.format = "yyyy-MM-dd";}
		p.level = E.$getLevel(p.sample || p.show || "yyyy-MM-dd");// 转化show为level，兼容旧版属性sample
		//初始化一个时间，用于记录选择日历的时间
		t = new Date();
		try{
			var f = p.format, v = o.value;
			if(v.length >= f.length){
				var y = 0, M = 1, d = 1, H = 0, m = 0, s = 0, _y = f.indexOf('yyyy'), _M = f.indexOf('MM'), _d = f.indexOf('dd'), _H = f.indexOf('HH'), _m = f.indexOf('mm'), _s = f.indexOf('ss');
				if(_y != -1){y = E.$int(v.substring(_y, _y + 4));};
				if(!isNaN(y) && y > 0){
					if(_M != -1){
						M = v.substring(_M, _M + 2);
						if(isNaN(M)){M = (t.getMonth() + 1);}
					}
					if(_d != -1){
						d = E.$int(v.substring(_d, _d + 2));
						if(isNaN(d)){d = t.getDate();}
					}
					if(_H != -1){
						H = E.$int(v.substring(_H, _H + 2));
						if(isNaN(H)){H = t.getHours();}
					}
					if(_m != -1){
						m = E.$int(v.substring(_m, _m + 2));
						if(isNaN(m)){m = t.getMinutes();}
					}
					if(_s != -1){
						s = E.$int(v.substring(_s, _s + 2));
						if(isNaN(s)){s = t.getSeconds();}
					}
					eval("t=new Date(" + y + "," + (E.$int(M) - 1) + "," + E.$int(d) + "," + E.$int(H) + "," + E.$int(m) + "," + E.$int(s) + ")");
				}
			}
		}
		catch(e){
			t = new Date();
		}
		E.$reset(t);//初始化$s
		E.$skin(p.skin||"default");
		E.$input = o;
		var x = E.$isChange(p);
		if(E.$panel.innerHTML == "" || x){
			E.$draw();
		}
		E.$bindData();
		E.$panel.style.display = "";
		E.$div.style.display = "";
		E.$(E.$k.show).style.display = "none";
		
		t = E.$getPoint(o);//取得元素坐标
		E.$panel.style.left = (t.x + E.$c.left) + "px";
		E.$panel.style.top = ((E.$c.top == 0) ? ((t.sy > 340) ? (t.y - t.h) : (t.y + o.offsetHeight)) : (t.y + o.offsetHeight + E.$c.top)) + "px";
		if(!o.isTransEvent){
			o.isTransEvent = true;
			//保存主文本框的 onblur，使其原本的事件不被覆盖
			if(o.onblur != null){
				o.blurEvent = o.onblur;
			}
			o.onblur = function(){
				E.$blur();
				if(typeof(this.blurEvent) == 'function'){
					this.blurEvent();
				}
			};
		}
		E.$div.onmouseover = function(){E.$focus = true;};
		E.$div.onmouseout = function(){E.$focus = false;};
	},
	//画出日历
	show:function(p, old){
		if($jskey.$isDOM(p)){
			this.showCalendar(p, old);
			return true;
		}
		//else if(typeof(p) == 'string' && p.length > 0){alert("Calendar兼容处理");
		//	this.showCalendar(this.$(p), old);
		//	return true;
		//}
		if(typeof(old) == 'object'){// 旧版本格式
			p = old;
		}
		//if(p.object){p.target = p.object;alert("Calendar兼容处理");}
		//if(p.id){p.target = p.id;alert("Calendar兼容处理");}
		if(p.target){
			this.showCalendar($jskey.$isDOM(p.target) ? p.target : this.$(p.target + ""), p);
			return true;
		}
		return false;
	}
};



$jskey.$CalendarLang["zh-CN"] = {
	"M":["01月","02月","03月","04月","05月","06月","07月","08月","09月","10月","11月","12月"],
	"w":["日","一","二","三","四","五","六"],
	"t":["", "秒", "分", "时"],
	"f":["", "秒钟", "分钟", "时钟", "", "月份", "年份"],
	"b":["确定", "清空", "关闭"]
};



$jskey.$CalendarLang["zh-TW"] = {
	"M":["01月","02月","03月","04月","05月","06月","07月","08月","09月","10月","11月","12月"],
	"w":["日","一","二","三","四","五","六"],
	"t":["", "秒", "分", "時"],
	"f":["", "秒鐘", "分鐘", "時鐘", "", "月份", "年份"],
	"b":["確定", "清空", "關閉"]
};



$jskey.$CalendarLang["en-US"] = {
	"M":["January","February","March","April","May","June","July","August","September","October","November","December"],
	"w":["Su","Mo","Tu","We","Th","Fr","Sa"],
	"t":["Time", "", " : ", " : "],
	"f":["", "second", "minute", "hour", "", "month", "year"],
	"b":["Done","Cls","Close"]
};



$jskey.calendar = new $jskey.Calendar();
//加载默认皮肤
$jskey.calendar.$skin("default");



}();



//for 页面模块加载、Node.js运用、页面普通应用
"function" === typeof define ? define(function() {
  return $jskey;
}) : "undefined" != typeof exports ? module.exports = $jskey : window.$jskey = $jskey;