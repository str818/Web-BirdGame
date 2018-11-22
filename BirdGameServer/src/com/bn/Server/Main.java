package com.bn.Server;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Locale;

import com.bn.Database.DBUtil;

public class Main 
{
	public static void main(String[] args) throws Exception
    {   
		new GameServer(9999).doTask();
    }
}
