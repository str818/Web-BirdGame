var Common = require('Common');//引入常量类

cc.Class({
    extends: cc.Component,

    properties: {

        //按钮组
        stand:{
            default: null,
            type: cc.Node
        },

        //按钮组的首个文字
        topLabel:{
            default: null,
            type: cc.Label
        },

        //树桩结点
        stump: {
            default: null,
            type: cc.Node
        },

        //小鸟结点
        bird: {
            default: null,
            type: cc.Node
        },

        //草地结点
        ground: {
            default: null,
            type: cc.Node
        },

        //障碍物根节点
        branchGroup:{
            default: null,
            type: cc.Node
        },

        //奖励道具
        star:{
            default: null,
            type: cc.Node
        },

        //怪物
        monster:{
            default: null,
            type: cc.Node
        },

        //返回按钮
        backButton:{
            default: null,
            type: cc.Button
        },

        //幸运战友
        luckyFriend:{
            default: null,
            type: cc.Node
        },

        //赞助商Logo
        sponsor: {
            default: null,
            type: cc.Node
        },

        flag : true,//标志位（防止update执行多次）
        audio : null,//音乐标识
    },

    start () {
        this.initPos();
        this.initTopBar();
        this.stand.active = true;

        //为返回按钮添加监听
        this.backButton.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.find("ConstantNode").getComponent("TopBar").onBack();
        });
        //刷新背景音乐
        this.audio = cc.find("ConstantNode").getComponent("AudioManager");
        this.audio.refreshBGAudio();
    },

    //初始化顶部信息
    initTopBar : function(){
        var topBar = cc.find("ConstantNode").getComponent("TopBar");
        //会议模式
        if(Common.model == 0){
            topBar.initMeetingTopBar();
        }else{
            topBar.initInvitationTopBar();
        }
        topBar.highestScore.active = false;
        topBar.back.active = false;
        topBar.score.getComponent(cc.Label).string = "0";
        topBar.title.getComponent(cc.Label).string = Common.room_name;
        this.luckyFriend.active = false;
    },

    //开始游戏
    startGame : function () {
        this.audio.playOnButton();
        this.stand.active = false;
        this.initGame();
        this.flag = true;
        this.luckyFriend.active = false;

        this.sponsor.active = false;
    },

    //初始化游戏状态
    initGame : function () {
        this.bird.getComponent('Bird').init();
        this.initPos();
        //初始化怪物
        this.monster.getComponent('Monster').startGame();
        //初始化分数
        Common.score = 0;
        //初始化UI
        cc.find("ConstantNode").getComponent("TopBar").highestScore.active = false;
    },

    //初始化小鸟与树桩的位置
    initPos : function () {
        this.bird.rotation = 0;
        this.stump.active = true;
        this.stump.setPosition(-(cc.winSize.width/2)+250,this.ground.y+this.stump.height*2-50);
        this.bird.setPosition(-(cc.winSize.width/2)+250-20,this.stump.y+this.bird.height);
    },

    //小鸟死亡
    endGame : function () {
        if (this.flag){
            this.flag = false;
            this.stand.active = true;               //弹出按钮组
            this.topLabel.string = '重 玩';
            this.branchGroup.removeAllChildren();   //删除所有的障碍物
            this.star.active = false;               //隐藏奖励道具
            

            //请求推荐幸运联系人
            cc.find("ConstantNode").getComponent("Network").requestLuckyUser(Common.user_id,Common.room_id);

        }
    },

    //排行榜按钮
    onRankList: function(){
        this.audio.playOnButton();
        cc.director.loadScene("rank");
    },

    //显示推荐联系人
    showLuckyFriend:function(data){
        this.luckyFriend.active = true;
        this.luckyFriend.getChildByName("rank").getComponent(cc.Label).string = data.rank;
        this.loadImg(this.luckyFriend.getChildByName("img").getComponent(cc.Sprite),
                 "http://localhost:8080/pic/" + data.user_photo + ".png");
        this.luckyFriend.getChildByName("name").getComponent(cc.Label).string = data.user_name;
        this.luckyFriend.getChildByName("score").getComponent(cc.Label).string = data.score;
    },

    //动态加载图片
    loadImg: function(container,url){
        cc.loader.load(url, function (err, texture) {
            var sprite  = new cc.SpriteFrame(texture);
            container.spriteFrame = sprite;
        });
    },

    //显示赞助商Logo
    showSponsorLog: function(){

        var sprite = this.sponsor.getComponent(cc.Sprite);
        sprite.spriteFrame = null;
        this.sponsor.width = 0;
        this.sponsor.height = 0;

        this.loadImg(sprite,"http://localhost:8080/logo/" 
            + Common.sponsor[Common.sponsorLogoIndex++%Common.sponsor.length]);

        this.sponsor.width = 200;
        this.sponsor.height = 200;

    },

});
