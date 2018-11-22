
var Common = require('Common');//引入常量类
//小鸟的状态
const State = {
    READY: 0,
    FLY: 1,
    DROP: 2,
}
var anim;
var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //画布结点
        CanvasNode:{
            default: null,
            type: cc.Node
        },
        state: State.READY,
        isFirst : false,//第一次点击开始
        audioManager : null,//声音管理脚本
    },

    start () {

        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;

        //初始化变量
        self = this;
        self.isFirst = false;
        self.anim = this.getComponent(cc.Animation);

        //初始化声音管理脚本
        self.audioManager = cc.find("ConstantNode").getComponent('AudioManager');

        //添加事件监听，改变小鸟的状态
        //按下鼠标
        this.CanvasNode.on(cc.Node.EventType.MOUSE_DOWN,function(event){
            if(self.isFirst){
                self.isFirst = false;
                Common.isStop = false;//第一次点击屏幕开始游戏
                self.CanvasNode.getComponent('ObstacleMng').createObstacle();

                self.addScore();
            }
            if(!Common.isStop){

                //播放煽动翅膀的音效
                self.audioManager.playFlapAudio();

                //播放煽动翅膀的动画并旋转至向上
                self.state = State.FLY;
                self.anim.resume('birdAni');
                var action = cc.rotateTo(0.2,-20);
                self.node.runAction(action);
            }
        });

        //抬起鼠标
        this.CanvasNode.on(cc.Node.EventType.MOUSE_UP,function(event){

            //停止播放煽动翅膀的音效
            self.audioManager.stopFlapAudio();

            if(!Common.isStop){
                self.state = State.DROP;
                self.anim.pause('birdAni');
                var action = cc.rotateTo(0.2,20);
                self.node.runAction(action);
            }
        });

        //按下屏幕
        this.CanvasNode.on(cc.Node.EventType.TOUCH_START,function(event){
            if(self.isFirst){
                self.isFirst = false;
                Common.isStop = false;//第一次点击屏幕开始游戏
                self.CanvasNode.getComponent('ObstacleMng').createObstacle();

                self.addScore();
            }
            if(!Common.isStop){

                //播放煽动翅膀的音效
                self.audioManager.playFlapAudio();

                //播放煽动翅膀的动画并旋转至向上
                self.state = State.FLY;
                self.anim.resume('birdAni');
                var action = cc.rotateTo(0.2,-20);
                self.node.runAction(action);
            }
        });

        //停止触摸屏幕
        this.CanvasNode.on(cc.Node.EventType.TOUCH_END,function(event){

            //停止播放煽动翅膀的音效
            self.audioManager.stopFlapAudio();

            if(!Common.isStop){
                self.state = State.DROP;
                self.anim.pause('birdAni');
                var action = cc.rotateTo(0.2,20);
                self.node.runAction(action);
            }
        });
    },

    update(){
        //小鸟准备起飞
        if (self.state==State.READY){
            self.anim.start('birdAni');
        }else if(Common.isStop){//小鸟死亡
            var action = cc.moveBy(0.2, 0, -15);
            self.node.runAction(action);
            self.unschedule(this.addScore);
        }else if(self.state==State.DROP){//小鸟下落
            var action = cc.moveBy(0.2, 0, Common.gravity);
            self.node.runAction(action);
        }else if(self.state==State.FLY){//小鸟向上飞
            var action = cc.moveBy(0.2, 0, 12);
            self.node.runAction(action);
        }

        //小鸟跌出屏幕，游戏结束
        if(self.node.y<-cc.winSize.height/2-50 || self.node.y>cc.winSize.height/2+50){
            self.state = State.READY;
            Common.isStop = true;
            this.CanvasNode.getComponent('MenuListener').endGame();

            //显示最高分
            if(cc.find("ConstantNode").getComponent("TopBar").highestScore.active == false){
                cc.find("ConstantNode").getComponent("TopBar").showHighestScore();
            }
            
        }
    },

    //小鸟碰撞  1-树枝  2-怪物  3-奖励道具
    onCollisionEnter: function (other, self){

        if(other.tag == 1 || other.tag == 2){//碰撞到障碍物或怪物
            var action = cc.rotateTo(0.2,90);
            self.node.runAction(action);
            Common.isStop = true;
            //this.CanvasNode.getComponent('MenuListener').endGame();
        }else if(other.tag == 3){//吃到道具

            //播放吃道具音效
            this.audioManager.playTingAudio();

            other.node.active = false;
            Common.score += 10;
        }
    },

    //初始化小鸟状态
    init: function () {
        self.state = State.READY;
        self.isFirst = true;
    },

    //加分数
    addScore: function(){
        
        if(!Common.isStop){
            Common.score += 1;
            this.scheduleOnce(function() {
                this.addScore();
            }, 1);
        }
    },

});
