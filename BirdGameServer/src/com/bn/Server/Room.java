package com.bn.Server;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Queue;
import java.util.Random;
import java.util.Set;

import com.bn.Database.DBUtil;

import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;


/**
 * @ClassName: Room
 * @Description: 统筹管理会议房间与邀约房间
 * @author JD
 * @date 2018年7月27日
 */
public class Room {
	
	/**
	 * @Fields room_id : 房间ID(8位数字)，末位为0表示会议房间，末位为1表示邀约房间
	 */
	public String room_id;
	
	/**
	 * @Fields room_name : 房间名称
	 */
	public String room_name;
	
	/**
	 * @Fields admin_id : 房主/管理员的ID
	 */
	public String admin_id;
	
	/**
	 * @Fields clientList : 房间内客户端列表
	 */
	public Map<String,ClientAgent> clientList;
	
	/**
	 * @Fields aq : 动作队列
	 */
	static Queue<Action> aq = new LinkedList<Action>();
	
	/**
	 * @Fields lock : 动作队列锁，确保按顺序从动作队列中取出动作
	 */
	static Object lock = new Object();
		
	/**
	 * 创建一个新的实例 Room.
	 *
	 * @param room_id 房间ID
	 * @param room_name	房间名称
	 * @param admin_id 房主/管理员ID
	 */
	public Room(String room_id,String room_name,String admin_id){
		this.room_id = room_id;
		this.room_name = room_name;
		this.admin_id = admin_id;
		clientList = new LinkedHashMap<String,ClientAgent>();
	}
	
	/**
	 * @Title: broadcastMsg
	 * @Description: 向房间内的所有在线用户广播消息
	 * @param data JSON格式的数据字符串
	 * @param room 房间对象
	 * @return void
	 * @throws
	 */
	public static void broadcastMsg(String data, Room room){
		for (ClientAgent user : room.clientList.values()) { 
			TextWebSocketFrame tws = new TextWebSocketFrame(data); 
			if(user.isOnLine) {
				user.channel.writeAndFlush(tws);
			}
		}
	}
	
	/**
	 * @Title: getUser
	 * @Description: 根据用户ID获取用户的ClientAgent
	 * @param room 房间对象
	 * @param user_id 用户ID
	 * @return ClientAgent 用户代理对象 
	 * @throws
	 */
	public static ClientAgent getUser(Room room, String user_id){
		return room.clientList.get(user_id);
	}
	
	/**   
	 * @Title: randomIndex   
	 * @Description: 生成随机数[min,max]  
	 * @param min 取值范围最小值
	 * @param max 取值范围最大值
	 * @return int 生成的随机数值
	 * @throws   
	 */  
	public static int randomIndex(int min, int max){
        Random random = new Random();
        int index = random.nextInt(max)%(max-min+1) + min;
        return index;
	}
	
	/**
	 * @Title: findVoidRoomID
	 * @Description: 寻找一个未使用过的（会议/邀约）房间ID
	 * @param isMeetingRoom 是否为会议房间
	 * @param roomIDList （会议/邀约）房间ID列表
	 * @return String 房间ID（8位）
	 * @throws 
	 */
	public static String findVoidRoomID(boolean isMeetingRoom,ArrayList<String> roomIDList){
		
		int length = 8;//房间ID位数 
		String room_id;
		
		do{
			room_id = "";
			for(int i = 1; i<length; i++){
				room_id += randomIndex(0,9);
			}
		
			//最后一位为0表示会议房间  为1表示邀约房间
			if(isMeetingRoom) room_id += "0";
			else room_id += "1";
			
		}while(roomIDList.contains(room_id));
			
		return room_id;
	}
	
	/**
	 * @Title: initMeetingRoom
	 * @Description: XXX：自制假数据测试创建会议房间的功能
	 * @return void
	 * @throws ParseException
	 */
	public static void initMeetingRoom() throws ParseException {
		Room.createMeetingRoom("全国XXX大会-测试1", string2Time("2018-06-27 12:00:00"), string2Time("2018-08-06 16:59:00"), "0001");
	}
	
	/**
	 * @Title: createMeetingRoom
	 * @Description: XXX：创建会议房间,此功能应由Web端进行管理
	 * @param meeting_name 会议名称
	 * @param start_time 会议游戏开始时间
	 * @param end_time 会议游戏结束时间
	 * @param admin_id 管理员ID
	 * @return String 房间ID 
	 * @throws 
	 */
	public static String createMeetingRoom(String meeting_name,Timestamp start_time,Timestamp end_time,String admin_id) {
		
		//获取随机房间ID
		String meeting_id = Room.findVoidRoomID(true, MeetingRoom.roomIDList);
		//String meeting_id = "11111110";
		//System.out.println("随机房间ID："+meeting_id);
		//添加进房间ID列表
		MeetingRoom.roomIDList.add(meeting_id);
		MeetingRoom room = new MeetingRoom(meeting_id, meeting_name, admin_id, start_time, end_time);
		MeetingRoom.roomList.add(room);
		
		//XXX：测试数据
//		room.clientList.put("0001", new ClientAgent("0001","张三","0001"));
//		room.clientList.put("0002", new ClientAgent("0002","李四","0002"));
//		room.clientList.put("0003", new ClientAgent("0003","杨明","0003"));
//		room.clientList.put("0004", new ClientAgent("0004","林逸","0004"));
//		room.clientList.put("0005", new ClientAgent("0005","路飞","0005"));
//		room.clientList.put("0006", new ClientAgent("0006","索隆","0006"));
//		room.clientList.put("0007", new ClientAgent("0007","香吉士","0007"));
		
		//将数据添加进数据库
		DBUtil.insertMeetingRoom(meeting_id, meeting_name, start_time, end_time, admin_id);
		
		return meeting_id;
	}
	
	/**
	 * @Title: string2Time 
	 * @Description: 将时间字符串转为Timestamp类型,以便存储进数据库
	 * @param dateString 时间字符串，格式为"yyyy-MM-dd kk:mm:ss"
	 * @return Timestamp
	 * @throws ParseException
	 */
	public static Timestamp string2Time(String dateString) throws ParseException { 
		DateFormat dateFormat; 
		dateFormat = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss", Locale.ENGLISH); 
		dateFormat.setLenient(false); 
		java.util.Date timeDate = dateFormat.parse(dateString);
		Timestamp dateTime = new Timestamp(timeDate.getTime());
		return dateTime; 
	}
}
