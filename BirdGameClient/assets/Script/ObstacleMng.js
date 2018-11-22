var Common = require('Common');//引入常量类

cc.Class({
    extends: cc.Component,

    properties: {
        //树枝障碍物预制件
        branchObstacle:{
            default:null,
            type:cc.Prefab
        },

        //障碍物对象池
        obstaclePool:{
            default: null,
            type: cc.NodePool
        },

        //奖励道具
        rewardGroup:{
            default: null,
            type: cc.Node
        },

        //障碍物根节点
        branchGroup:{
            default: null,
            type: cc.Node
        },

    },

    //初始化对象池
    onLoad () {
        this.obstaclePool = new cc.NodePool();
        var initCount = 4;
        for(var i=0;i<initCount;i++){
            var obstacle = cc.instantiate(this.branchObstacle);//创建节点
            this.obstaclePool.put(obstacle);//放入对象池
        }

    },

    //创建障碍物
    createObstacle: function () {

        //停止后更新对象池
        if(Common.isStop){
            this.onLoad();
            return;
        }

        var obstacle = null;
        if(this.obstaclePool.size() > 0){
            obstacle = this.obstaclePool.get();
        }else{
            obstacle = cc.instantiate(this.branchObstacle);
        }

        obstacle.parent = this.branchGroup;
        obstacle.getComponent('Obstacle').init(this);

        var reward = this.rewardGroup.getComponent('Reward');
        //重复创建新的障碍物与奖励道具
        this.scheduleOnce(function() {
            this.createObstacle();
            if(reward.currentReward == null){
                reward.createReward();
            }
            if(reward.currentLogo == null){
                reward.createCloud();
            }
        }, Common.createObstacleTime + Math.random());

    },

    //障碍物超出屏幕时将障碍物重新放入对象池
    recycleObstacle(obstacle){
        this.obstaclePool.put(obstacle);//放入对象池
    },

});
