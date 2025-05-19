package com.urbandrives.app.config;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://gondola.proxy.rlwy.net:51520/railway";
    private static final String USER = "root";
    private static final String PASS = "hVsObbTOGpknIrHwxvtAIFKyKonVcYgf";

    public static Connection getConnection() throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        return DriverManager.getConnection(URL, USER, PASS);
    }
}
