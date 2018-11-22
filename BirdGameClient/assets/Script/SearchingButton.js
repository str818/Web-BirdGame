var Common = require('Common');//引入常量类
var room_id;//会议竞技场ID
cc.Class({
    extends: cc.Component,

    onButton: function(){
        //进入游戏
        cc.find("ConstantNode").getComponent("AudioManager").playOnButton();
        Common.room_id = this.room_id;
        Common.room_name = this.node.getChildByName("text").getComponent(cc.Label).string;
        
        //根据竞技场ID确定游戏模式
        if(Common.room_id % 2 == 0){
            console.log("会议模式");
            Common.model = 0;
            //请求加入房间
            cc.find("ConstantNode").getComponent("Network").requestJoinRoom(Common.user_id,Common.room_id);

        }else{
            console.log("邀约模式");
            Common.model = 1;
            //请求加入房间
            cc.find("ConstantNode").getComponent("Network").requestJoinInvitationRoom(Common.user_id,Common.room_id);
        }
        //获取赞助商Logo
        cc.find("ConstantNode").getComponent("Network").requestSponsorLogo(Common.room_id);

        
        
        console.log("进入会议竞技场："+this.room_id);
        cc.director.loadScene("mainGame");
    },

});
