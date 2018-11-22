package com.bn.Server;

import java.sql.Timestamp;
import java.util.ArrayList;

import com.bn.Database.DBUtil;

public class InvitationRoom extends Room{

	/**
	 * @Fields roomList : 邀约房间列表，存放所有的会议房间实体
	 */
	public static ArrayList<InvitationRoom> roomList = new ArrayList<InvitationRoom>();

	/**
	 * @Fields roomIDList : 邀约房间ID列表，存放所有会议房间的ID
	 */
	public static ArrayList<String> roomIDList = new ArrayList<String>();
	
	public InvitationRoom(String room_id,String room_name,String admin_id) {
		super(room_id, room_name, admin_id);
	}
	
	/**
	 * @Title: getRoom
	 * @Description: 获取会议房间实例
	 * @param room_id 会议房间ID
	 * @return Room  
	 */
	public static InvitationRoom getRoom(String room_id) {
		
		for(int i=0;i<roomList.size();i++){		
			if(roomList.get(i).room_id.equals(room_id)){
				return roomList.get(i);
			}
		}
		return null;
	}

	
	/**
	 * @Title: isSameNameRoom
	 * @Description: 判断是否有相同名称的房间
	 * @param room_name
	 * @return boolean  
	 */
	public static boolean isSameNameRoom(String room_name) {
		for(InvitationRoom room : roomList) {
			if(room.room_name.equals(room_name)) return true;
		}
		return false;
	}
	
	
	/**
	 * @Title: createInvitationRoom
	 * @Description: 创建邀约房间
	 * @param invitation_name
	 * @param admin_id void  
	 */
	public static String createInvitationRoom(String invitation_name,String admin_id) {
		
		if(isSameNameRoom(invitation_name)) return "";
		
		//获取随机房间ID XXX:测试
		String invitation_id = Room.findVoidRoomID(false, InvitationRoom.roomIDList);
		//String invitation_id = "11111111";
		//添加进房间ID列表
		InvitationRoom.roomIDList.add(invitation_id);
		InvitationRoom room = new InvitationRoom(invitation_id,invitation_name,admin_id);
		InvitationRoom.roomList.add(room);
		
		//XXX：测试数据
//		room.clientList.put("0001", new ClientAgent("0001","张三","0001"));

		
		//将数据添加进数据库
		DBUtil.insertInviteRoom(admin_id, invitation_id, invitation_name);
		return invitation_id;
	}
}
