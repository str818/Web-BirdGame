var Common = require('Common');//引入常量类

cc.Class({
    extends: cc.Component,

    properties: {

        //煽动翅膀声音
        flapAudio:{
            default:null,
            url:cc.AudioClip
        },

        //吃到道具时的音效
        tingAudio:{
            default:null,
            url:cc.AudioClip
        },

        //三种怪物跳出来的声音
        jump1Audio:{
            default:null,
            url:cc.AudioClip
        },
        jump2Audio:{
            default:null,
            url:cc.AudioClip
        },
        jump3Audio:{
            default:null,
            url:cc.AudioClip
        },

        //点击按钮的声音
        onButton:{
            default:null,
            url:cc.AudioClip
        },

        //播放背景音乐的AduioSource
        bgAS:{
            default:null,
            type:cc.AudioSource
        },
        
        //播放音效的AudioSource
        specialEffectAS:{
            default:null,
            type:cc.AudioSource
        },

        flapCC : null,//煽动翅膀的声音系统变量

        //音量开启结点
        audioOnButton :{
            default: null,
            type: cc.Node
        },
        //音量关闭结点
        audioOffButton :{
            default: null,
            type: cc.Node
        },

    },


    //三种跳跃音效
    plyaJump1Audio : function(){
        cc.audioEngine.play(this.jump1Audio, false, 1);
    },
    plyaJump2Audio : function(){
        cc.audioEngine.play(this.jump2Audio, false, 1);
    },
    plyaJump3Audio : function(){
        cc.audioEngine.play(this.jump3Audio, false, 1);
    },

    //播放吃到道具时的音效
    playTingAudio : function(){
        cc.audioEngine.play(this.tingAudio, false, 1);
    },

    //播放小鸟煽动翅膀的音效
    playFlapAudio : function () {
        this.flapCC = cc.audioEngine.play(this.flapAudio, true, 1);
    },

    //停止播放小鸟煽动翅膀的声音
    stopFlapAudio : function () {
        cc.audioEngine.stop(this.flapCC);
    },

    //点击UI的声音
    playOnButton : function(){
        cc.audioEngine.play(this.onButton, false, 1);
    },

    //开启背景音乐
    audioOn : function () {
        this.audioOnButton.active = true;
        this.audioOffButton.active = false;
        this.bgAS.resume();
        Common.musicPlaying = true;
    },

    //关闭背景音乐
    audioOff : function () {
        this.audioOnButton.active = false;
        this.audioOffButton.active = true;
        this.bgAS.pause();
        Common.musicPlaying = false;
    },

    //刷新背景音乐
    refreshBGAudio : function(){
        if(Common.musicPlaying){
            this.audioOn();
        }else{
            this.audioOff();
        }
    },
});
