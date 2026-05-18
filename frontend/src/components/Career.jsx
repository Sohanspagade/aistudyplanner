import { useState } from "react";
import { getCareer } from "./api";

export default function Career({ onSelectCareer }) {

  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState([]);

  const handleSubmit = async () => {

    const data = {
      interests: interests
        .toLowerCase()
        .split(",")
        .map((i) => i.trim()),

      skills: skills
        .toLowerCase()
        .split(",")
        .map((s) => s.trim()),
    };

    const res = await getCareer(data);

    setResult(res);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-5 text-blue-600">
        🎯 Career Recommendation
      </h2>

      {/* INPUT */}
      <div className="flex gap-3 mb-6">

        <input
          className="border p-2 rounded w-full"
          placeholder="Enter Interests"
          onChange={(e) => setInterests(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Enter Skills"
          onChange={(e) => setSkills(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 rounded"
        >
          Find
        </button>
      </div>

      {/* RESULTS */}
      <div>

        {result.map((item, i) => (

          <div
            key={i}
            className="border rounded-xl p-5 mb-5 shadow-sm"
          >

            {/* CAREER NAME */}
            <div
              className="text-xl font-bold text-blue-700 cursor-pointer"
              onClick={() =>
                onSelectCareer(item.careerName)
              }
            >
              🎯 {item.careerName}
            </div>

            {/* SCORE */}
            <div className="mt-2 text-gray-700">
              <span className="font-semibold">
                Score:
              </span>{" "}
              {item.score}
            </div>

            {/* MATCHED SKILLS */}
            <div className="mt-4">

              <div className="font-semibold text-green-700">
                ✅ Matched Skills
              </div>

              <div className="flex flex-wrap gap-2 mt-2">

                {item.matchedSkills &&
                  item.matchedSkills.map((skill, idx) => (

                    <span
                      key={idx}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            {/* ROADMAP */}
            <div className="mt-5">

              <div className="font-semibold text-purple-700 mb-2">
                🛣️ Career Roadmap
              </div>

              {item.roadmap &&
                item.roadmap.map((step, idx) => (

                  <div
                    key={idx}
                    className="ml-2 mb-2 text-gray-700"
                  >
                    ➜ {step}
                  </div>
                ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}