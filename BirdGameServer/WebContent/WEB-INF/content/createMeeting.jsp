<%@ page contentType="text/html; charset=utf-8" %> 
<html lang="zh-CN">
<head>

<title>创建会议竞技场</title>

<link href="css/normalize.css" rel="stylesheet"/>
<link href="css/jquery-ui.css" rel="stylesheet"/>
<link href="css/jquery.idealforms.min.css" rel="stylesheet" media="screen"/>

<style type="text/css">
body{font:normal 15px/1.5 Arial, Helvetica, Free Sans, sans-serif;color: #222;background:url(images/pattern.png);overflow-y:scroll;padding:60px 0 0 0;}
#my-form{width:755px;margin:0px auto;border:1px solid #ccc;padding:3em;border-radius:3px;box-shadow:0 0 2px rgba(0,0,0,.2);}
#comments{width:755px;text-align:center; border:1px solid #F00}
</style>

</head>
<body>

<center><h1>创建会议竞技场</h1></center>
<div>

    <form id="my-form" action="meetingForm" onsubmit="return toVaild()">

	  <div style="text-align:center; vertical-align:middel;">
	  
      	<div>
			<label>会议名称:</label>
			<input id="meeting_name" name="meeting_name" type="text"/>
	  	</div>
	  
      	<div>
      		<label>会议游戏开始时间:</label>
      		<input id="start_time" name="start_time" type="text" value="" onclick="$jskey.calendar.show(this, {skin:'gray',lang:'zh-CN',format:'yyyy-MM-dd HH:mm:ss',show:'yyyy-MM-dd HH:mm.ss'})" readonly="true" title="yyyy-MM-dd HH:mm.ss" />
      	</div>
      
      	<div>
      		<label>会议游戏结束时间:</label>
      		<input id="end_time" name="end_time" type="text" value="" onclick="$jskey.calendar.show(this, {skin:'gray',lang:'zh-CN',format:'yyyy-MM-dd HH:mm:ss',show:'yyyy-MM-dd HH:mm.ss'})" readonly="true" title="yyyy-MM-dd HH:mm.ss" />
      	</div>

	  </div>
      <div><hr/></div>

      <div style="width:100%;text-align:center">
        <button type="submit">提交</button>
        <button id="reset" type="button">重置</button>
      </div>
	  
    </form>

</div>


<script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="js/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/jquery.idealforms.js"></script>
<script type="text/javascript" src="js/jskey/jskey_calendar.js"></script>
<script type="text/javascript">
var options = {

	onFail: function(){
		alert( $myform.getInvalid().length +' invalid fields.' )
	},

	inputs: {
		
	}
	
};

var $myform = $('#my-form').idealforms(options).data('idealforms');

$('#reset').click(function(){
	$myform.reset().fresh().focusFirst()
});

$myform.focusFirst();

function toVaild(){
	var meetingName = document.getElementById("meeting_name").value;
	var startTime = document.getElementById("start_time").value;
	var endTime = document.getElementById("end_time").value;
	if(meetingName.length != 0 && startTime.length != 0 && endTime.length != 0){
		return true;
	}else{
		alert("请将信息填写完全");
		return false;
	}
}
</script>
</body>
</html>