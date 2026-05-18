package com.aistudyplanner;

import java.sql.Connection;

public class TestDB {

    public static void main(String[] args) {

        Connection conn = null;

        try {

            conn = Database.connect();

            if (conn != null) {
                System.out.println("✅ Database Connected Successfully");
            } else {
                System.out.println("❌ Database Connection Failed");
            }

        } catch (Exception e) {

            e.printStackTrace();

        } finally {

            try {

                if (conn != null) {
                    conn.close();
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}