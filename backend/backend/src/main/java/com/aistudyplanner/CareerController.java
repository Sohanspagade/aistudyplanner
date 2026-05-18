package com.aistudyplanner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.javalin.Javalin;

public class CareerController {

    // ===============================
    // 🔗 REGISTER ALL ROUTES
    // ===============================
    public static void registerRoutes(Javalin app) {

        // ===============================
        // 🎯 CAREER RECOMMENDATION API
        // ===============================
        app.post("/career/recommend", ctx -> {

            CareerRequestDTO request =
                    ctx.bodyAsClass(CareerRequestDTO.class);

            List<String> interests =
                    request.interests != null
                            ? request.interests
                            : new ArrayList<>();

            List<String> skills =
                    request.skills != null
                            ? request.skills
                            : new ArrayList<>();

            // ✅ DATABASE SERVICE CALL
            List<CareerResponseDTO> result =
                    CareerService.recommendCareers(
                            interests,
                            skills
                    );

            // ✅ FALLBACK
            if (result.isEmpty()) {

                result.add(
                        new CareerResponseDTO(
                                "Explore Careers",
                                1,
                                List.of("Try different interests"),
                                List.of(
                                        "Explore Careers",
                                        "Learn Skills",
                                        "Build Projects",
                                        "Choose Path"
                                ),
                                new ArrayList<>()
                        )
                );
            }

            ctx.json(result);
        });

        // ===============================
        // 🛣️ ROADMAP API
        // ===============================
        app.get("/career/roadmap", ctx -> {

            String career = ctx.queryParam("careerName");

            List<CareerRoadmap> roadmap =
                    new ArrayList<>();

            // ✅ SOFTWARE DEVELOPER
            if (career != null &&
                    career.equalsIgnoreCase("Software Developer")) {

                roadmap.add(
                        new CareerRoadmap(
                                "Learn Basics",
                                "Start with Java or Python",
                                1
                        )
                );

                roadmap.add(
                        new CareerRoadmap(
                                "DSA",
                                "Practice Data Structures",
                                2
                        )
                );

                roadmap.add(
                        new CareerRoadmap(
                                "Projects",
                                "Build Real Applications",
                                3
                        )
                );

                roadmap.add(
                        new CareerRoadmap(
                                "Internship",
                                "Apply for internships",
                                4
                        )
                );
            }

            // ✅ DATA SCIENTIST
            else if (career != null &&
                    career.equalsIgnoreCase("Data Scientist")) {

                roadmap.add(
                        new CareerRoadmap(
                                "Math & Statistics",
                                "Learn statistics and probability",
                                1
                        )
                );

                roadmap.add(
                        new CareerRoadmap(
                                "Python",
                                "Learn Python and Pandas",
                                2
                        )
                );

                roadmap.add(
                        new CareerRoadmap(
                                "Machine Learning",
                                "Learn ML algorithms",
                                3
                        )
                );

                roadmap.add(
                        new CareerRoadmap(
                                "Projects",
                                "Build AI projects",
                                4
                        )
                );
            }

            // ✅ DOCTOR
            else if (career != null &&
                    career.equalsIgnoreCase("Doctor")) {

                roadmap.add(
                        new CareerRoadmap(
                                "PU Science",
                                "Take Biology stream",
                                1
                        )
                );

                roadmap.add(
                        new CareerRoadmap(
                                "NEET",
                                "Prepare for NEET exam",
                                2
                        )
                );

                roadmap.add(
                        new CareerRoadmap(
                                "MBBS",
                                "Complete medical degree",
                                3
                        )
                );

                roadmap.add(
                        new CareerRoadmap(
                                "Specialization",
                                "Choose specialization",
                                4
                        )
                );
            }

            ctx.json(roadmap);
        });

        // ===============================
        // 📊 SKILL GAP API
        // ===============================
        app.post("/career/skill-gap", ctx -> {

            SkillGapRequest request =
                    ctx.bodyAsClass(SkillGapRequest.class);

            List<String> requiredSkills =
                    new ArrayList<>();

            // ✅ SOFTWARE DEVELOPER
            if (request.career != null &&
                    request.career.equalsIgnoreCase(
                            "Software Developer")) {

                requiredSkills = List.of(
                        "java",
                        "dsa",
                        "git",
                        "projects"
                );
            }

            // ✅ DATA SCIENTIST
            else if (request.career != null &&
                    request.career.equalsIgnoreCase(
                            "Data Scientist")) {

                requiredSkills = List.of(
                        "python",
                        "statistics",
                        "machine learning",
                        "sql"
                );
            }

            // ✅ DOCTOR
            else if (request.career != null &&
                    request.career.equalsIgnoreCase(
                            "Doctor")) {

                requiredSkills = List.of(
                        "biology",
                        "communication",
                        "diagnosis"
                );
            }

            List<String> userSkills =
                    request.skills != null
                            ? request.skills
                            : new ArrayList<>();

            List<String> missing =
                    new ArrayList<>();

            for (String skill : requiredSkills) {

                if (!userSkills.contains(
                        skill.toLowerCase())) {

                    missing.add(skill);
                }
            }

            Map<String, Object> response =
                    new HashMap<>();

            response.put("have", userSkills);
            response.put("missing", missing);

            ctx.json(response);
        });
    }

    // ===============================
    // 📦 DTO CLASSES
    // ===============================

    // ✅ REQUEST DTO
    public static class CareerRequestDTO {

        public List<String> interests;
        public List<String> skills;
    }

    // ✅ SKILL GAP DTO
    public static class SkillGapRequest {

        public String career;
        public List<String> skills;
    }

    // ✅ RESPONSE DTO
    public static class CareerResponseDTO {

        public String careerName;
        public int score;
        public List<String> matchedSkills;
        public List<String> roadmap;

        // ✅ VIDEOS
        public List<CareerVideoDTO> videos;

        public CareerResponseDTO(
                String careerName,
                int score,
                List<String> matchedSkills,
                List<String> roadmap,
                List<CareerVideoDTO> videos
        ) {

            this.careerName = careerName;
            this.score = score;
            this.matchedSkills = matchedSkills;
            this.roadmap = roadmap;
            this.videos = videos;
        }
    }

    // ✅ ROADMAP DTO
    public static class CareerRoadmap {

        public String stepTitle;
        public String description;
        public int stepOrder;

        public CareerRoadmap(
                String stepTitle,
                String description,
                int stepOrder
        ) {

            this.stepTitle = stepTitle;
            this.description = description;
            this.stepOrder = stepOrder;
        }
    }
}