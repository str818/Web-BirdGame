var Common = require('Common');//引入常量类

cc.Class({
    extends: cc.Component,

    properties: {
        //星星
        star:{
            default: null,
            type: cc.Node
        },

        //云彩
        cloud:{
            default: null,
            type: cc.Node
        },

        //当前显示的奖励道具
        currentReward : cc.Node,

        //当前云彩（显示商标）
        currentLogo : cc.Node,
    },

    //创建奖励道具
    createReward:function () {

        //有40%的几率出现奖励道具
        //if (Math.random() > 0.4) return;
        this.active = true;

        //奖励道具出现范围
        var min = -cc.winSize.height/3;
        var max = cc.winSize.height/3;
        var x = cc.winSize.width / 2 + 150 + Math.random() * 500;
        var y = min + Math.random() * 2 * max;

        this.currentReward = this.star;
        this.currentReward.active = true;
        //设置奖励道具的位置
        this.currentReward.setPosition(x,y);
    },

    //创建云彩（显示商标Logo）
    createCloud:function(){
        console.log("创建云彩");
        if(this.currentLogo != null) return;
         //云彩出现范围
        var min = cc.winSize.height/6;
        var max = cc.winSize.height/2 - this.cloud.height;
        var x = cc.winSize.width / 2 + this.cloud.width/2;
        var y = min + Math.random() * (max-min);

        this.currentLogo = this.cloud;
        this.currentLogo.active = true;
        //设置奖励道具的位置
        this.currentLogo.setPosition(x,y);

        if(Common.sponsor == null || Common.sponsor.length>0){
            var url = "http://localhost:8080/BirdGame/"+Common.sponsor[Common.sponsorLogoIndex++%Common.sponsor.length];//图片路径
            var container = this.cloud.getChildByName("logo").getComponent(cc.Sprite);//图片呈现位置
            this.loadImg(container,url);
        }
    },

    update (dt) {
        if(Common.isStop) return;

        //奖励星星
        if(this.currentReward != null){
            this.currentReward.setPosition(this.currentReward.x-Common.bgSpeed,
                this.currentReward.y);

            //若奖励道具超出屏幕则移除
            if(this.currentReward.x<-cc.winSize.width/2-100){
                this.currentReward = null;
            }
        }

        //广告云彩
        if(this.currentLogo != null){
            this.currentLogo.setPosition(this.currentLogo.x-Common.bgSpeed,
                this.currentLogo.y);

            //若奖励道具超出屏幕则移除
            if(this.currentLogo.x<-cc.winSize.width/2-this.currentLogo.width/2){
                this.currentLogo = null;
            }
        }
        
    },

    //动态加载图片的方法
    loadImg: function(container,url){
        cc.loader.load(url, function (err, texture) {
            var sprite  = new cc.SpriteFrame(texture);
            container.spriteFrame = sprite;
        });
    } ,
});
