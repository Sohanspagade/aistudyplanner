package com.aistudyplanner;

import org.json.JSONArray;
import org.json.JSONObject;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class AIService {

   private static final String apiKey = "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"; // 🔥 PUT REAL KEY

    public static String getAIResponse(String message) {

        try {
            OkHttpClient client = new OkHttpClient();

            JSONObject json = new JSONObject();
            json.put("model", "openai/gpt-3.5-turbo");

           JSONArray messages = new JSONArray();

// ✅ SYSTEM MESSAGE (AI BEHAVIOR)
messages.put(new JSONObject()
        .put("role", "system")
        .put("content", "You are a helpful AI study assistant. Give clear, short and student-friendly answers."));

// ✅ USER MESSAGE
messages.put(new JSONObject()
        .put("role", "user")
        .put("content", message));

            json.put("messages", messages);

            MediaType JSON = MediaType.parse("application/json");

            RequestBody body = RequestBody.create(json.toString(), JSON);

            Request request = new Request.Builder()
                    .url("https://openrouter.ai/api/v1/chat/completions")
                    .post(body)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .build();

            Response response = client.newCall(request).execute();

            // 🔥 GET RAW RESPONSE
String responseBody = response.body().string();

// 🔥 PRINT RESPONSE (VERY IMPORTANT FOR DEBUG)
System.out.println("RAW RESPONSE: " + responseBody);

// 🔥 CONVERT TO JSON
JSONObject resJson = new JSONObject(responseBody);

// ❌ HANDLE ERROR RESPONSE FROM API
if (resJson.has("error")) {
    JSONObject error = resJson.getJSONObject("error");

    String messageError = error.has("message")
            ? error.getString("message")
            : "Unknown API error";

    return "API Error ❌: " + messageError;
}

// ❌ HANDLE MISSING "choices"
if (!resJson.has("choices")) {
    return "Invalid API response ❌";
}

// ✅ SAFE PARSING
return resJson
        .getJSONArray("choices")
        .getJSONObject(0)
        .getJSONObject("message")
        .getString("content");

        } catch (Exception e) {
            e.printStackTrace();
            return "AI Error ❌";
        }
    }
}