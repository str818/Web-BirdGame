package com.bn.Server;

import java.util.Arrays;
import io.netty.channel.*;
import io.netty.channel.group.*;
import io.netty.handler.codec.http.websocketx.*;
import io.netty.util.concurrent.*;
import net.sf.json.JSONObject;

import com.bn.Util.CMD;
import com.bn.Database.DBUtil;
import com.bn.Server.Action;
import com.bn.Server.Room;

import static com.bn.Server.Room.*;

public class GameServerHandler extends SimpleChannelInboundHandler<Object> 
{
	public static ChannelGroup channels = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

	//当服务器读取到客户端的信息
	@Override
	protected void channelRead0(ChannelHandlerContext ctx,Object msg) throws Exception 
	{ 
		
		if (msg instanceof BinaryWebSocketFrame) {
            throw new UnsupportedOperationException(String.format(
                    "%s frame types not supported", msg.getClass().getName()));
        }
		
        if(msg instanceof TextWebSocketFrame){
            // 返回应答消息
            String request = ((TextWebSocketFrame) msg).text();
            System.out.println(request);
            
            JSONObject jsonObject = JSONObject.fromObject(request);
            int cmd = jsonObject.optInt("cmd");
            String user_id = jsonObject.optString("user_id");
            String room_id = jsonObject.optString("room_id");
            String search_id = jsonObject.optString("search_id");
            String score = jsonObject.optString("score");
            String room_name = jsonObject.optString("room_name");
            
            //将新动作加入队列
			synchronized(lock){
				aq.offer(new Action(ctx.channel(),cmd,room_id,user_id,search_id,score,room_name));
			}
        }
	}
	
	//当服务器收到客户端断开消息时调用
	@Override
	public void handlerRemoved(ChannelHandlerContext ctx) throws Exception 
	{  
		//获取当前的Channel
		Channel incoming = ctx.channel();
		
		//遍历在线用户列表，通知下线消息
		for (Channel channel : channels) 
		{
		    //channel.writeAndFlush(new TextWebSocketFrame("[SERVER] - " + incoming.remoteAddress() + " 离开"));
		}
		//将新用户从列表中删除
		channels.remove(ctx.channel());
		//打印服务器日志
		System.out.println("客户端:"+incoming.remoteAddress() +"离开");		
	}
	
	//服务器监听到客户端活动
	@Override
	public void channelActive(ChannelHandlerContext ctx) throws Exception 
	{ 
		//打印客户端IP地址
        //System.out.println("Active:"+ctx.channel().remoteAddress());
	}
	
	
	//捕获异常
	@Override
	public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause)
	    throws Exception 
	{
		//Channel incoming = ctx.channel();
		//System.out.println("客户端:"+incoming.remoteAddress()+"异常");
		// 当出现异常就关闭连接
		cause.printStackTrace();
		ctx.close();

	}
}