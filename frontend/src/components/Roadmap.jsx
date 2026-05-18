import { useEffect, useState } from "react";
import { getRoadmap } from "./api";

export default function Roadmap({ career }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (career) getRoadmap(career).then(setData);
  }, [career]);

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">

      <h3 className="text-lg font-bold mb-4 text-green-600">
        🛣️ Roadmap
      </h3>

      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded shadow">
            <p className="font-semibold">
              Step {item.stepOrder}: {item.stepTitle}
            </p>
            <p className="text-sm text-gray-600">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}