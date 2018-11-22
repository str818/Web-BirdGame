var Common = require('Common');//引入常量类
var CMD = require('CMD');//引入常量类
var websocket;

cc.Class({
    extends: cc.Component,

    onLoad: function(){
        cc.game.addPersistRootNode(this.node);//设置为常驻结点
        this.initSocket();
    },

    //连接服务器
    initSocket: function(){
        if(window.WebSocket){
            var wsUri = "ws://chuangyh.com:9988/ws";
            websocket = new WebSocket(wsUri);
            //websocket.binaryType = "arraybuffer";
            var mythis = this;
            //连接到服务器后执行
            websocket.onopen = function(event) {
                console.log("已连接");
                
                mythis.requestInitInfoBar();
            };

            //断开服务器连接后执行
            websocket.onclose = function(event) {
                console.log("断开服务器");
            };

            //接收服务器传递的消息后执行
            websocket.onmessage = function(event) {
                var json = JSON.parse(event.data);
                mythis.processData(json);
            };

            //报错时执行
            websocket.onerror = function(event) {
                console.log("报错");
            };
        }else{
            alert("浏览器不支持WebSocket！");
        }
    },

    //处理从服务器接收的消息
    processData: function(data){

        var cmd = parseInt(data.cmd);//命令值

        console.log("命令值:"+cmd + " "+CMD.SCORE);
        if(cmd == CMD.USER_INFO){//更新用户头像与名称
            this.node.getComponent("TopBar").refreshImgAndName(data.user_photo,data.user_name);
        }else if(cmd == CMD.SEARCH_ROOM){//更新搜索会议房间列表
            cc.find("Canvas").getComponent("MainMenuListener").refreshAnswer(data);
        }else if(cmd == CMD.TIME){//更新时间
            this.node.getComponent("TopBar").refreshTime(data);
        }else if(cmd == CMD.SCORE){//获取最高得分
            Common.highestScore = data.score;
        }else if(cmd == CMD.RANK_LIST){//初始化排行榜
            cc.find("Canvas").getComponent("RankMenuListener").initRank(data);
        }else if(cmd == CMD.LUCKY_FRIEND){//推荐联系人
            cc.find("Canvas").getComponent("MenuListener").showLuckyFriend(data);
        }else if(cmd == CMD.SPONSOR_LOGO){//赞助商Logo
            this.initSponsorLogo(data);
        }else if(cmd == CMD.CREATE_INVITE_ROOM){//创建邀约房间
            cc.find("Canvas").getComponent("MainMenuListener").refreshInviteRoom(data);
        }else if(cmd == CMD.SEARCH_INVITATION_ROOM){//搜索邀约房间
            cc.find("Canvas").getComponent("MainMenuListener").refreshInvitationAnswer(data);
        }else if(cmd == CMD.TIME_OVER){//倒计时结束,进入排行榜界面
            Common.meeting_time_over = true;
            cc.director.loadScene("rank");
        }
    },

    //存储赞助商Logo
    initSponsorLogo: function(data){
        var count = parseInt(data.count);//搜索结果数量
        var i = 0;
        Common.sponsor = new Array();
        for(;i<count;i++){
            Common.sponsor[i] = data.logo_list[i].logo;
        }
    },

    //初始化头像与名称信息
    requestInitInfoBar: function(){
        //获取用户ID(通过URL传递过来)
        var user_id = this.getQueryString("user_id");
        //var user_id = "0001";
        console.log("获取用户ID为："+user_id);
        Common.user_id = user_id;

        //若无用户名则提示登录后再进入游戏
        if(user_id == null){
            cc.find("Canvas").getComponent("MainMenuListener").popTipMenu();
            return;
            //user_id = 3;
        }

        var info = {cmd:CMD.USER_INFO, user_id:user_id};
        websocket.send(JSON.stringify(info));
    },

    //根据竞技场ID搜索
    requestSearchRoom: function(id){
        var info = {cmd:CMD.SEARCH_ROOM, search_id:id};
        websocket.send(JSON.stringify(info));
    },

    //根据邀约竞技场ID搜索房间
    requestSearchInvitationRoom: function(id){
        var info = {cmd:CMD.SEARCH_INVITATION_ROOM, search_id:id};
        websocket.send(JSON.stringify(info));
    },

    //请求加入会议房间
    requestJoinRoom: function(user_id,room_id){
        var info = {cmd:CMD.JOIN_ROOM, user_id:user_id, room_id:room_id};
        websocket.send(JSON.stringify(info));
    },

    //请求加入邀约房间
    requestJoinInvitationRoom: function(user_id,room_id){
        var info = {cmd:CMD.JOIN_INVITATION_ROOM, user_id:user_id, room_id:room_id};
        websocket.send(JSON.stringify(info));
    },

    //获取赞助商Logo
    requestSponsorLogo: function(room_id){
        var info = {cmd:CMD.SPONSOR_LOGO, room_id:room_id};
        websocket.send(JSON.stringify(info));
    },

    //更新玩家的最高分数
    requestUpdateScore: function(user_id,room_id,score){
        var info = {cmd:CMD.HIGHER_SCORE, user_id:user_id, room_id:room_id, score : score};
        websocket.send(JSON.stringify(info));
    },

    //请求房间排行榜列表
    reqeustRankList: function(room_id){
        var info = {cmd:CMD.RANK_LIST,room_id:room_id};
        websocket.send(JSON.stringify(info));
    },

    //申请房间内随机的联系人
    requestLuckyUser: function(user_id,room_id){
        var info = {cmd:CMD.LUCKY_FRIEND,user_id:user_id,room_id,room_id};
        websocket.send(JSON.stringify(info));
    },

    //申请创建邀约房间
    reqeustCreateInviteRoom: function(user_id,room_name){
        var info = {cmd:CMD.CREATE_INVITE_ROOM,user_id:user_id,room_name,room_name};
        websocket.send(JSON.stringify(info));
    },

    //获取地址栏参数
    getQueryString: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    },
});
