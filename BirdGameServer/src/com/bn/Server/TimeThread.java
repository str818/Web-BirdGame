package com.bn.Server;

import static com.bn.Server.Room.aq;
import static com.bn.Server.Room.lock;

import java.sql.Timestamp;

import com.bn.Util.CMD;

import net.sf.json.JSONObject;

/**
 * @ClassName: TimeThread
 * @Description: 计时线程
 * @author JD
 * @date 2018年7月27日
 */

public class TimeThread extends Thread{
	
	/**
	 * @Fields SLEEP : 休眠时长（1s）
	 */
	static final int SLEEP = 1000;
	
	/**
	 * @Fields start : 线程执行标志
	 */
	boolean start = true;
	
	/**
	 * @Fields end_time : 会议游戏截止时间
	 */
	Timestamp end_time;
	
	/**
	 * @Fields room_id : 会议房间ID
	 */
	String room_id;
	
	/**
	 * 创建一个新的实例 TimeThread.
	 *
	 * @param room_id 会议房间ID
	 * @param end_time 会议游戏截止时间
	 */
	public TimeThread(String room_id,Timestamp end_time){
		this.room_id = room_id;
		this.end_time = end_time;
	}
	
	
	public void run(){
		
		while(start){
			
			//距离会议游戏结束的时间
			long time = (new Timestamp(end_time.getTime() - System.currentTimeMillis()).getTime())/1000; 
			
			//倒计时结束
			if(time == 0) {
				System.out.println("倒计时结束");
				start = false;
				
				JSONObject json = new JSONObject();
				json.put("cmd", CMD.TIME_OVER);
				//将新动作加入队列
				synchronized(lock){
					aq.offer(new Action(CMD.TIME_OVER,room_id,json.toString()));
				}
			}
			
			int day = (int)(time/86400);
			int hour = (int)((time%86400)/3600);
			int minute = (int)(((time%86400)%3600)/60);
			int second = (int)(((time%86400)%3600)%60);
			
			JSONObject json = new JSONObject();
			json.put("cmd", CMD.TIME);
			json.put("day", day);
			json.put("hour", hour);
			json.put("minute", minute);
			json.put("second", second);
			
			//将新动作加入队列
			synchronized(lock){
				aq.offer(new Action(CMD.TIME,room_id,json.toString()));
			}
			
			try{
				Thread.sleep(SLEEP);
			}catch(Exception e){
				e.printStackTrace();
			}
		}
	}
}
