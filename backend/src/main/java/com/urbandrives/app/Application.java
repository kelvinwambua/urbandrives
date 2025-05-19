package com.urbandrives.app;

import com.urbandrives.app.config.DatabaseConnection;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.sql.Connection;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        try {

            Connection conn = DatabaseConnection.getConnection();
            System.out.println("Database connection successful!");
            SpringApplication.run(Application.class, args);

        } catch (Exception e) {
            System.out.println("Database connection failed: " + e.getMessage());
            e.printStackTrace();
        }
    }


    }

