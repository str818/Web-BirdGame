module.exports = {
    
	//游戏相关常量
    isStop : true, //是否停止(背景与障碍物停止运动)
    bgSpeed : 10,   //背景移动速度
    createObstacleTime : 1,//障碍物出现频率（越小出现速度越快）
    createMonsterTime : 3,//怪物出现频率
    gravity : -10,//重力加速度(小鸟下落的速度)
    monsterVx : -15,//怪物初始水平速度
    score : 0,//分数
    highestScore : 0,//最高得分

    model : 0,//游戏模式 0-会议模式 1-房间模式
    room_id : '00000000',//会议竞技场ID
    room_name : '',//会议竞技场名称

    meeting_time_over : false,//会议竞技场的时间是否结束

    sponsorLogoIndex : 0,//赞助商logo显示下标
    sponsor : new Array(),//赞助商Logo数组

    user_id : '',//用户ID

    user_img_url : 'http://chuangyh.com:8000/',//用户头像根目录

    musicPlaying : true,//背景音乐正在播放
};