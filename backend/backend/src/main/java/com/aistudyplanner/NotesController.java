package com.aistudyplanner;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import io.javalin.Javalin;

public class NotesController {

    public static void registerRoutes(Javalin app) {

        // =========================
        // SAVE NOTE
        // =========================
        app.post("/notes/save", ctx -> {

            try {

                NoteRequest note =
                        ctx.bodyAsClass(
                                NoteRequest.class
                        );

                Connection conn =
                        Database.connect();

                String checkSql =
                        "SELECT * FROM planner_notes " +
                        "WHERE user_id=? AND task_title=?";

                PreparedStatement checkStmt =
                        conn.prepareStatement(checkSql);

                checkStmt.setInt(
                        1,
                        note.userId
                );

                checkStmt.setString(
                        2,
                        note.taskTitle
                );

                ResultSet rs =
                        checkStmt.executeQuery();

                // UPDATE
                if (rs.next()) {

                    String updateSql =
                            "UPDATE planner_notes " +
                            "SET note=? " +
                            "WHERE user_id=? AND task_title=?";

                    PreparedStatement updateStmt =
                            conn.prepareStatement(updateSql);

                    updateStmt.setString(
                            1,
                            note.note
                    );

                    updateStmt.setInt(
                            2,
                            note.userId
                    );

                    updateStmt.setString(
                            3,
                            note.taskTitle
                    );

                    updateStmt.executeUpdate();

                }

                // INSERT
                else {

                    String insertSql =
                            "INSERT INTO planner_notes " +
                            "(user_id, task_title, note) " +
                            "VALUES (?, ?, ?)";

                    PreparedStatement insertStmt =
                            conn.prepareStatement(insertSql);

                    insertStmt.setInt(
                            1,
                            note.userId
                    );

                    insertStmt.setString(
                            2,
                            note.taskTitle
                    );

                    insertStmt.setString(
                            3,
                            note.note
                    );

                    insertStmt.executeUpdate();
                }

                conn.close();

                ctx.result(
                        "Note saved"
                );

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500);

                ctx.result(
                        "Save failed"
                );
            }
        });

        // =========================
        // GET NOTE
        // =========================
        app.get("/notes/{userId}/{taskTitle}", ctx -> {

            try {

                int userId =
                        Integer.parseInt(
                                ctx.pathParam(
                                        "userId"
                                )
                        );

                String taskTitle =
                        ctx.pathParam(
                                "taskTitle"
                        );

                Connection conn =
                        Database.connect();

                String sql =
                        "SELECT * FROM planner_notes " +
                        "WHERE user_id=? " +
                        "AND task_title=?";

                PreparedStatement stmt =
                        conn.prepareStatement(sql);

                stmt.setInt(
                        1,
                        userId
                );

                stmt.setString(
                        2,
                        taskTitle
                );

                ResultSet rs =
                        stmt.executeQuery();

                String note = "";

                if (rs.next()) {

                    note =
                            rs.getString(
                                    "note"
                            );
                }

                conn.close();

                ctx.result(note);

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500);

                ctx.result(
                        "Load failed"
                );
            }
        });
    }

    // DTO
    public static class NoteRequest {

        public int userId;

        public String taskTitle;

        public String note;
    }
}