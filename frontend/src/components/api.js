const BASE_URL = "http://localhost:7000";

// ===============================
// 🎯 CAREER RECOMMENDATION
// ===============================
export async function getCareer(data) {

  try {

    const response = await fetch(
      `${BASE_URL}/career/recommend`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch careers");
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Career API Error:",
      error
    );

    return [];
  }
}

// ===============================
// 🛣️ CAREER ROADMAP
// ===============================
export async function getRoadmap(careerName) {

  try {

    const response = await fetch(
      `${BASE_URL}/career/roadmap?careerName=${encodeURIComponent(careerName)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch roadmap");
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Roadmap API Error:",
      error
    );

    return [];
  }
}

// ===============================
// 📊 SKILL GAP ANALYSIS
// ===============================
export async function getSkillGap(data) {

  try {

    const response = await fetch(
      `${BASE_URL}/career/skill-gap`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch skill gap");
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Skill Gap API Error:",
      error
    );

    return {
      have: [],
      missing: [],
    };
  }
}

// ===============================
// 🎥 STUDY VIDEOS
// ===============================
export async function getVideos(topic) {

  try {

    const response = await fetch(
      `${BASE_URL}/career/videos?topic=${encodeURIComponent(topic)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Videos API Error:",
      error
    );

    return [];
  }
}