var Common = require('Common');//引入常量类

//怪物类
cc.Class({
    extends: cc.Component,

    properties: {
        //三个不同类型的怪物
        happyMonster:{
            default: null,
            type: cc.Node
        },
        angryMonster:{
            default: null,
            type: cc.Node
        },
        sadMonster:{
            default: null,
            type: cc.Node
        },

        currentMonster : cc.Node,

        hasMonster : false,//当前是否有怪物的标识

        //初始速度
        velocityY : 0,
        //初始位置
        posX : 0,
        posY : 0,

        audioManager : null,//声音管理脚本
    },

    startGame () {

        //取消所有回调函数
        this.unscheduleAllCallbacks();
        //初始化声音管理脚本
        this.audioManager = cc.find("ConstantNode").getComponent('AudioManager');

        //重复创建新的怪物
        this.scheduleOnce(function() {
            this.createMonster();
        }, Common.createMonsterTime + 5 * Math.random());
    },

    //创建怪物
    createMonster: function () {

        console.log('创建怪物');
        if(Common.isStop) return;
        //2-happyMonster 1-angryMonster 0-sadMonster
        var randomCount = 3*Math.random();

        if(randomCount >= 2){//happyMonster
            this.audioManager.plyaJump2Audio();//播放怪物2的音效
            this.currentMonster = this.happyMonster;
            this.happyMonster.active = true;
            this.angryMonster.active = this.sadMonster.active = false;
        }else if(randomCount >= 1){//angryMonster
            this.audioManager.plyaJump1Audio();//播放怪物1的音效
            this.currentMonster = this.angryMonster;
            this.angryMonster.active = true;
            this.happyMonster.active = this.sadMonster.active = false;
        }else if(randomCount >= 0){//sadMonster
            this.audioManager.plyaJump3Audio();//播放怪物3的音效
            this.currentMonster = this.sadMonster;
            this.sadMonster.active = true;
            this.happyMonster.active = this.angryMonster.active = false;
        }

        //设置初始速度
        this.velocityY = 20+Math.random()*20;

        this.velocityY += Common.gravity;

        //设置初始位置
        this.currentMonster.setPosition((cc.winSize.width/2)/2,-(cc.winSize.height/2));

        this.scheduleOnce(function() {
            if(!Common.isStop) this.createMonster();
        }, Common.createMonsterTime + 5 * Math.random());
    },
    
    update () {

        //若怪物为空或超出屏幕，则不执行更新
        if(this.currentMonster == null) return;
        this.velocityY -= 0.3;
        //更新位置
        this.currentMonster.setPosition(
            this.currentMonster.x+Common.monsterVx,
            this.currentMonster.y+this.velocityY
        );
    },
});
