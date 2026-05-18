package com.aistudyplanner;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import io.javalin.Javalin;

public class PlannerController {

    // ===============================
    // REGISTER ROUTES
    // ===============================
    public static void registerRoutes(Javalin app) {

        // ===============================
        // ADD TASK
        // ===============================
        app.post("/planner/add", ctx -> {

            try {

                PlannerTask task =
                        ctx.bodyAsClass(
                                PlannerTask.class
                        );

                System.out.println(
                        "ADDING TASK FOR USER: "
                                + task.userId
                );

                Connection conn =
                        Database.connect();

                String sql =
                        "INSERT INTO planner_tasks " +
                        "(user_id, title, due_date, description, status) " +
                        "VALUES (?, ?, ?, ?, ?)";

                PreparedStatement stmt =
                        conn.prepareStatement(sql);

                stmt.setInt(
                        1,
                        task.userId
                );

                stmt.setString(
                        2,
                        task.title
                );

                stmt.setString(
                        3,
                        task.dueDate
                );

                stmt.setString(
                        4,
                        task.description
                );

                stmt.setString(
                        5,
                        task.status
                );

                stmt.executeUpdate();

                conn.close();

                ctx.json(
                        java.util.Map.of(
                                "status",
                                "success"
                        )
                );

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500);

                ctx.result(
                        "Task add failed"
                );
            }
        });

        // ===============================
        // GET TASKS
        // ===============================
        app.get("/planner/{userId}", ctx -> {

            try {

                String userIdParam =
        ctx.pathParam("userId");

if (
    userIdParam == null ||
    userIdParam.equals("undefined")
) {

    ctx.status(400);

    ctx.result("Invalid userId");

    return;
}

int userId =
        Integer.parseInt(userIdParam);
                System.out.println(
                        "LOADING TASKS FOR USER: "
                                + userId
                );

                Connection conn =
                        Database.connect();

                String sql =
                        "SELECT * FROM planner_tasks " +
                        "WHERE user_id = ?";

                PreparedStatement stmt =
                        conn.prepareStatement(sql);

                stmt.setInt(1, userId);

                ResultSet rs =
                        stmt.executeQuery();

                List<PlannerTask> tasks =
                        new ArrayList<>();

                while (rs.next()) {

                    PlannerTask task =
                            new PlannerTask();

                    task.id =
                            rs.getInt("id");

                    task.userId =
                            rs.getInt("user_id");

                    task.title =
                            rs.getString("title") != null
                                    ? rs.getString("title")
                                    : "";

                    task.dueDate =
                            rs.getString("due_date") != null
                                    ? rs.getString("due_date")
                                    : "";

                    task.description =
                            rs.getString("description") != null
                                    ? rs.getString("description")
                                    : "";

                    task.status =
                            rs.getString("status") != null
                                    ? rs.getString("status")
                                    : "";

                    tasks.add(task);
                }

                conn.close();

                ctx.json(tasks);

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500);

                ctx.result(
                        "Planner load failed"
                );
            }
        });
        // ===============================
// UPDATE TASK STATUS
// ===============================
app.put("/planner/update-status", ctx -> {

    try {

        PlannerTask task =
                ctx.bodyAsClass(
                        PlannerTask.class
                );

        Connection conn =
                Database.connect();

        String sql =
                "UPDATE planner_tasks " +
                "SET status = ? " +
                "WHERE id = ?";

        PreparedStatement stmt =
                conn.prepareStatement(sql);

        stmt.setString(
                1,
                task.status
        );

        stmt.setInt(
                2,
                task.id
        );

        stmt.executeUpdate();

        conn.close();

        ctx.json(
                java.util.Map.of(
                        "status",
                        "success"
                )
        );

    } catch (Exception e) {

        e.printStackTrace();

        ctx.status(500);

        ctx.result(
                "Status update failed"
        );
    }
});

    } // ✅ THIS BRACKET WAS MISSING

    // ===============================
    // DTO CLASS
    // ===============================
    public static class PlannerTask {

        public int id;

        public int userId;

        public String title;

        public String dueDate;

        public String description;

        public String status;
    }
}