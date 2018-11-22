var Common = require('Common');//引入常量类
cc.Class({
    extends: cc.Component,

    properties: {

        //第一图标
        no_1: {
            default: null,
            type: cc.Node
        },

        //第二图标
        no_2: {
            default: null,
            type: cc.Node
        },

        //第三图标
        no_3: {
            default: null,
            type: cc.Node
        },

    },

    showFirst: function(){
        var rank = this.node.getChildByName("score").string;
        if(rank == "1"){
            this.no_1.active = true;
        }else if(rank == "2"){
            this.no_2.active == true;
        }else if(rank == "3"){
            this.no_3.active == true;
        }
    },

    onButton: function(){
        //TODO
    },

});
