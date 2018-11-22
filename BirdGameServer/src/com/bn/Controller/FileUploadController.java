package com.bn.Controller;

import java.io.File;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.bn.Database.DBUtil;
import com.bn.Server.Room;
import com.sun.org.apache.xerces.internal.impl.xpath.regex.ParseException;

@Controller
public class FileUploadController {
	@RequestMapping(value="/{formName}")
	 public String loginForm(@PathVariable String formName) {
		// 动态跳转页面
		return formName;
	}
	
	//上传文件会自动绑定到MultipartFile中
	 @RequestMapping(value="/upload",method=RequestMethod.POST)
	 public String upload(HttpServletRequest request,
			@RequestParam("file") MultipartFile file) throws Exception {
		
		String room_id = request.getParameter("room_id");
	    System.out.println("进入:"+room_id);
	    //如果文件不为空，写入上传路径
		if(!file.isEmpty()) {
			//上传文件路径
			String path = request.getServletContext().getRealPath("/loaded/");
			System.out.println("路径:"+path);
			//上传文件名
			String originalName = file.getOriginalFilename();
			String type = originalName.substring(originalName.indexOf('.'), originalName.length());
			System.out.println("图片类型:"+type);
			//重新定义图片名称,根据时间戳定义文件,后接两位随机数
			String filename = room_id+"_"+System.currentTimeMillis()
				+"_"+(int)(Math.random()*9)+(int)(Math.random()*9)+type;
			System.out.println("文件名称:"+filename);
		    File filepath = new File(path,filename);
			//判断路径是否存在，如果不存在就创建一个
	        if (!filepath.getParentFile().exists()) { 
	        	filepath.getParentFile().mkdirs();
	        }
	        //将上传文件保存到一个目标文件当中
			file.transferTo(new File(path + File.separator + filename));
			DBUtil.insertSponsorLogo(room_id, "loaded/"+filename);
			return "success";
		}
		return null;
	 }
	 
	 @RequestMapping(value="/meetingForm")
	 public ModelAndView createMeeting(HttpServletRequest request,
			 @RequestParam("meeting_name") String meeting_name,
			 @RequestParam("start_time") String start_time,
			 @RequestParam("end_time") String end_time)throws Exception {
		
		 System.out.println(meeting_name+" "+start_time+" "+end_time);
		 
		 String room_id = "";
		 try {
			 room_id = Room.createMeetingRoom(meeting_name,Room.string2Time(start_time),Room.string2Time(end_time),"000");
		 }catch(ParseException e) {}
		 
		 System.out.println(room_id);
		 request.setAttribute("room_id",room_id);  
		 return new ModelAndView("uploadLogo","room_id",room_id);
	 }

}