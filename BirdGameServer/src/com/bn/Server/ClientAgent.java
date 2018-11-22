package com.bn.Server;
import java.util.*;

import io.netty.channel.Channel;
public class ClientAgent {
		
	//此客户端的信道
	Channel channel;
	//用户ID
	String user_id;
	//昵称
	String user_name;
	//图片名称
	String user_photo;
	//是否在线
	boolean isOnLine;
	
	public ClientAgent(Channel channel,String user_id,String user_name,String user_photo){
		this.channel=channel;
		this.user_id = user_id;
		this.user_name = user_name;
		this.user_photo = user_photo;
		this.isOnLine = true;
	}
	
	public ClientAgent(String user_id,String user_name,String user_photo) {
		this.user_id = user_id;
		this.user_name = user_name;
		this.user_photo = user_photo;
		this.isOnLine = false;
	}
}
