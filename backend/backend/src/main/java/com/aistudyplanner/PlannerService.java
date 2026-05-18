package com.aistudyplanner;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class PlannerService {

    // SAVE TASK
    public static void saveTask(PlannerTask task) {

        try {

            Connection conn =
                    Database.connect();

            String sql =
                    "INSERT INTO planner_tasks " +
                    "(user_id, title, due_date, description, status) " +
                    "VALUES (?, ?, ?, ?, ?)";

            PreparedStatement stmt =
                    conn.prepareStatement(sql);

            stmt.setInt(1, task.userId);
            stmt.setString(2, task.title);
            stmt.setString(3, task.dueDate);
            stmt.setString(4, task.description);
            stmt.setString(5, task.status);

            stmt.executeUpdate();

            conn.close();

        } catch (Exception e) {

            e.printStackTrace();
        }
    }

    // GET TASKS
    public static List<PlannerTask>
    getTasks(int userId) {

        List<PlannerTask> tasks =
                new ArrayList<>();

        try {

            Connection conn =
                    Database.connect();

            String sql =
                    "SELECT * FROM planner_tasks " +
                    "WHERE user_id=?";

            PreparedStatement stmt =
                    conn.prepareStatement(sql);

            stmt.setInt(1, userId);

            ResultSet rs =
                    stmt.executeQuery();

            while (rs.next()) {

                PlannerTask task =
                        new PlannerTask();

                task.id =
                        rs.getInt("id");

                task.userId =
                        rs.getInt("user_id");

                task.title =
                        rs.getString("title");

                task.dueDate =
                        rs.getString("due_date");

                task.description =
                        rs.getString("description");

                task.status =
                        rs.getString("status");

                tasks.add(task);
            }

            conn.close();

        } catch (Exception e) {

            e.printStackTrace();
        }

        return tasks;
    }
}