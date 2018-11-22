package com.bn.Database;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.naming.spi.DirStateFactory.Result;
import javax.xml.stream.events.StartDocument;

/**
 * @ClassName: DBUtil
 * @Description: 数据库管理类
 * @author JD
 * @date 2018年7月28日
 *
 */
public class DBUtil {
	
	/**
	 * @Title: getConnection
	 * @Description: 连接数据库
	 * @return Connection 
	 */
	private static Connection getConnection()					// 创建与数据库连接的方法
	{
		Connection con = null;									// 声明连接
		try
		{
			Class.forName("com.mysql.jdbc.Driver");				// 声明驱动
			// 测试的本地URL
//			String url = "jdbc:mysql://localhost:3306/birdgame?useUnicode=true" +
//	    	 		"&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&autoReconnect=true&failOverReadOnly=false";
//			con = DriverManager.getConnection(url,"root","initial123");  //获取连接
			
			String url = "jdbc:mysql://chuangyh.com:3306/ChuangYi?useUnicode=true" +
	    	 		"&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&autoReconnect=true&failOverReadOnly=false";
			con = DriverManager.getConnection(url,"p1p1us","p1p1us");  //获取连接
		}
		catch(Exception e)
		{
			e.printStackTrace();								// 异常处理
		}
		return con;
	}
	
	/**
	 * @Title: getUserNameAndPic
	 * @Description: 查询用户昵称与图片路径
	 * @param user_id
	 * @return String[]  
	 */
	public static String[] getUserNameAndPic(String user_id){
		
		Connection con = getConnection();
		Statement st = null;
		ResultSet rs = null;
		String sql = null;
		
		String[] str = new String[2];
		try
		{
			st = con.createStatement();
			sql="select name,icon from user where id='"+user_id+"';";
			rs = st.executeQuery(sql);
		
			if(rs.next())
			{
				str[0] = rs.getString(1);
				str[1] = rs.getString(2);
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(SQLException e){e.printStackTrace();}
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	
		return str;
	}
	
	/**
	 * @Title: getMeetingRoom
	 * @Description: 根据输入的ID模糊查询对应的会议房间，此时搜索出的会议房间是在起始与结束时间之内的
	 * @param search_id
	 * @return ArrayList<String>  
	 */
	public static ArrayList<String> getMeetingRoom(String search_id) {
		
		Connection con = getConnection();
		Statement st = null;
		ResultSet rs = null;
		String sql = null;
		
		ArrayList<String> al = new ArrayList<String>();
		try
		{
			st = con.createStatement();
			sql="select meeting_id,meeting_name,start_time,end_time from game_meeting_data "+ 
					"where meeting_id like '%"+search_id+"%' "+
					"and unix_timestamp(start_time) < unix_timestamp(NOW()) "+
					"and unix_timestamp(end_time) > unix_timestamp(NOW());";
			rs = st.executeQuery(sql);
		
			while(rs.next())
			{
				al.add(rs.getString(1) + "|" + rs.getString(2));
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(SQLException e){e.printStackTrace();}
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	
		return al;
	}
	
	
	/**
	 * @Title: getInvitationRoom 
	 * @Description: 模糊搜索邀约房间
	 * @param search_id
	 * @return ArrayList<String>  
	 */
	public static ArrayList<String> getInvitationRoom(String search_id) {
		
		Connection con = getConnection();
		Statement st = null;
		ResultSet rs = null;
		String sql = null;
		
		ArrayList<String> al = new ArrayList<String>();
		try
		{
			st = con.createStatement();
//			sql="select invitation_id,invitation_name from invitation_data "+ 
//					"where invitation_id REGEXP '[0-9]{4}"+search_id+"';";
			sql="select invitation_id,invitation_name from game_invitation_data "+ 
			"where invitation_id like '%"+search_id+"%';";
			rs = st.executeQuery(sql);
		
			while(rs.next())
			{
				al.add(rs.getString(1) + "|" + rs.getString(2));
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(SQLException e){e.printStackTrace();}
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	
		return al;
	}
	
	/**
	 * @Title: insertMeetingRoom
	 * @Description: 插入会议房间
	 * @param meeting_id
	 * @param meeting_name
	 * @param start_time
	 * @param end_time
	 * @param admin_id void  
	 */
	public static void insertMeetingRoom(String meeting_id,String meeting_name,Timestamp start_time,Timestamp end_time,String admin_id) {
		
		Connection con = getConnection();
		Statement st = null;
		String sql = null;
		
		try
		{
			st = con.createStatement();
			sql="insert into game_meeting_data(meeting_id,meeting_name,start_time,end_time,admin_id) value('"
					+ meeting_id+"','"+meeting_name+"','"+start_time+"','"+end_time+"','"+admin_id+"');";
			st.execute(sql);
		
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	}
	
	
	/**
	 * @Title: getScore
	 * @Description: 获取user_id用户在room_id房间内得最高得分
	 * @param user_id 用户ID
	 * @param room_id 房间ID
	 * @return String 得分
	 */
	public static String getScore(String user_id, String room_id) {
		
		Connection con = getConnection();
		Statement st = null;
		ResultSet rs = null;
		String sql = null;
		
		String ans = null;
		try
		{
			st = con.createStatement();
			sql="select score,user_id,room_id from game_score "+ 
					"where user_id = '"+ user_id +"' "+
					"and room_id = '"+ room_id + "'; ";
			rs = st.executeQuery(sql);
		
			if(rs.next())
			{
				ans = rs.getInt(1)+"";
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(SQLException e){e.printStackTrace();}
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	
		return ans;
	}
	
	
	/**
	 * @Title: insertScore
	 * @Description: 向得分表插入分值
	 * @param user_id 用户ID
	 * @param room_id 房间ID
	 * @param score 得分
	 */
	public static void insertScore(String user_id, String room_id, int score) {
		Connection con = getConnection();
		Statement st = null;
		String sql = null;
		
		try
		{
			st = con.createStatement();
			sql="insert into game_score(user_id, room_id, score) value('"
					+ user_id+"','"+room_id+"','"+score+"');";
			st.execute(sql);
		
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	}
	
	/**
	 * @Title: updateScore
	 * @Description: 更新得分表
	 * @param user_id
	 * @param room_id
	 * @param score void  
	 */
	public static void updateScore(String user_id, String room_id, int score) {
		Connection con = getConnection();
		Statement st = null;
		String sql = null;
		
		try
		{
			st = con.createStatement();
			sql="update game_score set score = '"+ score +"'where user_id='"+user_id+"' "
					+"and room_id = '"+ room_id +"';";
			st.execute(sql);
		
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	}
	

	/**
	 * @Title: getRank
	 * @Description: 获取房间内的得分排名
	 * @param room_id
	 * @return String  
	 */
	public static ArrayList<String> getRankList(String room_id) {
		
		Connection con = getConnection();
		Statement st = null;
		ResultSet rs = null;
		String sql = null;
		
		ArrayList<String> al = new ArrayList<String>();
		try
		{
			st = con.createStatement();
			sql="select user_id,score,room_id from game_score "+ 
					"where room_id = '"+ room_id + "' order by score desc; ";
			rs = st.executeQuery(sql);
		
			while(rs.next())
			{
				al.add(rs.getString(1)+"|"+rs.getString(2));
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(SQLException e){e.printStackTrace();}
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	
		return al;
	}
	
	/**
	 * @Title: getSponsorLogo
	 * @Description: 获取赞助商Logo
	 * @param room_id
	 * @return ArrayList<String>  
	 */
	public static ArrayList<String> getSponsorLogo(String room_id){
		
		Connection con = getConnection();
		Statement st = null;
		ResultSet rs = null;
		String sql = null;
		
		ArrayList<String> al = new ArrayList<String>();
		try
		{
			st = con.createStatement();
			sql="select logo from game_logo where room_id='"+room_id+"';";
			rs = st.executeQuery(sql);
		
			while(rs.next())
			{
				al.add(rs.getString(1));
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(SQLException e){e.printStackTrace();}
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	
		return al;
	}
	
	/**
	 * @Title: insertSponsorLogo
	 * @Description: 插入赞助商
	 * @param room_id 用户ID
	 * @param logo_name Logo名称
	 */
	public static void insertSponsorLogo(String room_id, String logo_name) {
		Connection con = getConnection();
		Statement st = null;
		String sql = null;
		
		try
		{
			st = con.createStatement();
			sql="insert into game_logo(room_id, logo) value('"
					+ room_id+"','"+logo_name+"');";
			st.execute(sql);
		
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	}
	
	
	
	
	/**
	 * @Title: havaSameInviteRoom
	 * @Description: 查找数据库中是否有相同名称的邀约房间
	 * @param room_name
	 * @return boolean  
	 */
	public static boolean havaSameInviteRoom(String room_name) {
		
		Connection con = getConnection();
		Statement st = null;
		ResultSet rs = null;
		String sql = null;
		
		boolean answer = false;
		try
		{
			st = con.createStatement();
			sql="select * from game_invitation_data where invitation_name='"+room_name+"';";
			rs = st.executeQuery(sql);
		
			if(rs.next())
			{
				answer = true;
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{rs.close();}catch(SQLException e){e.printStackTrace();}
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
		return answer;
	}
	

	/**
	 * @Title: insertInviteRoom
	 * @Description: 向数据库中插入邀约房间
	 * @param user_id
	 * @param room_id
	 * @param room_name  
	 */
	public static void insertInviteRoom(String user_id, String room_id, String room_name) {
		Connection con = getConnection();
		Statement st = null;
		String sql = null;
		
		try
		{
			st = con.createStatement();
			sql="insert into game_invitation_data(invitation_id, invitation_name, homeowner_id) value('"
					+ room_id+"','"+room_name+"','"+user_id+"');";
			st.execute(sql);
		
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			try{st.close();}catch(SQLException e){e.printStackTrace();}
			try{con.close();}catch(SQLException e){e.printStackTrace();}
		}
	}
	
}
