package com.aistudyplanner;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import io.javalin.Javalin;


public class Main {

    public static void main(String[] args) {

        Javalin app = Javalin.create(config -> {
           config.bundledPlugins.enableCors(cors -> {
    cors.addRule(it -> it.anyHost());
});
        }).start(7000);

        System.out.println("✅ Server running on http://localhost:7000");

        // ✅ TEST ROUTE
        app.get("/", ctx -> ctx.result("SERVER WORKING"));

        // ✅ AUTH ROUTES
        AuthController.registerRoutes(app);

        // 🎯 CAREER ROUTES
         CareerController.registerRoutes(app);

         PlannerController.registerRoutes(app);

         NotesController.registerRoutes(app);

         ChatbotController.registerRoutes(app);

        // =========================
        // 📚 STUDY PLAN API
        // =========================
        app.post("/generate-plan", ctx -> {
            try {
                Student student = ctx.bodyAsClass(Student.class);

                List<String> subjects = student.getSubjects();
                int hoursPerDay = student.getHoursPerDay();

                if (subjects == null || subjects.isEmpty()) {
                    ctx.json(List.of("❌ Please provide subjects"));
                    return;
                }

                List<String> days = List.of(
                        "Monday","Tuesday","Wednesday",
                        "Thursday","Friday","Saturday","Sunday"
                );

                List<String> plan = new ArrayList<>();
                int index = 0;

                for (String day : days) {

                    if (day.equals("Saturday")) {
                        plan.add("Saturday: Full Mock Test + Revision");
                        continue;
                    }

                    if (day.equals("Sunday")) {
                        plan.add("Sunday: Rest + Light Revision");
                        continue;
                    }

                    String subject = subjects.get(index);
                    int hours = (index == 0) ? hoursPerDay + 2 : hoursPerDay;

                    if (day.equals("Thursday")) {
                        plan.add(day + ": Revision of all subjects");
                    } else {
                        plan.add(day + ": Study " + subject + " for " + hours + " hours");
                    }

                    index = (index + 1) % subjects.size();
                }

                ctx.json(plan);

            } catch (Exception e) {
                e.printStackTrace();
                ctx.json(List.of("❌ Backend Crash"));
            }
        });

        // =========================
        // 🤖 CHAT API (NO AI ERROR)
        // =========================
  app.post("/chat", ctx -> {
    try {
        Map<String, String> body = ctx.bodyAsClass(Map.class);
        String message = body.get("message");

        String reply = AIService.getAIResponse(message);

        ctx.json(Map.of("reply", reply));

    } catch (Exception e) {
        e.printStackTrace();
        ctx.status(500).json(Map.of("reply", "Server Error ❌"));
    }
});
    }
}