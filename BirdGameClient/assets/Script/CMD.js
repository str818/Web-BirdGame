//服务器与客户端之间的传递指令
module.exports = {

    USER_INFO : 1,//请求用户信息（头像与昵称）
    SEARCH_ROOM : 2,//请求竞技场信息
    TIME : 3,//时间
	JOIN_ROOM : 4,//加入房间
	SCORE : 5,//得分
	HIGHER_SCORE : 6,//更高得分
	RANK_LIST : 7,//排行榜
	LUCKY_FRIEND : 8,//推荐联系人
	SPONSOR_LOGO : 9,//赞助商Logo
	CREATE_INVITE_ROOM : 10,//创建邀约竞技场
	SEARCH_INVITATION_ROOM : 11,//搜索邀约竞技场
	JOIN_INVITATION_ROOM : 12,//加入邀约竞技场
	TIME_OVER : 13,//会议竞技场时间结束
};