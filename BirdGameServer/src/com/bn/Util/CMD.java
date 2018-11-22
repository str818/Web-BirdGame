package com.bn.Util;

/**
 * @ClassName: CMD
 * @Description: 服务器与客户端之间的指令
 * @author JD
 * @date 2018年7月28日
 *
 */
public class CMD {
	public static final int USER_INFO =1;//请求用户信息（头像与昵称）
	public static final int SEARCH_ROOM =2;//请求竞技场信息
	public static final int TIME = 3;//倒计时
	public static final int JOIN_ROOM = 4;//加入房间
	public static final int SCORE = 5;//得分
	public static final int HIGHER_SCORE = 6;//更高得分
	public static final int RANK_LIST = 7;//排行榜
	public static final int LUCKY_FRIEND = 8;//幸运联系人
	public static final int SPONSOR_LOGO =9;//赞助商Logo
	public static final int CREATE_INVITE_ROOM = 10;//创建邀约房间
	public static final int SEARCH_INVITATION_ROOM = 11;//搜索邀约房间
	public static final int JOIN_INVITATION_ROOM = 12;//加入邀约房间
	public static final int TIME_OVER = 13;//会议模式时间结束
}
