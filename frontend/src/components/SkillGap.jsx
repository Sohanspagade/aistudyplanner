import { useEffect, useState } from "react";
import { getSkillGap } from "./api";

export default function SkillGap({ career }) {
  const [data, setData] = useState({});

  useEffect(() => {
    if (career) {
      getSkillGap({
        career,
        skills: ["html", "css"] // later dynamic
      }).then(setData);
    }
  }, [career]);

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">

      <h3 className="text-lg font-bold mb-4 text-purple-600">
        📊 Skill Gap
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded">
          <h4 className="font-bold text-green-600">✅ You Have</h4>
          <p>{data.have?.join(", ") || "None"}</p>
        </div>

        <div className="bg-red-50 p-4 rounded">
          <h4 className="font-bold text-red-600">❌ Missing</h4>
          <p>{data.missing?.join(", ") || "None"}</p>
        </div>
      </div>
    </div>
  );
}