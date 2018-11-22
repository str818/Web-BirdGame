var Common = require('Common');//引入常量类

cc.Class({
    extends: cc.Component,

    properties: {

        //背景1
        background_1:{
            default: null,
            type: cc.Node
        },

        //背景2
        background_2:{
            default: null,
            type: cc.Node
        },

        //树桩
        stump:{
            default: null,
            type: cc.Node
        },

    },

    //将背景向后移动，实现无限地图
    update () {

        if(Common.isStop) return;

        this.background_1.setPosition(this.background_1.x-Common.bgSpeed,0);
        this.background_2.setPosition(this.background_2.x-Common.bgSpeed,0);

        //树桩只在第一次出现
        if(this.stump.active){
            this.stump.setPosition(this.stump.x-Common.bgSpeed,this.stump.y);
        }

        if(this.background_1.x<=-cc.winSize.width){
            this.background_1.setPosition(cc.winSize.width,0);
            //树桩设为不可见
            if(this.stump.active) this.stump.active = false;
        }
        if(this.background_2.x<=-cc.winSize.width){
            this.background_2.setPosition(cc.winSize.width,0);
        }
    },
});
