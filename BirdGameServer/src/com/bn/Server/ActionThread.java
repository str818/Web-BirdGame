package com.bn.Server;

public class ActionThread extends Thread{
	
	static final int SLEEP = 5;
	boolean flag = true;
	
	public void run(){
		
		while(flag){
			
			Action a = null;
			synchronized(Room.lock){
				//获取并移除动作元素
				a = Room.aq.poll();
			}
			
			if(a!=null){
				a.doAction();
			}else{
				try{
					Thread.sleep(SLEEP);
				}catch(Exception e){
					e.printStackTrace();
				}
			}
		}
	}
}
