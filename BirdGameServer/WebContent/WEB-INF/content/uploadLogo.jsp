<%@ page contentType="text/html; charset=utf-8" %> 
<html lang="zh-CN">
<head>
    
    <title>上传Logo</title>
    <link rel="stylesheet" type="text/css" href="css/webuploader.css" />
    <link rel="stylesheet" type="text/css" href="css/style.css" />
</head>
<body>

	<script>
		var room_id = ${requestScope.room_id};
		console.log("room_id:"+room_id);
		room_id
	</script>

	<center><h1>上传赞助商Logo</h1></center>
	<center><h3>会议游戏竞技场创建成功，竞技场ID为：<script> document.write("" + room_id ); </script> </h3></center>
    
    <div id="wrapper">
        <div id="container">
            <!--头部，相册选择和格式选择-->

            <div id="uploader">
                <div class="queueList">
                    <div id="dndArea" class="placeholder">
                        <div id="filePicker"></div>
                        <p>或将照片拖到这里</p>
                    </div>
                </div>
                
                <div class="statusBar" style="display:none">
                    <div class="progress">
                        <span class="text">0%</span>
                        <span class="percentage"></span>
                    </div><div class="info"></div>
                    <div class="btns">
                        <div id="filePicker2"></div><div class="uploadBtn">开始上传</div>
                    </div>
                </div>
            </div>
        </div>
         <center>Tip：为了保证呈现效果，请上传白底或透明底，且像素为600×200的图片</center>
    </div>
    
   
   	<script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/webuploader.js"></script>
    <script type="text/javascript" src="js/upload.js"></script>
</body>
</html>
