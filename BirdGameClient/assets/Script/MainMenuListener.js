var Common = require('Common');//引入常量类
cc.Class({
    extends: cc.Component,

    properties: {

        //未登录提示信息结点
        tip:{
            default: null,
            type: cc.Node
        },

        //主界面结点
        menu_0: {
            default: null,
            type: cc.Node
        },

        //搜索会议竞技场结点
        menu_1: {
            default: null,
            type: cc.Node
        },

        //邀约模式界面结点
        menu_2: {
            default: null,
            type: cc.Node
        },

        //创建邀约竞技场结点
        menu_3: {
            default: null,
            type: cc.Node
        },

        //搜索邀约竞技场结点
        menu_4: {
            default: null,
            type: cc.Node
        },

        //搜索结果下拉框
        searchAnswer: {
            default: null,
            type: cc.Node
        },

        //邀约模式搜索结果下拉框
        invitationSearchAnswer: {
            default: null,
            type: cc.Node
        },

        //搜索会议竞技场提示信息
        tipLabel: {
            default: null,
            type: cc.Node
        },

        //搜索邀约竞技场提示信息
        invitationTipLabel: {
            default: null,
            type: cc.Node
        },

        //答案条预制件
        answerBox:{
            default:null,
            type:cc.Prefab
        },

        //会议竞技场下拉框的容器结点
        content: {
            default: null,
            type: cc.Node
        },

        //邀约竞技场下拉框的容器结点
        invitationContent: {
            default: null,
            type: cc.Node
        },

        //房间名称的EditBox
        createRoomNameEditBox: {
            default: null,
            type: cc.EditBox
        },

        //创建邀约竞技场的提示信息
        InviteRoomTip: {
            default: null,
            type: cc.Node
        },

        //会议竞技场键盘
        meetingRoomKeyboard:{
            default: null,
            type: cc.Node
        },

        //邀约竞技场键盘
        invitationRoomKeyboard:{
            default: null,
            type: cc.Node
        },

        //会议竞技场搜索房间ID
        meetingRoomIDInput: {
            default: null,
            type: cc.Label
        },

        //邀约竞技场搜索房间ID
        invitationRoomIDInput: {
            default: null,
            type: cc.Label
        },

        //音乐管理脚本
        audio : null,

    },

    start() {
        this.menu_0.active = true;
        this.menu_1.active = false;
        this.menu_2.active = false;
        this.menu_3.active = false;
        this.menu_4.active = false;
        cc.find("ConstantNode").getComponent("TopBar").initMainMenuTopBar();
        this.audio = cc.find("ConstantNode").getComponent("AudioManager");
        this.audio.refreshBGAudio();
    },

    //弹出提示信息-登录后再进入游戏
    popTipMenu: function(){
        this.tip.active = true;
        this.menu_0.active = false;
        this.menu_1.active = false;
        this.menu_2.active = false;
        this.menu_3.active = false;
        this.menu_4.active = false;
        cc.find("ConstantNode").active = false;
    },

    //按下会议模式按钮
    onMeetingButton: function () {
        this.audio.playOnButton();
        this.menu_0.active = false;//隐藏主界面结点
        //显示搜索会议竞技场结点并初始化
        this.menu_1.active = true;
        cc.find("ConstantNode").getComponent("TopBar").back.active = true;
        this.tipLabel.active = false;
        this.searchAnswer.active = false;
        this.content.removeAllChildren();
        this.meetingRoomIDInput.string="";
    },

    //按下邀约模式按钮
    onInvitingButton: function () {
        this.audio.playOnButton();
        this.menu_0.active = false;//隐藏主界面结点
        this.menu_2.active = true;
        cc.find("ConstantNode").getComponent("TopBar").back.active = true;
        this.invitationTipLabel.active = false;
        this.invitationSearchAnswer.active = false;
        this.invitationContent.removeAllChildren();
        this.invitationRoomIDInput.string="";
    },

    //搜索会议竞技场
    onSearchMeetingButton:function () {
        this.audio.playOnButton();
        //##向服务器发送搜索竞技场ID标识，请求返回##
        if(this.meetingRoomIDInput.string.length != 0){
            this.searchAnswer.active = true;
            this.meetingRoomKeyboard.active = false;
            cc.find("ConstantNode").getComponent("Network").requestSearchRoom(this.meetingRoomIDInput.string);
        }
    },

    //搜索邀约竞技场
    onSearchInvitationButton: function(){
        this.audio.playOnButton();
        if(this.invitationRoomIDInput.string.length != 0){
            this.invitationSearchAnswer.active = true;
            this.invitationRoomKeyboard.active = false;
            cc.find("ConstantNode").getComponent("Network").requestSearchInvitationRoom(this.invitationRoomIDInput.string);
        }
    },

    //创建邀约竞技场
    onCreateInviteRoomButton: function(){
        this.audio.playOnButton();
        this.InviteRoomTip.active = false;
        this.menu_2.active = false;
        this.menu_3.active = true;
    },

    //搜索邀约房间
    onJoinInviteRoomButton: function(){
        this.audio.playOnButton();
        this.menu_2.active = false;
        this.menu_4.active = true;
        this.invitationRoomIDInput.string = "";
        this.invitationContent.removeAllChildren();//删除已存在的所有结果
    },

    //刷新会议竞技场搜索内容
    refreshAnswer:function(data){
        this.content.removeAllChildren();//删除已存在的所有结果
        var count = parseInt(data.count);//搜索结果数量
        if(count == 0){
            this.tipLabel.active = true;
        }else{
            this.tipLabel.active = false;
        }
        var i=0;
        for(;i<count;i++){
            var meeting_id = data.meeting_list[i].meeting_id;
            var meeting_name = data.meeting_list[i].meeting_name;
            var box = cc.instantiate(this.answerBox);
            this.content.addChild(box);
            box.getComponent("SearchingButton").room_id = meeting_id;
            box.getChildByName("text").getComponent(cc.Label).string = meeting_name;
        }
    },

    //刷新邀约竞技场搜索内容
    refreshInvitationAnswer:function(data){
        this.invitationContent.removeAllChildren();//删除已存在的所有结果
        var count = parseInt(data.count);//搜索结果数量
        console.log("数量："+count);
        if(count == 0){
            this.invitationTipLabel.active = true;
        }else{
            this.invitationTipLabel.active = false;
        }
        var i=0;
        for(;i<count;i++){
            var invitation_id = data.invitation_list[i].invitation_id;
            var invitation_name = data.invitation_list[i].invitation_name;
            var box = cc.instantiate(this.answerBox);
            this.invitationContent.addChild(box);
            box.getComponent("SearchingButton").room_id = invitation_id;
            box.getChildByName("text").getComponent(cc.Label).string = invitation_name;
        }
    },


    //创建竞技场按钮
    onCreatRoomButton: function(){
        this.audio.playOnButton();
        var room_name = this.createRoomNameEditBox.string;
        Common.room_name = room_name;
        if(room_name.length>0){
            cc.find("ConstantNode").getComponent("Network").reqeustCreateInviteRoom(Common.user_id,room_name);
        }

    },

    //响应创建房间返回结果
    refreshInviteRoom: function(data){

        this.InviteRoomTip.active = true;
        console.log(data.room_id.length);
        if(data.room_id.length==0){ //房间创建成功
            this.InviteRoomTip.getComponent(cc.Label).string = "此名称已被使用";
        }else{
            Common.room_id = data.room_id;
            this.InviteRoomTip.getComponent(cc.Label).string = "创建成功! 竞技场ID为："+data.room_id;
        }
    },

    //返回主界面
    onBack:function(){
        this.audio.playOnButton();
        if(this.menu_3.active || this.menu_4.active){
            this.menu_3.active = false;
            this.menu_4.active = false;
            this.menu_2.active = true;
            return;
        }
        this.menu_0.active = true;
        this.menu_1.active = false;
        this.menu_2.active = false;
        cc.find("ConstantNode").getComponent("TopBar").back.active = false;
    },

    //会议搜索模式键盘按钮监听方法
    onMeetingKeyBoardButton: function (event, customEventData) {
        this.audio.playOnButton();
        var room_id = this.meetingRoomIDInput.string;
        if(customEventData == -1 && room_id.length>0){//回退
            this.meetingRoomIDInput.string = room_id.substring(0,room_id.length-1);
        }else if(customEventData == -2){//清空
            this.meetingRoomIDInput.string="";
        }else if(customEventData>=0 && room_id.length<8){//房间号长度最长为8
            this.meetingRoomIDInput.string+=customEventData;
        }
    },

    //邀约搜索模式键盘按钮监听方法
    onInvitationKeyBoardButton: function (event, customEventData) {
        this.audio.playOnButton();
        var room_id = this.invitationRoomIDInput.string;
        if(customEventData == -1 && room_id.length>0){//回退
            this.invitationRoomIDInput.string = room_id.substring(0,room_id.length-1);
        }else if(customEventData == -2){//清空
            this.invitationRoomIDInput.string="";
        }else if(customEventData>=0 && room_id.length<8){//房间号长度最长为8
            this.invitationRoomIDInput.string+=customEventData;
        }
    },

    //按下会议搜索框
    onMeetingSearchInputBox: function(){
        this.audio.playOnButton();
        this.searchAnswer.active = false;
        this.meetingRoomKeyboard.active = true;
        this.content.removeAllChildren();
    },

    //按下会议搜索框
    onInvitationSearchInputBox: function(){
        this.audio.playOnButton();
        this.invitationSearchAnswer.active = false;
        this.invitationRoomKeyboard.active = true;
        this.invitationContent.removeAllChildren();
    },

});
