
package com.bn.Web;

import javax.servlet.*;

import com.bn.Server.GameServer;

import java.io.*;

public class BirdGameContextListener implements ServletContextListener
{
	/*
	 * 这个监听器的添加是在本项目的
	 * WebRoot-WEB-INF-web.xml目录下添加的
	 */
	
	// 这个方法在Web应用服务做好接受请求的时候被调用。
	public void contextInitialized(ServletContextEvent sce)
	{
		new Thread(){
			@Override
			public void run(){
				try{
					new GameServer(9988).doTask();
				}catch(Exception e){
					e.printStackTrace();
				}
			}
		}.start();
	}
	// 这个方法在Web应用服务被移除，没有能力再接受请求的时候被调用。
	public void contextDestroyed(ServletContextEvent sce)
	{
		
	}	
}