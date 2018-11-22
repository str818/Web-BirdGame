var Common = require('Common');//引入常量类
cc.Class({
    extends: cc.Component,

    properties: {

        //用户头像结点
        user_photo: {
            default: null,
            type: cc.Sprite
        },

        //用户名称结点
        user_name: {
            default: null,
            type: cc.Label
        },

        //会议模式顶部信息条
        MeetingBar:{
            default: null,
            type: cc.Node
        },

        //得分
        score:{
            default: null,
            type: cc.Node
        },

        //最高分
        highestScore:{
            default: null,
            type: cc.Node
        },

        //返回按钮
        back:{
            default: null,
            type: cc.Node
        },

        //标题
        title:{
            default: null,
            type: cc.Node
        },

        //音乐管理脚本
        audio : null,

    },

    start() {
        this.MeetingBar.active = false;
        this.score.active = false;
        this.highestScore.active = false;
        this.audio = cc.find("ConstantNode").getComponent("AudioManager");
    },

    update(){
        this.refreshScore();
    },

    //更新用户头像与名称
    refreshImgAndName: function(photo,name){

        //若图片不为空，则置换图片
        if(photo != null && photo.length>0){
            var photo_url = Common.user_img_url + photo;
            console.log(photo_url);
            this.loadImg(this.user_photo, photo_url);
        }

        this.user_name.string = name;
    },

    //动态加载图片
    loadImg: function(container,url){
        cc.loader.load(url, function (err, texture) {
            var sprite  = new cc.SpriteFrame(texture);
            container.spriteFrame = sprite;
        });
    },

    //初始化会议模式下的顶部信息
    initMeetingTopBar: function(){
        this.MeetingBar.active = true;
        this.score.active = true;
        this.back.active = false;
        this.title.active = true;
    },

    //初始化邀约模式下的顶部信息
    initInvitationTopBar: function(){
        this.MeetingBar.active = false;
        this.score.active = true;
        this.back.active = false;
        this.title.active = true;
        
    },

    //初始化排名场景的顶部信息
    initRankListTopBar:function(){
        this.score.active = false;
        this.back.active = true;
        this.highestScore.active = false;
        this.title.active = true;
    },

    //初始化主菜单的顶部信息
    initMainMenuTopBar:function(){
        this.back.active = false;
        this.score.active = false;
        this.highestScore.active = false;
        this.MeetingBar.active = false;
        this.title.active = false;1
    },

    //刷新时间
    refreshTime(data){

        var s = data.day + "天" + data.hour + "时" 
            + data.minute + "分" + data.second + "秒";

        this.MeetingBar.getChildByName("time").getComponent(cc.Label).string = s;
    },

    //刷新分数
    refreshScore(){
        var s = "得分："+Common.score;
        this.score.getComponent(cc.Label).string = s;
    },

    //显示最高得分
    showHighestScore(){
        if(Common.score > Common.highestScore){
            Common.highestScore = Common.score;
        }
        cc.find("ConstantNode").getComponent("Network").requestUpdateScore(Common.user_id,Common.room_id,Common.highestScore);
        this.highestScore.active = true;
        this.highestScore.getComponent(cc.Label).string = "最高得分："+Common.highestScore;
    },

    //返回按钮
    onBack(){
        this.audio.playOnButton();
        var sceneName = cc.director.getScene().getName();

        //主菜单场景
        if(sceneName == "menu"){
            cc.find("Canvas").getComponent("MainMenuListener").onBack();
        }else if(sceneName == "mainGame"){//游戏场景
            cc.director.loadScene("menu");
        }else if(sceneName == "rank"){//排行榜场景
            //排行榜倒计时结束
            if(Common.meeting_time_over){
                Common.meeting_time_over = false;
                cc.director.loadScene("menu");
            }else{
                cc.director.loadScene("mainGame");
            }
        }
    },
});
