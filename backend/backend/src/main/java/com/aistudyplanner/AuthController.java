package com.aistudyplanner;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;

import io.javalin.Javalin;

public class AuthController {

    public static void registerRoutes(Javalin app) {

        // =====================================
        // REGISTER
        // =====================================

        app.post("/register", ctx -> {

            try {

                User user = ctx.bodyAsClass(User.class);

                Connection conn = Database.connect();

                // CHECK USER EXISTS
                String checkSql =
                        "SELECT * FROM users WHERE username = ?";

                PreparedStatement checkStmt =
                        conn.prepareStatement(checkSql);

                checkStmt.setString(
                        1,
                        user.getUsername()
                );

                ResultSet rs =
                        checkStmt.executeQuery();

                if (rs.next()) {

                    ctx.json(
                            Map.of(
                                    "status", "error",
                                    "message", "User already exists"
                            )
                    );

                    conn.close();
                    return;
                }

                // INSERT USER
                String sql =
                        "INSERT INTO users (username, password) VALUES (?, ?)";

                PreparedStatement stmt =
                        conn.prepareStatement(sql);

                stmt.setString(
                        1,
                        user.getUsername()
                );

                stmt.setString(
                        2,
                        user.getPassword()
                );

                stmt.executeUpdate();

                conn.close();

                ctx.json(
                        Map.of(
                                "status", "success",
                                "message", "Registered successfully"
                        )
                );

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500).json(
                        Map.of(
                                "status", "error",
                                "message", "Register failed"
                        )
                );
            }
        });

        // =====================================
        // LOGIN
        // =====================================

        app.post("/login", ctx -> {

            try {

                LoginRequest req =
                        ctx.bodyAsClass(LoginRequest.class);

                Connection conn =
                        Database.connect();

                String sql =
                        "SELECT * FROM users WHERE username=? AND password=?";

                PreparedStatement ps =
                        conn.prepareStatement(sql);

                ps.setString(
                        1,
                        req.getUsername()
                );

                ps.setString(
                        2,
                        req.getPassword()
                );

                ResultSet rs =
                        ps.executeQuery();

                if (rs.next()) {

                    int userId =
                            rs.getInt("id");

                    String token =
                            JwtUtil.generateToken(userId);

                    ctx.json(
                            Map.of(
                                    "success", true,
                                    "token", token,
                                    "userId", userId,
                                    "username", rs.getString("username")
                            )
                    );

                } else {

                    ctx.status(401).json(
                            Map.of(
                                    "success", false,
                                    "message", "Invalid credentials"
                            )
                    );
                }

                conn.close();

            } catch (Exception e) {

                e.printStackTrace();

                ctx.status(500).json(
                        Map.of(
                                "status", "error",
                                "message", "Login failed"
                        )
                );
            }
        });
    }
}