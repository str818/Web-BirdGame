package com.bn.Server;

import com.bn.Server.ActionThread;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;

public class GameServer
{
    private int port;

    public GameServer(int port) 
    {
        this.port = port;
    }

    public void doTask() throws Exception 
    {
    	//启动任务线程
    	new ActionThread().start();
    	
    	//创建用于接收连接请求的多线程事件消息循环组
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        //创建用于执行具体业务逻辑的的多线程事件消息循环组
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap b = new ServerBootstrap(); 
            b.group(bossGroup, workerGroup)
             .channel(NioServerSocketChannel.class) 
             .childHandler(new GameServerInitializer())  
             //配置tcp参数，将BACKLOG设置为128
             .option(ChannelOption.SO_BACKLOG, 128)
             .childOption(ChannelOption.SO_KEEPALIVE, true); 

            System.out.println("服务器启动...");

            //绑定端口，并调用sync方法阻塞等待绑定工作结束
            ChannelFuture f = b.bind(port).sync(); 

            //调用sync阻塞主线程，保证服务端关闭后main方法才退出
            f.channel().closeFuture().sync();

        }finally 
        {
        	//优雅地关闭线程组
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
        }
    }
}
