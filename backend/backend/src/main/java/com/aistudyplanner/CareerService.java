package com.aistudyplanner;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class CareerService {

    // ===============================
    // 🎯 RECOMMEND CAREERS
    // ===============================
    public static List<CareerController.CareerResponseDTO>
    recommendCareers(
            List<String> interests,
            List<String> skills
    ) {

        List<CareerController.CareerResponseDTO>
                careers = new ArrayList<>();

        try {

            Connection conn = Database.connect();

            // ===============================
            // ✅ GET ALL CAREERS
            // ===============================
            String careerQuery =
                    "SELECT * FROM careers";

            PreparedStatement careerStmt =
                    conn.prepareStatement(careerQuery);

            ResultSet careerRs =
                    careerStmt.executeQuery();

            // ===============================
            // ✅ LOOP THROUGH CAREERS
            // ===============================
            while (careerRs.next()) {

                int careerId =
                        careerRs.getInt("id");

                String careerName =
                        careerRs.getString("name");

                int score = 0;

                List<String> matchedSkills =
                        new ArrayList<>();

                // ===============================
                // ✅ GET CAREER SKILLS
                // ===============================
                String skillQuery =
                        "SELECT skill " +
                        "FROM career_skills " +
                        "WHERE career_id = ?";

                PreparedStatement skillStmt =
                        conn.prepareStatement(skillQuery);

                skillStmt.setInt(1, careerId);

                ResultSet skillRs =
                        skillStmt.executeQuery();

                // ===============================
                // ✅ MATCH USER INTERESTS + SKILLS
                // ===============================
                while (skillRs.next()) {

                    String dbSkill =
                            skillRs.getString("skill")
                                    .toLowerCase();

                    // 🔥 INTEREST MATCH
                    for (String interest : interests) {

                        if (dbSkill.contains(
                                interest.toLowerCase())) {

                            score++;

                            if (!matchedSkills.contains(dbSkill)) {

                                matchedSkills.add(dbSkill);
                            }
                        }
                    }

                    // 🔥 SKILL MATCH
                    for (String userSkill : skills) {

                        if (dbSkill.contains(
                                userSkill.toLowerCase())) {

                            score++;

                            if (!matchedSkills.contains(dbSkill)) {

                                matchedSkills.add(dbSkill);
                            }
                        }
                    }
                }

                // ===============================
                // ✅ GET ROADMAP
                // ===============================
                List<String> path =
                        new ArrayList<>();

                String roadmapQuery =
                        "SELECT step_title " +
                        "FROM career_roadmaps " +
                        "WHERE career_id = ? " +
                        "ORDER BY step_order ASC";

                PreparedStatement roadmapStmt =
                        conn.prepareStatement(roadmapQuery);

                roadmapStmt.setInt(1, careerId);

                ResultSet roadmapRs =
                        roadmapStmt.executeQuery();

                while (roadmapRs.next()) {

                    path.add(
                            roadmapRs.getString(
                                    "step_title"
                            )
                    );
                }

                // ===============================
                // ✅ GET VIDEOS
                // ===============================
                List<CareerVideoDTO> videos =
                        new ArrayList<>();

                String videoQuery =
                        "SELECT * FROM career_videos " +
                        "WHERE career_id = ?";

                PreparedStatement videoStmt =
                        conn.prepareStatement(videoQuery);

                videoStmt.setInt(1, careerId);

                ResultSet videoRs =
                        videoStmt.executeQuery();

                while (videoRs.next()) {

                    videos.add(

                            new CareerVideoDTO(

                                    videoRs.getString("topic"),

                                    videoRs.getString("video_title"),

                                    videoRs.getString("youtube_url"),

                                    videoRs.getString("channel_name")
                            )
                    );
                }

                // ===============================
                // ✅ ADD RESULT
                // ===============================
                if (score > 0) {

                    careers.add(

                            new CareerController
                                    .CareerResponseDTO(

                                    careerName,
                                    score,
                                    matchedSkills,
                                    path,
                                    videos
                            )
                    );
                }
            }

            conn.close();

        } catch (Exception e) {

            e.printStackTrace();
        }

        // ===============================
        // ✅ SORT BY SCORE
        // ===============================
        careers.sort(
                (a, b) ->
                        Integer.compare(
                                b.score,
                                a.score
                        )
        );

        return careers;
    }
}