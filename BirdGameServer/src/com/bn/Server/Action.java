package com.bn.Server;

import java.util.ArrayList;

import com.bn.Database.DBUtil;
import com.bn.Util.CMD;

import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class Action {

	
	/**
	 * @Fields channel : 客户端连接通道
	 */
	Channel channel;
	
	/**
	 * @Fields cmd : 指令值
	 */
	int cmd;

	/**
	 * @Fields room_id : 房间ID
	 */
	String room_id;

	/**
	 * @Fields user_id : 用户ID
	 */
	String user_id;
	
	/**
	 * @Fields search_id : 搜索的ID号（房间ID的后四位）
	 */
	String search_id;
	
	/**
	 * @Fields score : 需要更新的分数
	 */
	String score;
	
	/**
	 * @Fields room_name : 房间名称
	 */
	String room_name;
	
	/**
	 * @Fields jsonString : 待发送到客户端的json字符串
	 */
	String jsonString = null;
	
	/**
	 * 创建一个新的实例 Action.
	 *
	 * @param channel 客户端连接通道
	 * @param cmd 指令值
	 * @param room_id 房间ID
	 * @param user_id 用户ID
	 * @param search_id 搜索的ID号
	 */
	public Action(Channel channel,int cmd,String room_id,String user_id,String search_id,String score,String room_name){
		this.channel = channel;
		this.cmd = cmd;
		this.room_id = room_id;
		this.user_id = user_id;
		this.search_id = search_id;
		this.score = score;
		this.room_name = room_name;
	}
	
	/**
	 * 创建一个新的倒计时Action
	 *
	 * @param cmd 指令
	 * @param room_id 房间ID
	 * @param jsonString JSON字符串
	 */
	public Action(int cmd,String room_id,String jsonString){
		this.cmd = cmd;
		this.room_id = room_id;
		this.jsonString = jsonString;
	}
	
	/**
	 * @Title: doAction
	 * @Description: 根据指令值处理Action
	 */
	public void doAction(){
		
		if(cmd == CMD.USER_INFO) {
			//根据用户ID查询该用户的昵称与图像
			String[] str = DBUtil.getUserNameAndPic(user_id);
			JSONObject json = new JSONObject();
			json.put("cmd", CMD.USER_INFO);
			json.put("user_name", str[0]);
			json.put("user_photo", str[1]);
			jsonString = json.toString();
			
			TextWebSocketFrame tws = new TextWebSocketFrame(jsonString); 
			channel.writeAndFlush(tws);
		}else if(cmd == CMD.SEARCH_ROOM) {
			//根据输入ID的后四位搜索房间
			ArrayList<String> al = DBUtil.getMeetingRoom(search_id);
			
			JSONObject json = new JSONObject();
			json.put("cmd", CMD.SEARCH_ROOM);
			json.put("count", al.size());//搜索结果数量
			
			JSONArray array = new JSONArray();//结果数组
			for(String s : al) {
				JSONObject temp = new JSONObject();
				String[] ss = s.split("\\|");
				temp.put("meeting_id", ss[0]);
				temp.put("meeting_name", ss[1]);
				array.add(temp);
			}
			
			json.put("meeting_list", array);
			jsonString = json.toString();
			
			TextWebSocketFrame tws = new TextWebSocketFrame(jsonString); 
			channel.writeAndFlush(tws);
		}else if(cmd == CMD.JOIN_ROOM) {
			//用户申请加入房间
			MeetingRoom room = MeetingRoom.getRoom(room_id);
			
			//获取得分
			int score = 0;
			if(DBUtil.getScore(user_id, room_id)==null) {
				DBUtil.insertScore(user_id, room_id, score);
			}else {
				score = Integer.parseInt(DBUtil.getScore(user_id, room_id));
			}
			
			//获取名称与头像信息
			String[] str = DBUtil.getUserNameAndPic(user_id);
			
			ClientAgent ca = new ClientAgent(channel, user_id, str[0], str[1]);
			room.clientList.put(user_id, ca);
			
			
			
			JSONObject json = new JSONObject();
			json.put("cmd", CMD.SCORE);
			json.put("score", score);
			
			jsonString = json.toString();
			
			TextWebSocketFrame tws = new TextWebSocketFrame(jsonString); 
			channel.writeAndFlush(tws);
			
		}else if(cmd == CMD.TIME) {
			//向房间内的在线用户广播倒计时
			MeetingRoom room = MeetingRoom.getRoom(room_id);
			Room.broadcastMsg(jsonString, room);
		}else if(cmd == CMD.HIGHER_SCORE) {
			//更新数据库中的分数
			DBUtil.updateScore(user_id, room_id, Integer.parseInt(score));
		}else if(cmd == CMD.RANK_LIST) {
			//获取房间内的排名
			ArrayList<String> al = DBUtil.getRankList(room_id);
			
			//获取排行榜
			JSONObject json = new JSONObject();
			json.put("cmd", CMD.RANK_LIST);
			json.put("count", al.size());//搜索结果数量
			Room room;
			if(room_id.charAt(room_id.length()-1)=='0') {
				room = MeetingRoom.getRoom(room_id);
			}else {
				room = InvitationRoom.getRoom(room_id);
			}
			
			JSONArray array = new JSONArray();//结果数组
			for(int i = 1;i<=al.size();i++) {
				JSONObject temp = new JSONObject();
				String[] ss = al.get(i-1).split("\\|");
				temp.put("rank", i);
				temp.put("user_id", ss[0]);
				temp.put("user_photo", room.clientList.get(ss[0]).user_photo);
				temp.put("user_name", room.clientList.get(ss[0]).user_name);
				temp.put("score", ss[1]);
				array.add(temp);
			}
			
			json.put("rank_list", array);
			jsonString = json.toString();
			
			TextWebSocketFrame tws = new TextWebSocketFrame(jsonString); 
			channel.writeAndFlush(tws);
		}else if(cmd == CMD.LUCKY_FRIEND) {
			//推荐联系人
			ArrayList<String> al = DBUtil.getRankList(room_id);
			
			if(al.size() <= 1) return;
			
			Room room;
			if(room_id.charAt(room_id.length()-1)=='0') {
				room = MeetingRoom.getRoom(room_id);
			}else {
				room = InvitationRoom.getRoom(room_id);
			}
			
			int index;
			String the_user_id;
			do {
				index = Room.randomIndex(0, al.size()-1);
				the_user_id = al.get(index).split("\\|")[0];
			}while(user_id.equals(the_user_id));
			
			String[] ss = al.get(index).split("\\|");
			
			JSONObject json = new JSONObject();
			json.put("cmd", CMD.LUCKY_FRIEND);
			json.put("rank", index+1);
			json.put("user_id", ss[0]);
			json.put("user_photo", room.clientList.get(ss[0]).user_photo);
			json.put("user_name", room.clientList.get(ss[0]).user_name);
			json.put("score", ss[1]);
			jsonString = json.toString();
			
			TextWebSocketFrame tws = new TextWebSocketFrame(jsonString); 
			channel.writeAndFlush(tws);
		}else if(cmd == CMD.SPONSOR_LOGO) {
			//赞助商Logo
			ArrayList<String> al = DBUtil.getSponsorLogo(room_id);
			
			JSONObject json = new JSONObject();
			json.put("cmd", CMD.SPONSOR_LOGO);
			json.put("count", al.size());
			
			JSONArray array = new JSONArray();//结果数组
			for(int i = 0;i<al.size();i++) {
				JSONObject temp = new JSONObject();
				temp.put("logo", al.get(i));
				array.add(temp);
			}
			
			json.put("logo_list", array);
			jsonString = json.toString();
			
			TextWebSocketFrame tws = new TextWebSocketFrame(jsonString); 
			channel.writeAndFlush(tws);
		}else if(cmd == CMD.CREATE_INVITE_ROOM) {
			
			//创建邀约房间
			String room_id = InvitationRoom.createInvitationRoom(room_name, user_id);
			
			JSONObject json = new JSONObject();
			json.put("cmd", CMD.CREATE_INVITE_ROOM);
			json.put("room_id", room_id);
			jsonString = json.toString();
			
			TextWebSocketFrame tws = new TextWebSocketFrame(jsonString); 
			channel.writeAndFlush(tws);
		}else if(cmd == CMD.SEARCH_INVITATION_ROOM) {
			//搜索邀约房间
			//根据输入ID的后四位搜索房间
			ArrayList<String> al = DBUtil.getInvitationRoom(search_id);
			
			JSONObject json = new JSONObject();
			json.put("cmd", CMD.SEARCH_INVITATION_ROOM);
			json.put("count", al.size());//搜索结果数量
			
			JSONArray array = new JSONArray();//结果数组
			for(String s : al) {
				JSONObject temp = new JSONObject();
				String[] ss = s.split("\\|");
				temp.put("invitation_id", ss[0]);
				temp.put("invitation_name", ss[1]);
				array.add(temp);
			}
			
			json.put("invitation_list", array);
			jsonString = json.toString();
			
			TextWebSocketFrame tws = new TextWebSocketFrame(jsonString); 
			channel.writeAndFlush(tws);
		}else if(cmd == CMD.JOIN_INVITATION_ROOM) {
			//加入邀约房间
			//用户申请加入房间
			InvitationRoom room = InvitationRoom.getRoom(room_id);
			
			if(room.clientList.get(user_id) != null) {
				//TODO: 该用户已经在该房间内（在别处登录）
			}
			
			//获取得分
			int score = 0;
			if(DBUtil.getScore(user_id, room_id)==null) {
				DBUtil.insertScore(user_id, room_id, score);
			}else {
				score = Integer.parseInt(DBUtil.getScore(user_id, room_id));
			}
			
			//获取名称与头像信息
			String[] str = DBUtil.getUserNameAndPic(user_id);
			ClientAgent ca = new ClientAgent(channel, user_id, str[0], str[1]);
			room.clientList.put(user_id, ca);
			
			JSONObject json = new JSONObject();
			json.put("cmd", CMD.SCORE);
			json.put("score", score);
			
			jsonString = json.toString();
			
			TextWebSocketFrame tws = new TextWebSocketFrame(jsonString); 
			channel.writeAndFlush(tws);
		}else if(cmd == CMD.TIME_OVER) {
			//会议竞技场时间结束
			Room room =MeetingRoom.getRoom(room_id);
			
			//广播倒计时结束消息
			room.broadcastMsg(jsonString, room);
		}
	}
}
