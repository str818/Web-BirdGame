var Common = require('Common');//引入常量类

cc.Class({
    extends: cc.Component,

    properties: {

        //排名条预制件
        rankBox:{
            default:null,
            type:cc.Prefab
        },

        //下拉框的容器结点
        content: {
            default: null,
            type: cc.Node
        },

        //提示信息
        tipLabel: {
            default: null,
            type: cc.Node
        },

        //我的排名
        myRankNumber: {
            default: null,
            type: cc.Label
        },

        audio : null,//音乐标识
    },

    start () {
        //向服务器申请排行榜
        cc.find("ConstantNode").getComponent("Network").reqeustRankList(Common.room_id);
        this.tipLabel.active = false;
        cc.find("ConstantNode").getComponent("TopBar").initRankListTopBar();

        this.audio = cc.find("ConstantNode").getComponent("AudioManager");
        this.audio.refreshBGAudio();
    },

    //初始化排行榜
    initRank: function(data) {
        var count = parseInt(data.count);//搜索结果数量
        if(count == 0){
            this.tipLabel.active = true;
            this.myRankNumber.string = "我的排名：暂无";
        }else{
            this.tipLabel.active = false;
        }
        var i=0;
        for(;i<count;i++){
            var box = cc.instantiate(this.rankBox);
            this.content.addChild(box);

            box.getChildByName("theRank").getChildByName("rank")
                .getComponent(cc.Label).string = data.rank_list[i].rank;
            if(data.rank_list[i].user_photo.length>0){
                this.loadImg(box.getChildByName("img").getComponent(cc.Sprite),
                 Common.user_img_url+data.rank_list[i].user_photo);
            }
            box.getChildByName("name").getComponent(cc.Label).string = data.rank_list[i].user_name;
            box.getChildByName("score").getComponent(cc.Label).string = data.rank_list[i].score;

            box.getComponent("RankListButton").showFirst();

            //显示我的排名
            if(parseInt(data.rank_list[i].user_id)==parseInt(Common.user_id)){
                this.myRankNumber.string = "我的排名："+(i+1);
            }
        }
    },

    //动态加载图片
    loadImg: function(container,url){
        cc.loader.load(url, function (err, texture) {
            var sprite  = new cc.SpriteFrame(texture);
            container.spriteFrame = sprite;
        });
    },
        
});
