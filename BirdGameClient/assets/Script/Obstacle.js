var Common = require('Common');//引入常量类

cc.Class({
    extends: cc.Component,

    properties: {
        //屏幕高度
        winHeight : 0,
        //障碍物引用
        branchUp : cc.Node,
        branchDown : cc.Node,
        forkDown : cc.Node,
        forkUp : cc.Node
    },

    update(){

        if(Common.isStop){
            //this.destroy();
            return;
        }

        //更新障碍物位置
        this.node.setPosition(this.node.x-Common.bgSpeed,-cc.winSize.height / 2);
        //当障碍物超出屏幕时回收该结点
        if(this.node.x<-cc.winSize.width/2-20){
            this.ObstacleMng.recycleObstacle(this.node);
        }
    },

    //初始化障碍物
    init: function (ObstacleMng) {
        this.ObstacleMng = ObstacleMng;

        //起始x位置，右侧屏幕外100px
        var x = cc.winSize.width / 2 +100;
        var y = -cc.winSize.height / 2;
        this.node.setPosition(x,y);

        this.branchUp = this.node.getChildByName("branchUp");
        this.branchDown = this.node.getChildByName("branchDown");
        this.forkDown = this.node.getChildByName("forkDown");
        this.forkUp = this.node.getChildByName("forkUp");

        //宽度30-50(包括碰撞器)
        this.branchDown.width = this.branchUp.width
            =this.branchUp.getComponent(cc.BoxCollider).size.width
            =this.branchDown.getComponent(cc.BoxCollider).size.width=30+Math.random()*20;

        //树枝障碍物的7中情况
        var randomCount = Math.random() * 9;

        //屏幕宽度
        this.winHeight = cc.winSize.height;

        //切换障碍物种类
        if(randomCount<5){
            this.forkDown.active = false;
            this.forkUp.active = false;
            this.branchUp.active = true;
            this.branchDown.active = true;
        }else{
            this.forkDown.active = true;
            this.forkUp.active = true;
            this.branchUp.active = false;
            this.branchDown.active = false;
        }

        if(randomCount>=7){//方向向下的叉子障碍物
            this.forkUp.active = false;
            this.calForkDown();
        }else if(randomCount>=5){//方向向上的叉子障碍物
            this.forkDown.active = false;
            this.calForkUp();
        }else if(randomCount>=4){//上下距离小
            this.branchUp.height = this.winHeight/3+Math.random()*this.winHeight/30;
            this.branchDown.height = this.winHeight/3+Math.random()*this.winHeight/30;
            this.calBranchUp();
            this.calBranchDown();
        }else if(randomCount>=3){//开口靠上
            this.branchUp.active = false;
            this.branchDown.height = this.winHeight/2+Math.random()*this.winHeight/4;
            this.calBranchDown();
        }else if(randomCount>=2){//开口靠下
            this.branchDown.active = false;
            this.branchUp.height = this.winHeight/2+Math.random()*this.winHeight/4;
            this.calBranchUp();
        }else if(randomCount>=1){//上方开口
            this.branchUp.height = Math.random()*this.winHeight/4;
            this.branchDown.height = this.winHeight/2+Math.random()*this.winHeight/30;
            this.calBranchUp();
            this.calBranchDown();
        }else if(randomCount>=0){//下方开口
            this.branchUp.height = this.winHeight/2+Math.random()*this.winHeight/30;
            this.branchDown.height = Math.random()*this.winHeight/4;
            this.calBranchUp();
            this.calBranchDown();
        }
    },

    //计算下方树枝的高度与碰撞器大小
    calBranchDown: function () {
        this.branchDown.getComponent(cc.BoxCollider).size.height = this.branchDown.height;
        this.branchDown.getComponent(cc.BoxCollider).offset = cc.p(0,(this.branchDown.height/2+this.branchDown.height%2));
    },

    //计算上方树枝的高度与碰撞器大小
    calBranchUp: function () {
        this.branchUp.getComponent(cc.BoxCollider).size.height = this.branchUp.height;
        this.branchUp.getComponent(cc.BoxCollider).offset = cc.p(0,-(this.branchUp.height/2+this.branchUp.height%2));
    },

    //计算上方树杈的高度与碰撞器大小
    calForkUp: function () {
        this.forkUp.height = this.winHeight/3+Math.random()*this.winHeight/3;
        this.forkUp.getChildByName("fork_head").y=this.forkUp.height;
        this.forkUp.getComponent(cc.BoxCollider).size.height=this.forkUp.height;
        this.forkUp.getComponent(cc.BoxCollider).offset = cc.p(0,(this.forkUp.height/2+this.forkUp.height%2));
    },

    //计算下方树杈的高度与碰撞器大小
    calForkDown: function () {
        this.forkDown.height = this.winHeight/3+Math.random()*this.winHeight/3;
        this.forkDown.getChildByName("fork_head").y=this.forkDown.height;
        this.forkDown.getComponent(cc.BoxCollider).size.height=this.forkDown.height;
        this.forkDown.getComponent(cc.BoxCollider).offset = cc.p(0,(this.forkDown.height/2+this.forkDown.height%2));
    }

});
