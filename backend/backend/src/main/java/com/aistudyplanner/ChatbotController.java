package com.aistudyplanner;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.javalin.Javalin;

public class ChatbotController {

    public static void registerRoutes(Javalin app) {

        // =========================================
        // CREATE NEW CHAT SESSION
        // =========================================
        app.post("/new-chat", ctx -> {

            try {

                Map<String, Object> body =
                        ctx.bodyAsClass(Map.class);

                if (body.get("userId") == null) {

                    ctx.status(400);
                    ctx.result("User ID missing");
                    return;
                }

                int userId =
                        Integer.parseInt(
                                body.get("userId").toString()
                        );

                Connection conn =
                        Database.connect();

                String sql =
                        "INSERT INTO chat_sessions " +
                        "(user_id, title) VALUES (?, ?)";

                PreparedStatement stmt =
                        conn.prepareStatement(
                                sql,
                                PreparedStatement.RETURN_GENERATED_KEYS
                        );

                stmt.setInt(1, userId);
                stmt.setString(2, "New Chat");

                stmt.executeUpdate();

                ResultSet rs =
                        stmt.getGeneratedKeys();

                int sessionId = 0;

                if (rs.next()) {

                    sessionId = rs.getInt(1);
                }

                Map<String, Object> response =
                        new HashMap<>();

                response.put("sessionId", sessionId);

                ctx.json(response);

                conn.close();

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500);
                ctx.result("new chat failed");
            }
        });

        // =========================================
        // SAVE CHAT MESSAGE
        // =========================================
        app.post("/save-chat", ctx -> {

            try {

                Map<String, Object> body =
                        ctx.bodyAsClass(Map.class);

                if (
                        body.get("userId") == null ||
                        body.get("sessionId") == null ||
                        body.get("message") == null ||
                        body.get("response") == null
                ) {

                    ctx.status(400);
                    ctx.result("Missing data");
                    return;
                }

                int userId =
                        Integer.parseInt(
                                body.get("userId").toString()
                        );

                int sessionId =
                        Integer.parseInt(
                                body.get("sessionId").toString()
                        );

                String message =
                        body.get("message").toString();

                String response =
                        body.get("response").toString();

                Connection conn =
                        Database.connect();

                String sql =
                        "INSERT INTO chat_history " +
                        "(user_id, session_id, message, response) " +
                        "VALUES (?, ?, ?, ?)";

                PreparedStatement stmt =
                        conn.prepareStatement(sql);

                stmt.setInt(1, userId);
                stmt.setInt(2, sessionId);
                stmt.setString(3, message);
                stmt.setString(4, response);

                stmt.executeUpdate();

                // update title automatically
                String titleSql =
                        "UPDATE chat_sessions " +
                        "SET title=? " +
                        "WHERE id=? AND title='New Chat'";

                PreparedStatement titleStmt =
                        conn.prepareStatement(titleSql);

                String shortTitle =
                        message.length() > 25
                                ? message.substring(0, 25)
                                : message;

                titleStmt.setString(1, shortTitle);
                titleStmt.setInt(2, sessionId);

                titleStmt.executeUpdate();

                conn.close();

                ctx.result("saved");

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500);
                ctx.result("save failed");
            }
        });

        // =========================================
        // GET CHAT SESSIONS
        // =========================================
        app.get("/chat-sessions/{userId}", ctx -> {

            try {

                int userId =
                        Integer.parseInt(
                                ctx.pathParam("userId")
                        );

                Connection conn =
                        Database.connect();

                String sql =
                        "SELECT * FROM chat_sessions " +
                        "WHERE user_id=? " +
                        "ORDER BY created_at DESC";

                PreparedStatement stmt =
                        conn.prepareStatement(sql);

                stmt.setInt(1, userId);

                ResultSet rs =
                        stmt.executeQuery();

                List<Map<String, Object>> sessions =
                        new ArrayList<>();

                while (rs.next()) {

                    Map<String, Object> session =
                            new HashMap<>();

                    session.put(
                            "id",
                            rs.getInt("id")
                    );

                    session.put(
                            "title",
                            rs.getString("title")
                    );

                    sessions.add(session);
                }

                ctx.json(sessions);

                conn.close();

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500);
                ctx.result("load sessions failed");
            }
        });

        // =========================================
        // LOAD CHAT HISTORY
        // =========================================
        app.get("/chat-history/{sessionId}", ctx -> {

            try {

                int sessionId =
                        Integer.parseInt(
                                ctx.pathParam("sessionId")
                        );

                Connection conn =
                        Database.connect();

                String sql =
                        "SELECT * FROM chat_history " +
                        "WHERE session_id=? " +
                        "ORDER BY created_at ASC";

                PreparedStatement stmt =
                        conn.prepareStatement(sql);

                stmt.setInt(1, sessionId);

                ResultSet rs =
                        stmt.executeQuery();

                List<Map<String, String>> chats =
                        new ArrayList<>();

                while (rs.next()) {

                    String userMessage =
                            rs.getString("message");

                    String aiResponse =
                            rs.getString("response");

                    if (
                            userMessage != null &&
                            !userMessage.isEmpty()
                    ) {

                        Map<String, String> userMsg =
                                new HashMap<>();

                        userMsg.put("role", "user");
                        userMsg.put("text", userMessage);

                        chats.add(userMsg);
                    }

                    if (
                            aiResponse != null &&
                            !aiResponse.isEmpty()
                    ) {

                        Map<String, String> aiMsg =
                                new HashMap<>();

                        aiMsg.put("role", "ai");
                        aiMsg.put("text", aiResponse);

                        chats.add(aiMsg);
                    }
                }

                ctx.json(chats);

                conn.close();

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500);
                ctx.result("load failed");
            }
        });

        // =========================================
        // DELETE CHAT SESSION
        // =========================================
        app.delete("/delete-chat/{sessionId}", ctx -> {

            try {

                int sessionId =
                        Integer.parseInt(
                                ctx.pathParam("sessionId")
                        );

                Connection conn =
                        Database.connect();

                String deleteMessages =
                        "DELETE FROM chat_history " +
                        "WHERE session_id=?";

                PreparedStatement stmt1 =
                        conn.prepareStatement(deleteMessages);

                stmt1.setInt(1, sessionId);

                stmt1.executeUpdate();

                String deleteSession =
                        "DELETE FROM chat_sessions " +
                        "WHERE id=?";

                PreparedStatement stmt2 =
                        conn.prepareStatement(deleteSession);

                stmt2.setInt(1, sessionId);

                stmt2.executeUpdate();

                conn.close();

                ctx.result("deleted");

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500);
                ctx.result("delete failed");
            }
        });
    }
}