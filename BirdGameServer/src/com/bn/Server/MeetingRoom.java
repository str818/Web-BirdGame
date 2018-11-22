package com.bn.Server;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Map;

import io.netty.channel.Channel;

/**
 * @ClassName: MeetingRoom
 * @Description: 会议房间实体
 * @author JD
 * @date 2018年7月27日
 */
public class MeetingRoom extends Room{

	/**
	 * @Fields start_time : 会议游戏开始时间
	 */
	Timestamp start_time;
	
	/**
	 * @Fields end_time : 会议游戏结束时间
	 */
	Timestamp end_time;
	
	/**
	 * @Fields roomList : 会议房间列表，存放所有的会议房间实体
	 */
	public static ArrayList<MeetingRoom> roomList = new ArrayList<MeetingRoom>();

	/**
	 * @Fields roomIDList : 会议房间ID列表，存放所有会议房间的ID
	 */
	public static ArrayList<String> roomIDList = new ArrayList<String>();
	
	/**
	 * 创建一个新的实例 MeetingRoom.
	 *
	 * @param room_id 会议房间ID
	 * @param room_name	会议名称
	 * @param admin_id 管理员ID
	 * @param start_time 会议游戏开始时间
	 * @param end_time 会议游戏结束时间
	 */
	public MeetingRoom(String room_id,String room_name,String admin_id,Timestamp start_time,Timestamp end_time) {
		super(room_id, room_name, admin_id);
		this.start_time = start_time;
		this.end_time = end_time;
		new TimeThread(room_id,end_time).start();
	}
	
	/**
	 * @Title: getRoom
	 * @Description: 获取会议房间实例
	 * @param room_id 会议房间ID
	 * @return Room  
	 */
	public static MeetingRoom getRoom(String room_id) {
		
		for(int i=0;i<roomList.size();i++){		
			if(roomList.get(i).room_id.equals(room_id)){
				return roomList.get(i);
			}
		}
		return null;
	}

}
